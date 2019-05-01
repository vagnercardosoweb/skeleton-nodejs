module.exports = (request, response, next) => {
  const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  const originalMethod = request.originalMethod || request.method
  let newMethod

  // Verifica se o método está permitido
  if (!allowedMethods.includes(originalMethod)) {
    return next()
  }

  // Recupera o método custom no body
  if (request.body && typeof request.body === 'object') {
    ['_method', '_METHOD'].map(method => {
      if (request.body.hasOwnProperty(method)) {
        newMethod = request.body[method]
        delete request.body[method]
      }
    })
  }

  // Recupera na header caso não tenha encontrado
  if (!newMethod) {
    let header = 'X-HTTP-Method-Override'
    header = request.headers[header.toLowerCase()]

    if (!header) {
      return next()
    }

    // Multiplas headers
    const index = header.indexOf(',')

    newMethod = index !== -1 ? header.substr(0, index).trim() : header.trim()
  }

  // Atribue o novo método
  if (newMethod) {
    request.originalMethod = originalMethod
    request.method = newMethod.toUpperCase()
  }

  next()
}
