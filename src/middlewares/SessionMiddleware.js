import session from 'express-session';
import redis from 'connect-redis';

import config from '../config';

const store = new (redis(session))(config.redis);

export default session({
  store,
  ...config.session,
});
