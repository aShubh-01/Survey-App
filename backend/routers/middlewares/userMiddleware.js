const { jwtSecret } = require('../../config');
const jwt = require('jsonwebtoken');

const checkUser = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const { userId } = jwt.decode(token, jwtSecret);
        if(!userId) {
            res.status(400).json({
                message: "Access Denied/Invalid User"
            })
        }

        req.userId = userId;
        next()

    } catch (err) {
        console.error(err)
        return res.status(403).json({
            message: "Unable to authenticate user"
        })
    }
}

module.exports = {
    checkUser
}