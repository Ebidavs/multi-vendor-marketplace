const bcrypt = require('bcryptjs');
const { User, Admin } = require('../models/user');

exports.createAdmin = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    
    const existingUser = await User.findOne({ 
      $or: [ { email}, { phoneNumber}]
    })

    if( existingUser ){
      const usedField = existingUser.email === email ? 'Email' : 'Phone Number' 
      return res.status(409).json({
        message: `An account with this ${usedField} already exist`
      })
    }
        

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const admin = await Admin.create({ ...req.body, password: hashedPassword });
    admin.password = undefined;

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: admin,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong, please try again',
    });
  }
};


