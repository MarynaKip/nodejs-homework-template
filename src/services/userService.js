const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
var Jimp = require('jimp');
const path = require("path");

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
        email, password,
        avatarURL: gravatar.url(email)
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

const avatarUpload = async (userId, URL, fileName) => {
    const READ_FILE_DIR = path.resolve(`./tmp/${fileName}`);
    const WRITE_FILE_DIR = path.resolve('./public/avatars');
    const [, , , , imageNewName] = URL.split('/')
    const [, extension] = fileName.split('.');

    Jimp.read(READ_FILE_DIR)
        .then(image => {
            image
                .resize(250, 250)
                .write(`${WRITE_FILE_DIR}'\'${imageNewName}.${extension}`)
        })

        .catch(err => {
            console.log(err.message);
        });

    const filePath = `/avatars/${imageNewName}.${extension}`
    await User.findOneAndUpdate({ _id: userId }, { $set: { avatarURL: filePath } }, { new: true })
}

module.exports = { subscriptionChange, registration, login, logout, avatarUpload }