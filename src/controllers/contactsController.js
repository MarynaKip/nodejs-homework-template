const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact,
} = require('../model/index')

const listContactsController = async (req, res, next) => {
  const list = await listContacts()
  res.status(200).json({ list })
}

const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params
  const contact = await getContactById(contactId)
  return res.status(200).json({ contact })
}

const addContactController = async (req, res, next) => {
  const { name, email, phone } = req.body

  // ADD CUSTOM EROOR HANDLER
  if (!name) {
    return res.status(400).json({ message: 'missing required name field' })
  }
  if (!email) {
    return res.status(400).json({ message: 'missing required email field' })
  }
  if (!phone) {
    return res.status(400).json({ message: 'missing required phone field' })
  }

  const returnContact = await addContact({ name, email, phone })
  res.status(200).json(returnContact)
}

const updateContactController = async (req, res, next) => {
  const { contactId } = req.params
  const { name, email, phone } = req.body

  if (!name && !email && !phone) {
    return res.status(400).json({ message: 'missing fields' })
  }

  const updatedContact = await updateContact(contactId, req.body)

  if (updatedContact) {
    return res.status(200).json({ updatedContact })
  }
  res.status(404).json({ message: 'Not found' })
}

const updateContactFavoriteController = async (req, res, next) => {
  const { contactId } = req.params
  const { favorite } = req.body

  if (!favorite) {
    return res.status(400).json({ message: 'missing field favorite' })
  }

  const updatedContact = await updateStatusContact(contactId, { favorite })

  if (updatedContact) {
    return res.status(200).json({ updatedContact })
  }
  res.status(404).json({ message: 'Not found' })
}

const removeContactController = async (req, res, next) => {
  const { contactId } = req.params
  const result = await removeContact(contactId)
  if (result) {
    return res.status(200).json({ message: result })
  }
  res.status(404).json({ message: 'Not found' })
}

module.exports = {
  listContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  updateContactFavoriteController,
  removeContactController,
}
