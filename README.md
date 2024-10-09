# part3a

* Create a new template for our application with the npm init command.
-`npm  init`

in package.json => "start": "node index.js",

`
{
  // ...
  "scripts": {

    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}

`
we can run it as an npm script: `npm start`

* `npm install express`

- The dependency is also added to our package.json file:

`
{
  // ...
  "dependencies": {
    "express": "^4.18.2"
  }
}
`
* We can update the dependencies of the project with the command:
- `npm update`
- `npm install`
The first request parameter contains all of the information of the HTTP request, and the second response parameter is used to define how the request is responded to.

* You can start the interactive node-repl by typing in `node` in the command line.

* nodemon will watch the files in the directory in which nodemon was started, and if any files change,  nodemon will automatically restart your node application.
- `npm install --save-dev nodemon`
`
{
  //...
  "dependencies": {
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.3"
  }
}
`
`
{
  // ..
  "scripts": {
    "start": "node index.js",

    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
`
* We can now start the server in development mode with the command:
- `npm run dev`

* The id parameter in the route of a request can be accessed through the request object:

-`const id = request.params.id`

`app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})`

* Deletion happens by making an HTTP DELETE request to the URL of the resource:

`
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})
`
* Adding a note happens by making an HTTP POST request to the address http://localhost:3001/api/notes, and by sending all the information for the new note in the request body in JSON format.
- We need the help of the Express json-parser that we can use with the command `app.use(express.json())`.

`
const express = require('express')
const app = express()


app.use(express.json())

//...


app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)
  response.json(note)
})
`
- The event handler function can access the data from the `body` property of the `request` object.
* `npm install morgan`
