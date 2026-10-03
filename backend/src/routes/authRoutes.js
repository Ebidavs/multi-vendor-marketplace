const express = require('express')
const router = express.Router()

//validators
const { validator } = require('../middlewares/userValidator')

//validator schemas
const { createUserSchema, loginSchema } = require('../zodSchemas/user-zodSchema')

const {  emailOnlySchema, emailAndOtpSchema, resetPasswordSchema } = require('../zodSchemas/otp-zodSchema')



//auth controller for user registration and log in
const authController = require('../controllers/authController')


router.post(
  '/register', 
  validator(createUserSchema), authController.register)

router.post(
  '/login',
  validator(loginSchema),
  authController.logIn
)





// password reset flow
router.post('/forgot-password', validator(emailOnlySchema), (req, res) => {
  req.body.purpose = 'password-reset';
  authController.generateOtp(req, res);
});

router.post('/verify-reset-otp', validator(emailAndOtpSchema), (req, res) => {
  req.body.purpose = 'password-reset';
  authController.verifyOtp(req, res);
});

router.post('/reset-password', validator(resetPasswordSchema), authController.resetPassword);


// account reactivation flow
router.post('/reactivate/request', validator(emailOnlySchema), (req, res) => {
  req.body.purpose = 'account-reactivation';
  authController.generateOtp(req, res);
});

router.post('/reactivate/verify', validator(emailAndOtpSchema), (req, res) => {
  req.body.purpose = 'account-reactivation';
  authController.verifyOtp(req, res);
});

router.post('/reactivate/confirm', validator(emailAndOtpSchema), authController.activateAccount);







module.exports = router;