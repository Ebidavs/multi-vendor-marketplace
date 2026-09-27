const { User, Customer, Vendor } = require('../models/user')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  try{
    const { role, password, email, phoneNumber,  ...rest } = req.body;

    const existingUser = await User.findOne({ 
      $or: [ { email}, { phoneNumber}]
    })

    if( existingUser ){
      const usedField = existingUser.email === email ? 'email' : 'Phone Number' 
      return res.status(409).json({
        message: `An account with this ${usedField} already exist`
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
      message: "Something went wrong, please try again"
    });
  }
}


exports.logIn = async (req, res) => {
  try{
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
  

    if (!user){
        return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if(!user.isActive){
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

   if (!isMatch){
        return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    
    console.log(user._id, user.role)

    const token = jwt.sign(
      {id: user._id, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN }
    )
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
    }); 

  } catch (err){
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again"
    });
  }
}