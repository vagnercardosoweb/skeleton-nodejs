import bcrypt from 'bcryptjs';

class Password {
  constructor() {
    this.bcrypt = bcrypt;
    this.defaultSalt = 10;
  }

  instance() {
    return this.bcrypt;
  }

  hash(password, salt) {
    return this.bcrypt.hash(password, salt || this.defaultSalt);
  }

  verify(password, hash) {
    return this.bcrypt.compare(password, hash);
  }
}

export default new Password();
