const express = require("express");
const router = express.Router();

const { asyncWrapper } = require('../../helpers/apiHelpers')

const { addContactValidation, updateContactValidation } = require('../../middlewares/validationMiddleware')
const {
    tokenMiddleware
} = require('../../middlewares/authMiddleware')

const {
    listContactsController,
    getContactByIdController,
    removeContactController,
    updateContactController,
    updateContactFavoriteController,
    addContactController
} = require('../../controllers/contactsController')

router.use(tokenMiddleware)

router.get("/", asyncWrapper(listContactsController));
router.get("/:contactId", asyncWrapper(getContactByIdController));
router.post("/", addContactValidation, asyncWrapper(addContactController));
router.patch("/:contactId", updateContactValidation, asyncWrapper(updateContactController));
router.patch("/:contactId/favorite", updateContactValidation, asyncWrapper(updateContactFavoriteController));
router.delete("/:contactId", asyncWrapper(removeContactController));


module.exports = { contactsRouter: router };
