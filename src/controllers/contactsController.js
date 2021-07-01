const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact,
} = require('../services/contactsService')

const listContactsController = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 5 } = req.query

  const list = await listContacts(owner, { page, limit })
  res.status(200).json({ list, page, limit })
}

const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params
  const { _id: owner } = req.user;

  const contact = await getContactById(contactId, owner)
  return res.status(200).json({ contact })
}

const addContactController = async (req, res, next) => {
  const { name, email, phone } = req.body
  const { _id: owner } = req.user;

  const returnContact = await addContact({ name, email, phone }, owner)
  res.status(200).json(returnContact)
}

const updateContactController = async (req, res, next) => {
  const { contactId } = req.params
  const { _id: owner } = req.user;

  const updatedContact = await updateContact(contactId, req.body, owner)

  if (updatedContact) {
    return res.status(200).json({ updatedContact })
  }
  res.status(404).json({ message: 'Not found' })
}

const updateContactFavoriteController = async (req, res, next) => {
  const { contactId } = req.params
  const { favorite } = req.body
  const { _id: owner } = req.user;

  if (!favorite) {
    return res.status(400).json({ message: 'missing field favorite' })
  }

  const updatedContact = await updateStatusContact(contactId, { favorite }, owner)

  if (updatedContact) {
    return res.status(200).json({ updatedContact })
  }
  res.status(404).json({ message: 'Not found' })
}

const removeContactController = async (req, res, next) => {
  const { contactId } = req.params
  const { _id: owner } = req.user;

  const result = await removeContact(contactId, owner)
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
