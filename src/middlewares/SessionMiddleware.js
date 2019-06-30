import expressSession from 'express-session';
import connectRedis from 'connect-redis';

import { session, redis } from '../config';

const store = new (connectRedis(expressSession))(redis);

export default expressSession({
  store,
  ...session,
});
