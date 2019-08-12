import multer from 'multer';
import { extname, resolve } from 'path';
import { createRandomBytes } from '../helpers';

export default multer({
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, callback) => {
      const hash = createRandomBytes(16);

      if (hash) {
        return callback(new Error('Error createRandomBytes in multer config.'));
      }

      file.newName = hash.toString('hex') + extname(file.originalname);

      return callback(null, file.newName);
    },
  }),
});
