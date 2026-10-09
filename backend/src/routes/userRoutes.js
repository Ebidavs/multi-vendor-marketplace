const express = require('express')
const router = express.Router()

//validators
const { validator, updateValidator } = require('../middlewares/userValidator');

//validator schema
const { changePasswordSchema } = require('../zodSchemas/user-zodSchema')

//auth
const { protect } = require('../middlewares/auth')

//user controller
const userController = require('../controllers/userController')

router.put('/update-profile', protect, updateValidator, userController.updateProfile)

router.put('/change-password', protect, validator(changePasswordSchema), userController.changePassword)

router.get('/me', protect, userController.getProfile)

router.delete('/delete-account', protect, userController.deleteAccount)

router.put('/deactivate-account', protect, userController.deactivateAccount)

router.post('/logout', protect, userController.logOut)

module.exports = router;