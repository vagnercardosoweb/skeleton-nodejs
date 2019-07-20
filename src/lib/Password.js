import bcrypt from 'bcryptjs';

class Password {
  instance() {
    return bcrypt;
  }

  hash(password, salt) {
    return bcrypt.hash(password, salt || 12);
  }

  verify(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

export default new Password();
