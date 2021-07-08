const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
var Jimp = require('jimp');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");

const { User } = require("../db/userModel")
const { ValidationError, ConflictError, UnauthorizedError, NotFoundUserError } = require('../helpers/errors')

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

    const verificationToken = uuidv4()
    user.verifyToken = verificationToken

    await user.save()

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'test.sender12345678@gmail.com',
            pass: 'Test.sender12345678@gmail.com@',
        },
        tls: {
            rejectUnauthorized: false
        }

    });

    let info = await transporter.sendMail({
        from: 'Mailer Test <test.sender12345678@gmail.com>',
        to: user.email,
        subject: "Please, verify your email!",
        text: `Please, <a href="http://127.0.0.1:8080/users/verify/${verificationToken}/">confirm</a> your email address`,
        html: `Please, <a href="http://127.0.0.1:8080/users/verify/${verificationToken}/">confirm</a> your email address`,
    });
}

const login = async (email, password) => {
    const user = await User.findOne({ email, verify: true })

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

const verification = async (verificationToken) => {
    const user = await User.findOne({
        verifyToken: verificationToken,
        verify: false
    })
    if (!user) {
        throw new NotFoundUserError('User not found')
    }

    user.verify = true;
    await user.save()


    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'test.sender12345678@gmail.com',
            pass: 'Test.sender12345678@gmail.com@',
        },
        tls: {
            rejectUnauthorized: false
        }

    });

    let info = await transporter.sendMail({
        from: 'Mailer Test <test.sender12345678@gmail.com>',
        to: user.email,
        subject: "Thank you for registration!",
        text: `You have been succesfully registrated. Thank you.`,
        html: `You have been succesfully registrated. Thank you.`,
    });
}


const verificationResending = async (email) => {
    const user = await User.findOne({
        email
    })

    if (!user) {
        throw new ValidationError('Ошибка от Joi или другой библиотеки валидации')
    }

    if (user.verify === true) {
        throw new ValidationError('Verification has already been passed')
    }

    const verificationToken = user.verifyToken

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'test.sender12345678@gmail.com',
            pass: 'Test.sender12345678@gmail.com@',
        },
        tls: {
            rejectUnauthorized: false
        }

    });

    let info = await transporter.sendMail({
        from: 'Mailer Test <test.sender12345678@gmail.com>',
        to: user.email,
        subject: "Please, verify your email!",
        text: `Please, <a href="http://127.0.0.1:8080/users/verify/${verificationToken}/">confirm</a> your email address`,
        html: `Please, <a href="http://127.0.0.1:8080/users/verify/${verificationToken}/">confirm</a> your email address`,
    });
}


module.exports = {
    subscriptionChange,
    registration,
    login,
    logout,
    avatarUpload,
    verification,
    verificationResending
}