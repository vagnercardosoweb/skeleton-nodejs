module.exports = function (request, response, next) {
  const methods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE']

  const headers = [
    'Accept',
    'Origin',
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Http-Method-Override'
  ]

  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Methods', methods.join(','))
  response.header('Access-Control-Allow-Headers', headers.join(','))

  next()
}
