export default (req, res, next) => {
  const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const originalMethod = req.originalMethod || req.method;
  let newMethod;

  // Verifica se o método está permitido
  if (!allowedMethods.includes(originalMethod)) {
    return next();
  }

  // Recupera o método custom no body
  if (req.body && typeof req.body === 'object') {
    ['_method', '_METHOD'].map(method => {
      if (Object(req.body).hasOwnProperty(method)) {
        newMethod = req.body[method];
        delete req.body[method];
      }
    });
  }

  // Recupera na header caso não tenha encontrado
  if (!newMethod) {
    let header = 'X-HTTP-Method-Override';
    header = req.headers[header.toLowerCase()];

    if (!header) {
      return next();
    }

    // Multiplas headers
    const index = header.indexOf(',');

    newMethod = index !== -1 ? header.substr(0, index).trim() : header.trim();
  }

  // Atribue o novo método
  if (newMethod) {
    req.originalMethod = originalMethod;
    req.method = newMethod.toUpperCase();
  }

  next();
};
