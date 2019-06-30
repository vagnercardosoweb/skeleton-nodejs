import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default multer({
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, callback) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) return callback(err);

        file.newName = hash.toString('hex') + extname(file.originalname);

        return callback(null, file.newName);
      });
    },
  }),
});
