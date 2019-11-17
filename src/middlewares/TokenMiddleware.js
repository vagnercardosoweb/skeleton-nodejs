import Jwt from '../services/Jwt';

export default async (req, res, next) => {
  let decoded = {};
  let status = 403;

  const allowed = [];
  const method = req.method.toLowerCase();

  if (['options'].includes(method)) {
    return next();
  }

  if (allowed.includes(req.path)) {
    req.allowedRoute = true;
    return next();
  }

  try {
    let token;
    const { authorization } = req.headers;

    if (!authorization) {
      token = req.query.token;

      if (!token) {
        throw new Error('Acesso negado.');
      }
    }

    if (!token) {
      [, token] = authorization.split(' ');
    }

    try {
      decoded = await Jwt.decode(token.trim());
    } catch (err) {
      if (process.env.API_KEY !== token) {
        throw err;
      }
    }

    // Verifica id no token
    if (!decoded.id) {
      status = 401;
    }

    req.user = { ...decoded };

    return next();
  } catch (err) {
    return res.error(err, status);
  }
};
