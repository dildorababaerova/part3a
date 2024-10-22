const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]     // Name from command-line arguments
const number = process.argv[4]


const url = `mongodb+srv://48212:${password}@cluster0.7kuuk.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Define the correct schema for a person
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Create a new person instance
const person = new Person({
  name: name,
  number:number,
})

// Save the person to the database
person.save()
.then(() => {
  console.log(`added ${person.name} ${person.number} to phonebook`)

  return Person.find({})
})
.then(result => {
  result.forEach(person => {
    console.log(`${person.name} ${person.number} `)
  })
  mongoose.connection.close()
}).catch(err => {
  console.error('Error saving person:', err)
  mongoose.connection.close()
})