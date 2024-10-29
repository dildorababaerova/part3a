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
app.use(express.requestLogger);


const unknownpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}



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

app.get('/api/persons/:id', (request, response) =>{
    Person.findById(request.params.id).then((person) => {
    if (person) {
        response.json(person);
    } else {
        res.status(404).end();
    }
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then((result) => {
        if (result) {
          response.status(204).end()
        } else {
          response.status(404).json({ error: 'Person not found' })
        }
      })
      .catch(error => next(error))
  })


app.put('/api/persons/:id', (request, response, next) => {
    const { name, number} = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        {name, number},
        {new:true, runValidators:true, context: 'query'}
    )
    .then(updatedPerson =>{
        response.json(updatedPerson)
    })
    .catch(error=> next(error))
})




app.use(unknownpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen (PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

