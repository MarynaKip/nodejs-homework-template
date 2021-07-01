const express = require("express");
const router = express.Router();

const { asyncWrapper } = require('../../helpers/apiHelpers')
const { authValidation, subscriptionValidation } = require('../../middlewares/validationMiddleware')
const { tokenMiddleware } = require('../../middlewares/authMiddleware')

const {
    updateSubscriptionController,
    registrationController,
    loginController,
    logoutController,
    currentController
} = require('../../controllers/userController')

router.patch("/", subscriptionValidation, asyncWrapper(updateSubscriptionController));
router.post("/signup", authValidation, asyncWrapper(registrationController));
router.post("/login", authValidation, asyncWrapper(loginController));
router.post("/logout", tokenMiddleware, asyncWrapper(logoutController));
router.post("/current", tokenMiddleware, asyncWrapper(currentController));

module.exports = { userRouter: router };
