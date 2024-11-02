const personsRouter = require('express').Router()
const Person = require('../models/persons')

personsRouter.get('/', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })
  
  
  personsRouter.get('/info', (request, response) => {
    Person.countDocuments({}).then((count) => {
      const date = new Date(Date.now()).toString()
      response.send(`
          <p>Phonebook has info for ${count} people</p>
          <p>${date}</p>
          `)
    })
  })
  
  personsRouter.post('/', (request, response, next) => {
    const body= request.body
    console.log(body)
  
    if (!body.name || !body.number) {
      return response.status(400).json({
        error: 'name or number missing'
      })
    }
  
  
    Person.findOne({ name: body.name }).then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({
          error: 'name must be unique'
        })
      } else {
        const person = new Person ({
          name: body.name,
          number: body.number
        })
  
        person.save().then(savedPerson => {
          response.json(savedPerson)
        }).catch(error => next(error))
      }
    })
  })
  
  personsRouter.get('/:id', (request, response, next) => {
    Person.findById(request.params.id).then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
      .catch(error => next(error))
  })
  
  personsRouter.delete('/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        if (result) {
          response.status(204).end()
        } else {
          response.status(404).json({ error: 'Person not found' })
        }
      })
      .catch(error => next(error))
  })
  
  personsRouter.put('/:id', (request, response, next) => {
    const { name, number } = request.body
  
    Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
      .then(updatedPerson  => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })
  
  
  
  module.exports = personsRouter