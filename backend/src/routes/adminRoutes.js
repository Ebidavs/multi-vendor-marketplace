const express = require('express');
const router = express.Router();

const { protect, restrictTo } = require('../middlewares/auth');
const { validator } = require('../middlewares/userValidator');
const { adminRegisterSchema, changePasswordSchema } = require('../zodSchemas/user-zodSchema');
const adminController = require('../controllers/adminController');

const userController = require('../controllers/userController')

router.post('/create-admin', protect, restrictTo('admin'), validator(adminRegisterSchema), adminController.createAdmin);



module.exports = router;