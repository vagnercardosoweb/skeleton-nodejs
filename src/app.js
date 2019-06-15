// Dotenv
require('dotenv').config()

// Global
const express = require('express')
const http = require('http')
const io = require('socket.io')
const twig = require('twig')

// Configs
const configView = require('./config/view')
const configFolder = require('./config/folder')

// Middleware
const corsMiddleware = require('./middlewares/cors')
const methodOverrideMiddleware = require('./middlewares/methodOverride')
const envMiddleware = require('./middlewares/env')

// Routes
const webRoutes = require('./routes/web')
const apiRoutes = require('./routes/api')

class App {
  constructor () {
    this.app = express()
    this.server = http.createServer(this.app)
    this.io = io(this.server)
  }

  init () {
    this.initMiddleware()
    this.initTwig()
    this.initRoutes()
    this.listen()
  }

  initMiddleware () {
    this.app.use(envMiddleware)
    this.app.use(corsMiddleware)
    this.app.use(methodOverrideMiddleware)
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use((req, res, next) => {
      req.io = this.io
      next()
    })
  }

  initRoutes () {
    // Routes
    this.app.use(webRoutes)
    this.app.use('/api', apiRoutes)

    // Http error
    this.app.use((request, response, next) => {
      let error = {
        status: 404,
        message: 'Error 404 (Not Found)',
        method: request.method,
        originalMethod: request.originalMethod || null,
        path: request.path,
        originalUrl: request.originalUrl,
        cookies: request.cookies,
        headers: request.headers,
        body: request.body
      }

      // Method override
      if ((request.originalMethod !== undefined) && request.originalMethod !== request.method) {
        error = {
          ...error,
          status: 405,
          message: 'Error 405 (Method Not Allowed)'
        }
      }

      // New status
      response.status(error.status || 404)

      // Help for regular expression of api error return
      let path = request.path
      if (path[path.length - 1] !== '/') {
        path = `${path}/`
      }

      // Response JSON
      if (request.xhr || path.match(/^\/api\//i)) {
        return response.json({ error: error })
      }

      // Response HTML
      return response.render(`error/${response.statusCode}`, { error: error })
    })
  }

  initTwig () {
    this.app.use(express.static(configFolder.PUBLIC))
    this.app.set('views', configView.path)
    this.app.set('view engine', configView.engine);

    // Custom functions and filters
    [...configView.functions, ...configView.filters].forEach(item => {
      if (typeof item.callback === 'function') {
        if (configView.filters.includes(item)) {
          twig.extendFilter(item.name, item.callback)
        } else {
          twig.extendFunction(item.name, item.callback)
        }
      }
    })
  }

  listen () {
    this.server.listen(process.env.PORT || 3333)
  }
}

module.exports = new App()
