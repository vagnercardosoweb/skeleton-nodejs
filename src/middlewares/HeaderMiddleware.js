export default (req, res, next) => {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];

  const headers = [
    'Accept',
    'Origin',
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-Http-Method-Override',
  ];

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', methods.join(','));
  res.header('Access-Control-Allow-Headers', headers.join(','));

  next();
};
