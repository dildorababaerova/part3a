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

`
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
`

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


const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})
`
- The event handler function can access the data from the `body` property of the `request` object.

`
const express = require('express');
const app = express();

Morgan works as middleware in your Express app, so it intercepts each request coming to your server, processes some logging information, and then passes control to the next middleware (or to your route handler).
const morgan = require('morgan');

* `npm install morgan`

// Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a custom token to log the request body
morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

// Use morgan to log requests, including the custom 'body' token
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms - Body: :body')
);

app.post('/submit', (req, res) => {
  res.send('Data received');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
`
* Predefined Formats in Morgan
1. combined:

:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"

2. common:
:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]

3. dev:
:method :url :status :response-time ms - :res[content-length]

4. short:
:remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms

5. tiny:
:method :url :status :res[content-length] - :response-time ms


* Morgan allows you to define your own tokens to log additional information. For instance, you might want to log something like the request body or a specific header.

-custom format:
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - Body: :body'));

In instance:

app.use(morgan(''tiny))



* Writing Logs to a File: You can log to a file instead of the console by creating a write stream:

const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Log requests to access.log file
app.use(morgan('combined', { stream: accessLogStream }));

app.get('/', (req, res) => {
  res.send('Hello, file logging!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
* Available Tokens
Here is a list of some commonly used tokens that you can use in your custom formats:

:method – HTTP method (e.g., GET, POST)
:url – URL requested
:status – HTTP status code of the response
:response-time – Time taken to serve the request, in milliseconds
:remote-addr – IP address of the client
:date[clf] – Date of the request in the Common Log Format (CLF)
:referrer – Referrer header (i.e., the page that referred the request)
:user-agent – User-agent string of the client (browser or other client details)
:res[content-length] – Size of the response, in bytes
:http-version – HTTP version used (e.g., HTTP/1.1)
:req[header] – Custom request headers (e.g., :req[User-Agent])
:res[header] – Custom response headers

* Custom Date Formatting

app.use(morgan(':method :url :status - :date[iso]'));

# Deploying app to internet part 3b

The same-origin policy is a security mechanism implemented by browsers in order to prevent session hijacking among other security vulnerabilities.

In order to enable legitimate cross-origin requests (requests to URLs that don't share the same origin) W3C came up with a mechanism called CORS(Cross-Origin Resource Sharing). According to Wikipedia:

Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos. Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.

We can allow requests from other origins by using Node's cors middleware.
- `npm install cors`

`const cors = require('cors')`

`app.use(cors())`

* const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

When the application is deployed, we must create a production build or a version of the application that is optimized for production.

A production build for applications created with Vite can be created with the command `npm run build`.
This creates a directory called dist which contains the only HTML file of our application (index.html) and the directory assets. 


One option for deploying the frontend is to copy the production build (the dist directory) to the root of the backend repository and configure the backend to show the frontend's main page (the file dist/index.html) as its main page.
`cp -r dist ../backend` // Mac or Linux 
If you are using a Windows computer, you may use either `copy` or `xcopy` command instead. Otherwise, simply copy and paste.
In backend add:
`app.use(express.static('dist'))`
Because of our situation, both the frontend and the backend are at the same address, we can declare baseUrl as a relative URL. This means we can leave out the part declaring the server. `const baseUrl = '/api/notes'`

import axios from 'axios'

const baseUrl = '/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...


If the project was created with Vite, this problem is easy to solve. It is enough to add the following declaration to the vite.config.js file of the frontend repository.


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
})

Render(webserver)

In case of Render, the scripts look like the following:

{
  "scripts": {
    //...
    "build:ui": "rm -rf dist && cd ../frontend && npm run build && cp -r dist ../backend",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push"
  }
}

You can use shx:
`npm install shx --save-dev`

{
  "scripts": {
    "clean": "shx rm -rf build dist && shx echo Done"
  }
}


https://part3a.onrender.com


Chrome dev tools

Debugging is also possible with the Chrome developer console by starting your application with the command:

`node --inspect index.js`

You can also pass the --inspect flag to nodemon:

`npx nodemon --inspect index.js`



### MongoDB Atlas

`npm install mongoose`

- Let's make a practice application by creating a new file, mongo.js in the root of the notes backend application:

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// `.../<b>phoneApp</b>?...` can  to rename app
const url = `mongodb+srv://48212:${password}@cluster0.7kuuk.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`


mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'HTML is easy',
  important: true,
})

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})

When the code is run with the command `node mongo.js yourPassword`, Mongo will add a new document to the database.


NB: do not close the connection in the wrong place. E.g. the following code `will not work`:

Person
  .find({})
  .then(persons=> {
    // ...
  })

mongoose.connection.close()

Instead:

Person
  .find({})
  .then(persons=> {
    // ...
    mongoose.connection.close()
  })

To avoid authentication issues with the password variable in index.js, we need to create `a .env` file by running `npm install dotenv` in the command line.

Once the .env file is ready, remember to add it to your `.gitignore` file to prevent pushing the password to Git:

/node_modules
.env

The frontend assumes that every object has a unique id in the id field. We also don't want to return the mongo versioning field __v to the frontend.

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Even though the _id property of Mongoose objects looks like a string, it is in fact an object. The toJSON method we 
    //defined transforms it into a string just to be safe. 
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

NB: chatGPT version:

doc.save()
  .then((savedDoc) => {
    // Convert the document to a plain JavaScript object without the `__v` field
    const plainObj = savedDoc.toObject({ versionKey: false });
    console.log(plainObj); // { name: 'Alice', age: 30 }
  })
  .catch((error) => {
    console.error('Error saving document:', error);
  });

- The environment variables defined in the `.env` file can be taken into use with the expression `require('dotenv').config()` and and you can reference them in your code just like you would reference normal environment variables, with the` process.env.MONGODB_URI` syntax.


### Validation

* Our application shouldn't accept notes that have a missing or empty content property. 

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  // ...
})


* One smarter way of validating the format of the data before it is stored in the database is to use the validation functionality available in Mongoose. models => persons.js

const noteSchema = new mongoose.Schema({

  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean
})

-  Let's change our `handler for creating a new person` so that it passes any potential exceptions to the `error handler middleware:`

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    content: body.content,
    important: body.important || false,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })

    .catch(error => next(error))
})

- Let's expand the `error handler` to deal with these `validation errors`:

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

* Validations are not done when editing a note.
The documentation addresses the issue by explaining that validations are `not run by default` when findOneAndUpdate and related methods are executed.

The fix easy:

app.put('/api/persons/:id', (request, response, next) => {

  const { content, important } = request.body

  Person.findByIdAndUpdate(
    request.params.id, 

    { content, important },
    { new: true, runValidators: true, context: 'query' }
  ) 
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

When using Render, the `database url` is given by defining the proper env in the dashboard:


### Lint

* Let's `install ESlint` as a development dependency to the notes backend project with the command:

`npm install eslint @eslint/js --save-dev`

After this we can `initialize a default ESlint` configuration with the command:
`npx eslint --init`

We will answer all of the questions. (You should to answer questions:
How would you like to use ESLint? syntax
What type of modules does your project use? commonjs
Wich framework does your project use? none
Does your project use TypeScript? none // that came javascript
Where does your code run? node
Would you like to install them now? Yes
Wich package manager do you want to use? npm
)

`npm install --save-dev @stylistic/eslint-plugin-js`

* Inspecting and validating a file like index.js can be done with the following command:
`npx eslint index.js`

- It is recommended to create a separate npm script for linting in package.json:

{
  // ...
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    // ...

    "lint": "eslint ."
  },
  // ...
}

Now the `npm run lint` command will check every file in the project.

- The configuration will be saved in the generated `eslint.config.mjs` file:


import globals from "globals";
import stylisticJs from '@stylistic/eslint-plugin-js'
import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
    },
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        'unix'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true },
      ],
      'no-console': 'off',
    },
  },
  { 
    ignores: ["dist/**", "build/**"],
  },
]


### Structure of backend application

Let's separate all printing to the console to its own module utils/logger.js:

const info = (...params) => {
  console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}

The logger has two functions, `info` and `error`.

- The handling if environtment variables is extracted into a separate utils/config.js:

require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}

The other parts of the application can access the environment variables by importing the configuration module:


const config = require('./utils/config')

logger.info(`Server running on port ${config.PORT}`)









