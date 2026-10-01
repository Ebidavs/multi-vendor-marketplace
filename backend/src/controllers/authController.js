const { User, Customer, Vendor } = require('../models/user')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


//password reset and account reactivation

const { Otp } = require('../models/otp');
const { sendEmail } = require('../config/mailerConfig');
const { verifyOtpHelper, generateOtpCode, OTP_EXPIRY_MINUTES} = require('../utils/otpHelper');
const { setRelatedResourcesActive } = require('../utils/accountLifecycle');


exports.register = async (req, res) => {
  try{
    const { role, password, phoneNumber,  ...rest } = req.body;
    const email = req.body.email.toLowerCase().trim();

    const existingUser = await User.findOne({ 
      $or: [ { email }, { phoneNumber }]
    })

    if( existingUser ){
      const usedField = existingUser.email === email ? 'email' : 'Phone Number' 
      return res.status(409).json({
        success: false,
        message: `An account with this ${usedField} already exist`,
        data: null
      })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const Model = role === 'customer' ? Customer : Vendor
    
    const user = new Model({
      ...rest,
      email,
      phoneNumber,
      password: hashedPassword
    })
    
    await user.save()

    user.password = undefined
    
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
    
  } catch(err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      data: null
    });
  }
}


exports.logIn = async (req, res) => {
  try{
    const { password } = req.body;
    const email = req.body.email.toLowerCase().trim();
    
    const user = await User.findOne({ email }).select('+password');
 
    if (!user){
        return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
          return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          data: null,
        });
    }

    if (user.deletedAt) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password', 
        data: null });
    }

    if(!user.isActive){
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated',
        data: null,
      });
    }

   
    

    const token = jwt.sign(
      {id: user._id, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN }
    )
    
    user.password = undefined;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token, user }
   
    }); 

  } catch (err){
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      data: null
    });
  }
}


exports.generateOtp = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { purpose } = req.body;

    const user = await User.findOne({ email });

    let eligible;
    if (purpose === 'password-reset') {
      eligible = Boolean(user) && !user.deletedAt;
    } else if (purpose === 'account-reactivation') {
      eligible = Boolean(user) && !user.deletedAt && !user.isActive;
    } else {
      eligible = false;
    }

    if (!eligible) {
      return res.status(200).json({
        success: true,
        message: 'If eligible, an OTP has been sent',
        data: null,
      });
    }

    const otp = generateOtpCode();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await Otp.deleteMany({ email, purpose });
    const otpRecord = new Otp({ email, otp: hashedOtp, purpose, expiresAt });
    await otpRecord.save()

    const subject = purpose === 'password-reset'
      ? 'Your password reset code'
      : 'Your account reactivation code';

    const text = purpose === 'password-reset'
      ? `Your password reset OTP is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`
      : `Your account reactivation OTP is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`;

    const html = purpose === 'password-reset'
      ? `<p>Your password reset OTP is <strong>${otp}</strong>. It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`
      : `<p>Your account reactivation OTP is <strong>${otp}</strong>. It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`;

    try {
      await sendEmail({ to: email, subject, text, html });
    } catch (emailErr) {
      await Otp.deleteOne({ _id: otpRecord._id });
      console.log(emailErr);
      return res.status(500).json({
        success: false,
        message: "We couldn't send your code right now. Please try again shortly.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'If eligible, an OTP has been sent',
      data: null,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Something went wrong, please try again', data: null });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { otp, purpose } = req.body;

    const result = await verifyOtpHelper({ email, otp, purpose });

    if (!result.valid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP', data: null });
    }

    return res.status(200).json({ success: true, message: 'OTP verified', data: null });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Something went wrong, please try again', data: null });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { otp, newPassword } = req.body;
    const purpose = 'password-reset';

    const result = await verifyOtpHelper({ email, otp, purpose });
    if (!result.valid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP', data: null });
    }

    const user = await User.findOne({ email });
    if (!user || user.deletedAt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP', data: null });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await Otp.deleteOne({ _id: result.record._id });

    return res.status(200).json({ success: true, message: 'Password reset successfully', data: null });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Something went wrong, please try again', data: null });
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { otp } = req.body;
    const purpose = 'account-reactivation';

    const result = await verifyOtpHelper({ email, otp, purpose });
    if (!result.valid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP', data: null });
    }

    const user = await User.findOne({ email });
    if (!user || user.deletedAt) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP', data: null });
    }

    if (user.isActive) {
      return res.status(400).json({ success: false, message: 'Account is already active', data: null });
    }

    await setRelatedResourcesActive(user, true);
    user.isActive = true;
    await user.save();
    await Otp.deleteOne({ _id: result.record._id });

    return res.status(200).json({ success: true, message: 'Account reactivated successfully', data: null });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Something went wrong, please try again', data: null });
  }
};
