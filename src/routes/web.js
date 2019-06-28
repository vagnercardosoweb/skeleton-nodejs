import { Router } from 'express';

import IndexController from '../controllers/IndexController';

const router = new Router();

router.get('/', IndexController.index);

export default router;
