require('dotenv').config({ path: './.env' });
const { withAccelerate } = require('@prisma/extension-accelerate');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const port = process.env.PORT || 3000;

const jwtSecret = process.env.JWT_SECRET_KEY;

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
}).$extends(withAccelerate());

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

module.exports = {
    port,
    jwtSecret,
    prisma,
    transporter
}