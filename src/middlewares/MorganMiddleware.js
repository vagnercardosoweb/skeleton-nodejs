import morgan from 'morgan';

const format = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';
const skip = (_, res) => format === 'combined' && res.statusCode < 400;

export default morgan(format, { skip });
