require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors')
const Person = require('./models/persons')

// const corsOptions = {
//     origin: 'http://localhost:5173',
//     }

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}


const errorHandler=(error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name ==='ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)
}

app.use(cors())  
app.use(express.static('dist'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]



// Токен для логирования тела запроса
morgan.token('req-body', (request) =>JSON.stringify(request.body));
    


// Настройка Morgan для логирования только метода, URL и тела запроса
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms { :req-body }'));

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms - :date[iso] - :req-body')
  );

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
});

const  errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status().send({ error: 'malformatted id' });
    }
    next(error);
}



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
  };



app.get('/info', (request, response) => {
    Person.countDocuments({}).then((count) => {
        const date = new Date(Date.now()).toString();
    response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
        `);
    });
});

// const generateId = () => {
//     const maxId = persons.length > 0
//     ? Math.max(...persons.map(n => n.id))
//     : 0
//     return (maxId + 1).toString()
// }

app.post('/api/persons', (request, response, next)=>{
    const body= request.body
    console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    
    Person.findOne({name: body.name}).then(existingPerson=>{
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

app.get('/api/persons/:id', (request, response, next) =>{
    Person.findById(request.params.id).then((person) => {
    if (person) {
        response.json(person);
    } else {
        res.status(404).end();
    }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
      .then((result) => {
          response.status(204).end()
        } else {
          response.status(404).json({ error: 'Person not found' })
        }
      })
      .catch((error) => {
        console.error('Error deleting person:', error.message)
        response.status(500).json({ error: 'Server error' })
      })
  })



const PORT = process.env.PORT || 3001;
app.listen (PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

