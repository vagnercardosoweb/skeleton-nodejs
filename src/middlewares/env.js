import { resolve } from 'path';
import { access, readFile, writeFile } from 'fs';

export default async (req, res, next) => {
  const envPath = resolve(__dirname, '..', '..', '.env');
  const envExamplePath = resolve(__dirname, '..', '..', '.env-example');

  await access(envPath, 'utf8', async accessError => {
    if (accessError) {
      await readFile(envExamplePath, async (readError, content) => {
        if (!readError) {
          await writeFile(envPath, content, () => {});
        } else {
          console.error(readError);
        }
      });
    }
  });

  next();
};
