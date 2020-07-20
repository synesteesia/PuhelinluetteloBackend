require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/address')


morgan.token('body-content', function (req) { return JSON.stringify(req.body) })

const cors = require('cors')
//const { default: persons } = require('../fullStack2020/osa3/puhelinluetteloFront/src/services/persons')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


app.use(morgan('tiny', {
  skip: function (req) { return req['method'] === 'POST' }
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body-content', {
  skip: function (req) { return req['method'] !== 'POST' }
}))



app.get('/', (req, res) => {
  res.send('<h1>This is a phonebook</h1>')

})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const numberOfPeople = persons.length
    const time = new Date()

    res.send(`<h3>Phonebook has info for ${numberOfPeople} people</h3> <p>${time}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {

    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.number === null || body.number === undefined) {
    response.status(500).json({ error: 'number is missing' })
  } else if (body.name === null || body.name === undefined) {
    response.status(500).json({ error: 'name is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    }).catch(error => {
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  if (body.number === null || body.number === undefined) {
    response.status(500).json({ error: 'number is missing' })
  }

  const person = {
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(newPerson => {
      response.json(newPerson)
    }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})