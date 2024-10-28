require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors')
const Person = require('./models/persons')

// const corsOptions = {
//     origin: 'http://localhost:5173',
//     }
app.use(cors())  
app.use(express.static('dist'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};

app.use(requestLogger);





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

app.post('/api/persons', (request, response)=>{
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
            })
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

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then((result) => {
          response.status(204).end()
      })
      .catch(error => next(error))  
  })

  app.put('/api/persons', (request, response, next) => {
    const body = request.body;
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true}) 
    .then(updatedPerson =>{
        response.ijon(updatedPerson)
    })
    .catch(error => next(error))
})

  app.use(unknownEndpoint);
  app.use(errorHandler);




const PORT = process.env.PORT || 3001;
app.listen (PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

