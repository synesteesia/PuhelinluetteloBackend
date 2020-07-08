const express = require('express')
const app = express()
const morgan = require('morgan')

  let persons = [
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 1
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 2
    },
    {
      "name": "Mikko",
      "number": "12-43-3455",
      "id": 3
    }

  ]

  morgan.token('body-content', function (req) { return JSON.stringify(req.body) })

  const cors = require('cors')

  app.use(cors())  
  app.use(express.json())

  app.use(morgan('tiny', {
      skip: function (req) { return req['method'] === 'POST' }
  }))
  app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :body-content`, {
      skip: function (req) { return req['method'] !== 'POST' }
  }))

  app.get('/', (req, res) => {
    res.send('<h1>This is a phonebook</h1>')
    
  })  

  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/info', (req, res) => {
    const numberOfPeople = persons.length
    var time = new Date()
    res.send(`<h3>Phonebook has info for ${numberOfPeople} people</h3> <p>${time}</p>`)
    
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
    
  })

  app.post('/api/persons', (request, response) => {
    const person = request.body

    if (person.number === null || person.number === undefined) {
        response.status(500).json({ error: 'number is missing' })
    } else if (person.name === null || person.name === undefined) {
        response.status(500).json({ error: 'name is missing' })
    } else if (persons.find(p => p.name === person.name)) {
        response.status(500).json({error: 'person name must be unique'})
    }

    person.id = Math.random(9000000)
    persons = persons.concat(person)
  
    response.json(person)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })