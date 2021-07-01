const { Contact } = require('../db/contactModel')

const listContacts = async (owner, { page, limit }) => {
  const contacts = await Contact
    .paginate({ owner }, { page, limit })
  return contacts
}

const getContactById = async (contactId, owner) => {
  const contact = await Contact.findOne({ _id: contactId, owner }).select({ __v: 0, owner: 0, _id: 0 })

  return contact
}

const addContact = async ({ name, email, phone }, owner) => {
  const contact = new Contact({
    id: new Date().getTime().toString(),
    name,
    email,
    phone,
    owner
  })
  await contact.save()
  return contact
}

const updateContact = async (contactId, body, owner) => {
  const updatedContact = await Contact.
    findOneAndUpdate(
      { _id: contactId, owner },
      { $set: body },
      { new: true }
    )
  return updatedContact
}

const updateStatusContact = async (contactId, { favorite }, owner) => {
  const updatedContact = await Contact.findOneAndUpdate({ _id: contactId, owner }, { $set: favorite }, { new: true })
  return updatedContact
}

const removeContact = async (contactId, owner) => {
  return await Contact.findOneAndRemove({ _id: contactId, owner })
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  updateStatusContact,
  removeContact
}
