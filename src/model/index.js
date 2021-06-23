const { Contact } = require('./contactModel')

const listContacts = async () => {
  const contacts = await Contact.find({})
  return contacts
}

const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId)
  return contact
}

const addContact = async ({ name, email, phone }) => {
  const contact = new Contact({
    id: new Date().getTime().toString(),
    name,
    email,
    phone,
  })
  await contact.save()
  return contact
}

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body
  let dataToChange = {}
  if (name) { dataToChange = { ...dataToChange, name } }
  if (email) { dataToChange = { ...dataToChange, email } }
  if (phone) { dataToChange = { ...dataToChange, phone } }

  const updatedContact = await Contact.findByIdAndUpdate(contactId, { $set: { dataToChange } }, { new: true })
  return updatedContact
}

const updateStatusContact = async (contactId, { favorite }) => {
  const updatedContact = await Contact.findByIdAndUpdate(contactId, { $set: { favorite } }, { new: true })
  return updatedContact
}

const removeContact = async (contactId) => {
  return await Contact.findByIdAndRemove(contactId)
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact
}
