const { transporter, prisma, jwtSecret } = require('../config.js');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateJWT = (data) => {
    const token = jwt.sign(data, jwtSecret);
    return token;
}

const sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    const code = crypto.randomBytes(3).toString('hex');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verification Code for Querious - Survey app',
        html: `<p>Your verification code for survey authentication is <b>${code}</b></p>`
    };
    
    try {
        await transporter.sendMail(mailOptions);
        await prisma.verification.upsert({
            where: { email: email},
            update: { code: code },
            create: {
                email: email,
                code: code
            }
        })

        return res.status(200).json({
            message: "Verification code sent"
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Unable to send verification code"
        })   
    }
};

const verifyCode = async (req, res, next) => {
    const { email, code } = req.body;

    try {
        const { code: expectedCode } = await prisma.verification.findFirst({
            where: { email: email },
            select: { code: true }
        });

        if (!expectedCode || expectedCode !== code) {
            return res.status(400).json({
                message: "Invalid code"
            })
        }

        await prisma.verification.update({
            where: { email: email },
            data: {
                code: null,
                lastVerifiedAt: new Date().toISOString()
            }
        })

        const { id: existingUserId } = await prisma.user.findUnique({
            where: { email: email },
            select: { id: true }
        })

        if(existingUserId){
            const token = generateJWT({ userId: existingUserId})
            return res.status(200).json({
                message: "Verification Successful",
                token: token
            })
        }

        next()

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "Unable to verify code"
        })
    }
}

const signUp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.create({
            data: { email: email },
            select: { id: true }
        });

        const token = generateJWT({ userId: user.id })

        return res.status(200).json({
            message: "Verification Succesful",
            token: token
        })
    
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Unable to sign up"
        })
    }
}

const checkUser = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const { userId } = jwt.decode(token, jwtSecret);
        if(!userId) {
            res.status(400).json({
                message: "Access Denied/Invalid User"
            })
            throw new Error("Access denied")
        }

        req.userId = userId;
        next()
    } catch (err) {
        console.error("Unable to authenticate user")
        return res.status(403).json({
            message: "Access Denied"
        })
    }
}

module.exports = {
    sendVerificationCode,
    verifyCode,
    signUp,
    checkUser
}