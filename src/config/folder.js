const path = require('path')

const ROOT = path.dirname(path.dirname(__dirname))
const PUBLIC = path.join(ROOT, '/public')
const SRC = path.join(ROOT, '/src')
const CONTROLLERS = path.join(SRC, '/controllers')
const MIDDLEWARES = path.join(SRC, '/middlewares')
const MODELS = path.join(SRC, '/models')
const ROUTES = path.join(SRC, '/routes')
const VIEWS = path.join(SRC, '/views')

module.exports = {
  ROOT,
  PUBLIC,
  SRC,
  CONTROLLERS,
  MIDDLEWARES,
  MODELS,
  ROUTES,
  VIEWS
}
