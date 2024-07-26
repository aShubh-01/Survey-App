const express = require('express');
const { sendVerificationCode, verifyCode, signUp } = require('../controllers/user')

const userRouter = express.Router();

userRouter.post('/send', sendVerificationCode)
userRouter.post('/verify', verifyCode, signUp)

module.exports = userRouter;