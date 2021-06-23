const express = require('express')
const logger = require('morgan')
require("dotenv").config();

const app = express()

const { connectMongo } = require('./src/model/connection')
const { contactsRouter } = require('./src/routes/api/contacts')

const PORT = process.env.PORT || 8080;

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(express.json())

app.use('/api/contacts', contactsRouter)

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

// app.listen(8080, (err) => {
//   if (err) {
//     console.error("Error at server launch:", err);
//   }
//   console.log(`Server works at port 8080`);
// });

module.exports = app
