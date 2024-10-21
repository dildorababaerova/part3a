const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage: node script.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]


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
  name: 'Arto Hellas',
  number: '044-12-349',
})

// Save the person to the database
person.save().then(result => {
  console.log(`added ${name} (${number}) to phonebook`)
  mongoose.connection.close()
}).catch(err => {
  console.error('Error saving person:', err)
  mongoose.connection.close()
})
