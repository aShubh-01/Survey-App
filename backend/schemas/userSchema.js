const z = require('zod');

const emailSchema = z.string().min(1, { message: "Email cannot be empty "}).email( {message: "Email must contain '@'"}).includes('@gmail.com', { message: "Email must include valid domain names (eg. gmail.com)"});

module.exports = {
    emailSchema
}