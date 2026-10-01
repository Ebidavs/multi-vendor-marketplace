const { User, Customer, Vendor, Admin}  = require('../models/user')
const bcrypt = require('bcryptjs')

exports.updateProfile = async (req, res) => {
  try{
    const id  = req.user.id;
    const updates = req.body;

    if (updates.email || updates.phoneNumber) {
      const existingUser = await User.findOne({
        _id: { $ne: id },
        $or: [
          ...(updates.email ? [{ email: updates.email.toLowerCase().trim() }] : []),
          ...(updates.phoneNumber ? [{ phoneNumber: updates.phoneNumber }] : []),
        ],
      });

      if (existingUser) {
        const usedField = existingUser.email === updates.email ? 'Email' : 'Phone number';
        return res.status(409).json({
          success: false,
          message: `${usedField} is already in use by another account`,
          data: null,
        });
      }
    }

    if (updates.email) {
      updates.email = updates.email.toLowerCase().trim();
    }

    // const Model = req.user.role === 'customer'? Customer: Vendor
    let Model;
    if (req.user.role === 'vendor') Model = Vendor;
    else if (req.user.role === 'admin') Model = Admin;
    else Model = Customer;
 
    const user = await Model.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if(!user){
      return res.status(400).json({
        success: false,
        message: 'User not found',
        data: null
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Update successful',
      data: user
    }); 

  } catch(err){
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      data: null
    });
  }
}


exports.getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Request successful",
      data: req.user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong, please try again',
      data: null
    });
  }
};


//assuming that products created by vendor is 
exports.deleteAccount = async (req, res) => {
  try{
    
    const id = req.user.id;
    const role = req.user.role;

    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be self-deleted. Contact another admin to remove your account.',
        data: null
      });
    }

      // - soft delete — preserve the record so products added will be always be linked to a vendor account
    const user = await User.findByIdAndUpdate(
      id, 
      { isActive: false, deletedAt: new Date() }, 
      { new: true }
    );

    // TODO: once Address/Review/Product/Shop models are integrated,
    // cascade isActive: false to all records referencing this user's _id
    // (pending final field names/structure from Dev 4)

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found', 
        data: null });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Account deleted successfully', 
      data: null});
    

   


  } catch(err){
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
      data: null
    });
  }
}



exports.deactivateAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const role = req.user.role;

    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be self-deactivated. Contact another admin.',
        data: null,
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    // TODO: once Address/Review/Product/Shop models are integrated,
    // cascade isActive: false to all records referencing this user's _id
    // (pending final field names/structure from Dev 4)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Account deactivated successfully',
      data: null,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong, please try again',
      data: null,
    });
  }
};








exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect', data: null});
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully', data: null });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Something went wrong, please try again', data: null });
  }
};