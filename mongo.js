if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', addressSchema)

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.ypshc.mongodb.net/puhelinluettelo-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

if (process.argv.length === 3) {

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })

}

if (process.argv.length === 5) {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(response => {
    console.log('person saved!')
    mongoose.connection.close()
  })

}


