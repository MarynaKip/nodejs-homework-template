const express = require("express");
const router = express.Router();

const { asyncWrapper } = require('../../helpers/apiHelpers')

const { contactValidation } = require('../../middlewares/validationMiddleware')

const {
    listContactsController,
    getContactByIdController,
    removeContactController,
    updateContactController,
    updateContactFavoriteController,
    addContactController
} = require('../../controllers/contactsController')


router.get("/", asyncWrapper(listContactsController));

router.get("/:contactId", asyncWrapper(getContactByIdController));

router.post("/", contactValidation, asyncWrapper(addContactController));

router.patch("/:contactId", contactValidation, asyncWrapper(updateContactController));

router.patch("/:contactId/favorite", contactValidation, asyncWrapper(updateContactFavoriteController));

router.delete("/:contactId", asyncWrapper(removeContactController));


module.exports = { contactsRouter: router };
