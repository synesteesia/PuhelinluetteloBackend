const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { response } = require('express')


const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

mongoose.set('useCreateIndex', true)

const addressSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  number: { type: String, required: true, minlength: 8 }
})

//addressSchema.plugin(uniqueValidator, response.status(400).send({ message: 'Error, expected name to be unique.' }))

addressSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('person', addressSchema)