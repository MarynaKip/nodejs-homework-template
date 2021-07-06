const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { asyncWrapper } = require('../../helpers/apiHelpers')
const { authValidation, subscriptionValidation } = require('../../middlewares/validationMiddleware')
const { tokenMiddleware } = require('../../middlewares/authMiddleware')

const {
    updateSubscriptionController,
    registrationController,
    loginController,
    logoutController,
    currentController,
    avatarUploadController
} = require('../../controllers/userController')

const FILE_DIR = path.resolve('./tmp');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, FILE_DIR)
    },
    filename: (req, file, cb) => {

        const [, extension] = file.originalname.split('.');
        cb(null, file.originalname)
    }
})
const avatarMiddleware = multer({ storage })

router.patch("/", subscriptionValidation, asyncWrapper(updateSubscriptionController));
router.post("/signup", authValidation, asyncWrapper(registrationController));
router.post("/login", authValidation, asyncWrapper(loginController));
router.post("/logout", tokenMiddleware, asyncWrapper(logoutController));
router.post("/current", tokenMiddleware, asyncWrapper(currentController));
router.post('/avatars', tokenMiddleware, avatarMiddleware.single('avatar'), asyncWrapper(avatarUploadController))

module.exports = { userRouter: router };
