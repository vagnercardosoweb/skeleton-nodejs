import { promises as fs } from 'fs';
import { basename, dirname, extname } from 'path';

import { uuid } from '../helpers';

class Upload {
  constructor() {
    this.allowedMimeTypes = [];
  }

  /**
   * Upload new file
   *
   * @param {Object} file
   * @param {String} path
   * @param {String} name
   * @returns {Promise<{file}>}
   */
  async file(file, path, name = null) {
    try {
      if (!file.buffer) {
        throw new Error('File passed not valid format multer.');
      }

      this._validateMimeTypes(file.mimetype);
      await this._validateFile(file, path, name);

      await fs.writeFile(`${file.path}/${file.name}`, file.buffer);

      return file;
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {Object} file
   * @param {String} path
   * @param {String|null} name
   * @param {Number|null} width
   * @param {Number|null} height
   * @param {String|null} format
   * @returns {Promise<{file}>|boolean}
   */
  async image(
    file,
    path,
    name = null,
    width = null,
    height = null,
    format = null
  ) {
    try {
      const sharp = require('sharp');

      if (typeof sharp !== 'function') {
        throw new Error(
          "Upload image require 'https://github.com/lovell/sharp', install to continue."
        );
      }

      if (!file.buffer) {
        throw new Error('File passed not valid format multer.');
      }

      if (!file.mimetype.match(/image\//gi)) {
        return false;
      }

      this._validateMimeTypes(file.mimetype);
      await this._validateFile(file, path, name);

      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      width = width || metadata.width;
      height = height || metadata.height;
      format = format || metadata.format;
      format = format === 'jpeg' ? 'jpg' : format;

      await image
        .resize({
          width,
          height,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toFormat(format, {})
        .toFile(
          `${file.path}/${file.name.replace(file.extension, `.${format}`)}`
        );

      return file;
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {String|Array} types
   * @returns {Upload}
   */
  mimeTypes(types = []) {
    if (typeof types === 'string') {
      types = [types];
    } else if (!Array.isArray(types)) {
      throw new Error(
        `${typeof types} format is not valid! I expect the format: string or array.`
      );
    }

    types.map(type => this.allowedMimeTypes.push(type));

    return this;
  }

  /**
   * @param {Object} file
   * @param {String} path
   * @param {String} name
   * @returns {Promise<{file}>}
   * @private
   */
  async _validateFile(file, path, name) {
    file.extension = extname(file.originalname);

    if (path.match(/^(.*)\.[a-zA-Z0-9]{2,13}$/gi)) {
      file.name = basename(path).replace(file.extension, '');
      file.path = dirname(path);
    } else {
      file.path = path;
    }

    await this._mkdir(file.path);

    if (typeof name === 'string' && name.trim()) {
      file.name = name.trim();
    } else if (!name && !file.name) {
      file.name = uuid();
    }

    file.name = `${file.name}${file.extension}`;

    return file;
  }

  /**
   * @param {String} mimeType
   * @returns {boolean}
   * @private
   */
  _validateMimeTypes(mimeType) {
    if (this.allowedMimeTypes.length > 0) {
      if (!this.allowedMimeTypes.includes(mimeType)) {
        throw new Error(`Mime Type ${mimeType} not allowed for upload.`);
      }
    }

    this.allowedMimeTypes = [];

    return true;
  }

  /**
   * @param {String} folder
   * @returns {Promise<boolean>}
   * @private
   */
  async _mkdir(folder) {
    try {
      await fs.access(folder);
    } catch (e) {
      await fs.mkdir(folder, { recursive: true, mode: 0o755 });
    }

    return true;
  }
}

export default new Upload();
