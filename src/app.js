// Dotenv
require('dotenv').config()

// Global
const express = require('express')
const twig = require('twig')

// Configs
const configView = require('./config/view')
const configFolder = require('./config/folder')

// Middlewares
const headers = require('./middlewares/headers')
const methodOverride = require('./middlewares/methodOverride')

// Routes
const webRoutes = require('./routes/web')
const apiRoutes = require('./routes/api')

class App {
  constructor () {
    this._app = express()
  }

  init () {
    this._initMiddleware()
    this._initView()
    this._initRoutes()
    this._init()
  }

  _initMiddleware () {
    this._app.use(express.json())
    this._app.use(express.urlencoded({ extended: false }))
    this._app.use(headers)
    this._app.use(methodOverride)
  }

  _initRoutes () {
    // Routes
    this._app.use(webRoutes)
    this._app.use('/api', apiRoutes)

    // Http error
    this._app.use((request, response, next) => {
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

  _initView () {
    this._app.use(express.static(configFolder.PUBLIC))
    this._app.set('view engine', configView.engine)
    this._app.set('views', configView.path);

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

  _init () {
    this._app.listen(process.env.PORT || 3000)
  }
}

module.exports = new App()
