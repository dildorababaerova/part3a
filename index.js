const express = require('express');
const app = express();

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

app.use(express.json())

app.get('/api/persons', (req, res) => {
    res.json(persons);
    });

const date = Date.now();
let text = new Date(date).toString();
console.log(text);

app.get('/api/info', (req, res) => {
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



const PORT = 3001;
app.listen (PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

