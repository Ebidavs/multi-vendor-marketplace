const jwt = require('jsonwebtoken');
const { User } = require('../models/user');


const protect = async (req, res, next) => {
  try{
    const authHeader = req.headers.authorization;

    if(!authHeader){
      return res.status(401).json({
        success: false,
        message: 'No token provided',
        data: null,
      });
    }

    if (!authHeader.startsWith('Bearer ')){
       return res.status(401).json({
        success: false,
        message: 'Token provided inappropriately',
        data: null,
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
        data: null,
      });
    }
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    //this uses the user id  provide in the JWT to get real user data ensuring that whatever user data in req.user is up to date. 
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
        data: null,
      });
    }

    if (user.deletedAt) {
      return res.status(401).json({ 
        success: false, 
        message: 'User no longer exists',
        data: null
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated',
        data: null,
      });
    }

    

   
    req.user = user
   

    next()


  } catch (err){
     if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
          data: null,
        });
      }

      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Something went wrong, please try again',
        data: null,
      });
  }
}


const restrictTo = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to perform this action',
      data: null
    });
  }
  next();
};

module.exports = { protect, restrictTo }