import { Router } from 'express';

import web from './web';
import api from './api';

const router = new Router();

router.options((req, res) => {
  return res.status(200);
});

// TEST UPLOAD
// router.post('/upload', require('multer')().any(), async (req, res) => {
//   req.files.map(async file => {
//     try {
//       if (file.buffer) {
//         const path = resolve(
//           __dirname,
//           '..',
//           '..',
//           'tmp',
//           'uploads',
//           'archives'
//         );

//         const Upload = require('../lib/Upload');
//         await Upload.file(file, path);

//         return res.json({
//           files: req.files,
//         });
//       }
//     } catch (e) {
//       return res.error(e);
//     }
//   });
// });

router.use(web);
router.use(api);

export default router;
