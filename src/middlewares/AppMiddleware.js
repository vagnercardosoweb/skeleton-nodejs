import { resolve } from 'path';
import { access, readFile, writeFile } from 'fs';
import * as config from '../config';

/**
 * Set global configs
 *
 * @param { Object } req
 *
 * @returns void
 */
function setResponseLocals(res) {
  res.locals.config = config;
}

/**
 * Create env file
 *
 * @returns void
 */
async function createEnvFile() {
  const envPath = resolve(__dirname, '..', '..', '.env');
  const envExamplePath = resolve(__dirname, '..', '..', '.env-example');

  await access(envPath, 'utf8', async accessError => {
    if (accessError) {
      await readFile(envExamplePath, async (readError, content) => {
        if (!readError) {
          await writeFile(envPath, content, () => {});
        } else {
          throw readError;
        }
      });
    }
  });
}

export default (req, res, next) => {
  setResponseLocals(res);
  createEnvFile();

  next();
};
