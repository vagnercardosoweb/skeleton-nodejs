// import { resolve } from 'path';
// import { access, readFile, writeFile } from 'fs';
// import crypto from 'crypto';
import config from '../config';

// async function createEnvFile() {
//   const envPath = resolve(__dirname, '..', '..', '.env');
//   const envExamplePath = resolve(__dirname, '..', '..', '.env-example');

//   await access(envPath, 'utf8', async accessError => {
//     if (accessError) {
//       await readFile(envExamplePath, async (readError, content) => {
//         if (!readError) {
//           await writeFile(envPath, content, () => {});
//         } else {
//           throw readError;
//         }
//       });
//     }
//   });
// }

// async function createAppKey() {
//   const envPath = resolve(__dirname, '..', '..', '.env');
//   const appKey = config.app.key;

//   if (!appKey && appKey === '') {
//     await readFile(envPath, async (readError, content) => {
//       if (!readError && !config.app.key) {
//         crypto.randomBytes(32, async (err, buf) => {
//           const randomBytes = buf.toString('base64');

//           let newContent = content.toString();
//           newContent = newContent.replace(
//             /^APP_KEY=/gim,
//             `APP_KEY=vcw_${randomBytes}`
//           );

//           await writeFile(envPath, Buffer.from(newContent), () => {});
//         });
//       }
//     });
//   }
// }

export default (req, res, next) => {
  // createEnvFile();
  // createAppKey();

  req.app.set('trust proxy', true);
  res.locals.config = config;

  res.error = (err, status) => {
    const message = err.message || err;
    status = status || 400;

    res.status(status).json({ error: true, status, message });
  };

  res.success = (data, status) => {
    status = status || 200;
    res.status(status).json({ error: false, status, ...data });
  };

  next();
};
