import bcrypt from 'bcryptjs';

class Password {
  instance() {
    return bcrypt;
  }

  /**
   * @param {String} password
   * @param {String|Number} salt
   *
   * @returns {Promise<string>}
   */
  hash(password, salt) {
    return bcrypt.hash(password, salt || 12);
  }

  /**
   * @param {String} password
   * @param {String} hash
   *
   * @returns {Promise<boolean>}
   */
  verify(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

export default new Password();
