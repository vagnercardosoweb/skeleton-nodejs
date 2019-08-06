import { Router } from 'express';

import web from './web';
import api from './api';

const router = new Router();

router.options((req, res) => {
  return res.status(200);
});

router.use(web);
router.use(api);

export default router;
