// const fs = require('fs/promises')
//const contacts = require('./contacts.json')

const path = require('path');
const fs = require('fs').promises;

const contactsPath = path.resolve(__dirname, './contacts.json');

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath)
    const result = JSON.parse(contacts)
    return result
  } catch (err) {
    console.log(err);
  }
}

const getContactById = async (contactId) => {
  try {
    const contacts = await fs.readFile(contactsPath)
    const result = JSON.parse(contacts)
    const [contact] = result.filter(contact => contact.id === parseInt(contactId))
    return contact
  }
  catch (err) {
    console.log(err);
  }
}

const removeContact = async (contactId) => {
  try {
    const contacts = await fs.readFile(contactsPath)
    const result = JSON.parse(contacts)
    const updatedContacts = result.filter(contact => contact.id !== parseInt(contactId))
    if (result.length !== updatedContacts.length) {
      await fs.writeFile(contactsPath, JSON.stringify(updatedContacts))
      return 'contact deleted'
    }


  }
  catch (err) {
    console.log(err);
  }
}

const addContact = async (body) => {
  const { name, email, phone } = body;
  const contact = {
    id: new Date().getTime().toString(),
    name,
    email,
    phone,
  }
  try {
    const contacts = await fs.readFile(contactsPath)
    const result = JSON.parse(contacts)
    const updatedContacts = [...result, contact]
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts))
    return contact
  } catch (err) {
    console.log(err.message)
  }
}

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body

  const contacts = await fs.readFile(contactsPath)
  const result = JSON.parse(contacts)
  let updatedContact
  result.forEach(contact => {
    if (contact.id === parseInt(contactId)) {
      contact.name = name
      contact.email = email
      contact.phone = phone
      updatedContact = contact

    }
  })
  await fs.writeFile(contactsPath, JSON.stringify(result))
  return updatedContact
}


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
