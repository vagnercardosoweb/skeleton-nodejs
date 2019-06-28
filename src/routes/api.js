import { Router } from 'express';

// import multer from '../config/multer';

import UserController from '../controllers/UserController';

const router = new Router();

router.get('/users', UserController.index);
// router.get('/saveImage', multer.single('file'), UserController.saveImage);

export default router;
