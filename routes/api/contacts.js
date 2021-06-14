const express = require("express");
const router = express.Router();

const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../../model/index')
const { contactValidation } = require('../../middlewares/validationMiddleware')

router.get("/", async (req, res, next) => {
    try {
        const list = await listContacts()
        res.status(200).json({ list });
    } catch (err) {
        console.log(err.message)
    }

});

router.get("/:contactId", async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const contact = await getContactById(contactId)
        return res.status(200).json({ contact });
    } catch (err) {
        console.log(err.message)
    }

});

router.post("/", contactValidation, async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;

        if (!name) { return res.status(400).json({ "message": "missing required name field" }) }
        if (!email) { return res.status(400).json({ "message": "missing required email field" }) }
        if (!phone) { return res.status(400).json({ "message": "missing required phone field" }) }

        const returnContact = await addContact(req.body)
        res.status(200).json(returnContact);
    } catch (err) {
        console.log(err.message)
    }
});

router.delete("/:contactId", async (req, res, next) => {
    try {
        const { contactId } = req.params
        const result = await removeContact(contactId)
        if (result) { return res.status(200).json({ message: result }) }
        res.status(404).json({ message: "Not found" });

    }
    catch (err) { console.log(err.message); }
});

router.patch("/:contactId", contactValidation, async (req, res, next) => {
    try {
        const { contactId } = req.params

        if (!req.body) { return res.status(400).json({ "message": "missing fields" }) }

        const updatedContact = await updateContact(contactId, req.body)
        if (updatedContact) {
            return res.status(200).json({ updatedContact });

        }
        res.status(404).json({ message: "Not found" });
    } catch (err) {
        console.log(err.message)
    }
});

module.exports = router;
