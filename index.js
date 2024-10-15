const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
  }));
  


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Токен для логирования тела запроса
morgan.token('req-body', (req) => {
    return JSON.stringify(req.body);
});

// Настройка Morgan для логирования только метода, URL и тела запроса
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms { :req-body }'));

app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms - :date[iso] - :req-body')
  );

app.get('/api/persons', (req, res) => {
    res.json(persons);
    });

const date = Date.now();
let text = new Date(date).toString();
console.log(text);

app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${text}</p>
        `);
    });

const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
    return (maxId + 1).toString()
}

app.post('/api/persons', (req, res)=>{
    const body= req.body
    console.log(body)

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    const existName = persons.find(person => person.name === body.name)
    if (existName) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)

})

app.get('/api/persons/:id', (req, res) =>{
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    console.log(person)
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})



const PORT = process.env.PORT || 3001;
app.listen (PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

