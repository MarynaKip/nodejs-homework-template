const express = require('express')
const logger = require('morgan')
require("dotenv").config();

const app = express()

const { connectMongo } = require('./src/db/connection')
const { contactsRouter } = require('./src/routes/api/contactsRouter')
const { userRouter } = require('./src/routes/api/userRouter')

const PORT = process.env.PORT || 8080;

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(express.json())

app.use('/api/contacts', contactsRouter)
app.use('/users', userRouter)


app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

const start = async () => {
  try {
    await connectMongo()
    app.listen(PORT, (err) => {
      if (err) {
        console.error("Error at server launch:", err);
      }
      console.log(`Database connection successful at port ${PORT}`);
    });
  } catch (err) {
    console.error(`Failed to launch application with error ${err.message}`)
    process.exit(1)
  }
}

start()

module.exports = app
