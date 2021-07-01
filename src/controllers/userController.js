const jwt = require('jsonwebtoken');
const { subscriptionChange, registration, login, logout, current } = require('../services/userService')

const updateSubscriptionController = async (req, res, next) => {
    const { authorization } = req.headers
    const { subscription } = req.body

    const [, token] = authorization.split(" ")
    const userDecode = jwt.decode(token, process.env.JWT_SECRET)

    await subscriptionChange(userDecode._id, subscription)
    res.status(200).json({
        "user": {
            "subscription": subscription
        }
    })
}

const registrationController = async (req, res, next) => {
    const { email, password } = req.body
    await registration(email, password)
    res.status(201).json({
        "user": {
            "email": email,
            "subscription": "starter"
        }
    })
}

const loginController = async (req, res, next) => {
    const { email, password } = req.body
    const token = await login(email, password)
    return res.status(200).json({
        "token": token,
        "user": {
            "email": email,
            "subscription": "starter"
        }
    })
}

const logoutController = async (req, res, next) => {
    const { authorization } = req.headers
    const [, token] = authorization.split(" ")

    const userDecode = jwt.decode(token, process.env.JWT_SECRET)

    await logout(userDecode._id)
    return res.status(204).json()
}


const currentController = async (req, res, next) => {
    const { authorization } = req.headers
    const [, token] = authorization.split(" ")

    const userDecode = jwt.decode(token, process.env.JWT_SECRET)

    const user = await current(userDecode._id)

    return res.status(200).json({
        "email": user.email,
        "subscription": user.subscription
    })
}

module.exports = {
    updateSubscriptionController,
    registrationController,
    loginController,
    logoutController,
    currentController
}
