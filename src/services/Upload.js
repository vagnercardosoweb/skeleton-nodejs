// eslint-disable-next-line no-unused-vars
import { Express } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import { promisify } from 'util';
import { basename, dirname, extname } from 'path';

import { uuid } from '../helpers';

class Upload {
  constructor() {
    this.allowedMimeTypes = [];
  }

  /**
   * @param {Express.Multer.File} file
   * @param {String} path
   * @param {String} name
   *
   * @returns {Promise<Express.Multer.File>}
   */
  async file(file, path, name = null) {
    if (!file.buffer) {
      throw new Error('File passed not valid format multer.');
    }

    this._validateMimeTypes(file.mimetype);
    await this._validateFile(file, path, name);

    await promisify(fs.writeFile)(`${file.path}/${file.name}`, file.buffer);

    return file;
  }

  /**
   * @param {Express.Multer.File} file
   * @param {String} path
   * @param {String|null} name
   * @param {Number|null} width
   * @param {Number|null} height
   * @param {String|null} format
   * @returns {Promise<Express.Multer.File>}
   */
  async image(
    file,
    path,
    name = null,
    width = 500,
    height = 500,
    format = null
  ) {
    if (!file.buffer) {
      throw new Error('File passed not valid format multer.');
    }

    if (!file.mimetype.match(/image\//gi)) {
      throw new Error(
        `MimeType '${file.mimetype}' not allowed for image upload.`
      );
    }

    this._validateMimeTypes(file.mimetype);
    await this._validateFile(file, path, name);

    const image = sharp(file.buffer);
    const metadata = await image.metadata();

    // width = width || metadata.width;
    // height = height || metadata.height;
    width = width > metadata.width ? metadata.width : width;
    height = height > metadata.height ? metadata.height : height;
    format = format || metadata.format;
    format = format === 'jpeg' ? 'jpg' : format;

    await image
      .resize(width, height, {
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
  }

  /**
   * @param {String|Array<string>} types
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
   * @param {Express.Multer.File} file
   * @param {String} path
   * @param {String} name
   * @returns {Promise<Express.Multer.File>}
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
      await promisify(fs.access)(folder);
    } catch (e) {
      await promisify(fs.mkdir)(folder, { recursive: true, mode: 0o755 });
    }

    return true;
  }
}

export default new Upload();
