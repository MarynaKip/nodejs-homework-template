const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require("../db/userModel")
const { ConflictError, UnauthorizedError } = require('../helpers/errors')

const subscriptionChange = async (userId, subscription) => {
    await User
        .findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    subscription: subscription
                }
            },
            { new: true })
}

const registration = async (email, password) => {
    const alreadyExistingUser = await User.findOne({ email })
    if (alreadyExistingUser) {
        throw new ConflictError(`User with email: '${email}' already exists`)
    }
    const user = new User({
        email, password
    })
    await user.save()
}

const login = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user || !await bcrypt.compare(password, user.password)) {
        throw new UnauthorizedError('Email or password is wrong')
    }

    const token = jwt.sign({
        _id: user._id,
        createdAt: user.createdAt
    }, process.env.JWT_SECRET)

    await User.findOneAndUpdate({ _id: user._id }, { $set: { token: token } })
    return token
}

const logout = async (userId) => {
    await User.findOneAndUpdate({ _id: userId }, { $set: { token: null } }, { new: true })

}

const current = async (userId) => {
    const user = await User.findOne({ _id: userId })

    if (!user) {
        throw new UnauthorizedError('Not authorized')
    }

    return user
}

module.exports = { subscriptionChange, registration, login, logout, current }