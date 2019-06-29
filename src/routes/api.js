import { Router } from 'express';

import ApiController from '../controllers/ApiController';

const router = new Router();

router.get('/*', ApiController.index);

export default router;
