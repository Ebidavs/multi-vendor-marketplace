const express = require('express')
const router = express.Router()

//validators
const { validator } = require('../middlewares/userValidator')

//validator schemas
const { createUserSchema, loginSchema } = require('../zodSchemas/user-zodSchema')

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

module.exports = router;