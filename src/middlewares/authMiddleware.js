const jwt = require('jsonwebtoken');

const { User } = require('../db/userModel')
const { UnauthorizedError } = require("../helpers/errors")

const tokenMiddleware = async (req, res, next) => {
    try {
        const { authorization } = req.headers
        if (!authorization) {
            next(new UnauthorizedError('Not authorized. Please, provide a token in authorization header'))
        }
        const [, token] = authorization.split(" ")

        if (!token) {
            next(new UnauthorizedError('Not authorized. Please, provide a token in authorization header'))
        }


        const userDecode = jwt.decode(token, process.env.JWT_SECRET)
        const user = await User.findById(userDecode._id)

        if (!user || user.token !== token) {
            next(new UnauthorizedError('Not authorized.'))
        }

        req.token = token;
        req.user = user;

        next()
    } catch (err) {
        next(new UnauthorizedError('Invalid token'))

    }

}

module.exports = {
    tokenMiddleware
}