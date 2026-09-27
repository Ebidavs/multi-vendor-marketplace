const { User, Customer, Vendor, Admin}  = require('../models/user')
const bcrypt = require('bcryptjs')

exports.updateProfile = async (req, res) => {
  try{
    const id  = req.user.id;
    const updates = req.body;

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
        message: 'User not found'
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
      message: "Something went wrong, please try again"
    });
  }
}


exports.getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong, please try again',
    });
  }
};


//assuming that products created by vendor is 
exports.deleteProfile = async (req, res) => {
  try{
    
    const id = req.user.id;
    const role = req.user.role;

    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts cannot be self-deleted. Contact another admin to remove your account.',
      });
    }

    if (role === 'vendor') {
      // vendor - soft delete — preserve the record so products added will be always be linked to a vendor account
      const user = await User.findByIdAndUpdate(
        id, 
        { isActive: false }, 
        { new: true });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({ success: true, message: 'Vendor account deactivated' });
    }

    // customers — hard delete
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, message: 'Account deleted successfully' });


  } catch(err){
    console.log(err)
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again"
    });
  }
}



exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Something went wrong, please try again' });
  }
};