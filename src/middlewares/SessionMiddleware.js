import redis from 'redis';
import connectRedis from 'connect-redis';
import expressSession from 'express-session';

import configRedis from '../config/redis';
import configSession from '../config/session';

const client = redis.createClient(configRedis);
const store = new (connectRedis(expressSession))({ client });

export default expressSession({
  store,
  ...configSession,
});
