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