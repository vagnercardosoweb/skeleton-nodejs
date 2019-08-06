import mongoose from 'mongoose';
import { createHashMd5 } from '../helpers';

// Create user schema
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, required: true, default: Date.now() },
    update_at: { type: Date, default: null },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware
// UserSchema.pre('save', function(next) {
//   next();
// });

class UserClass {
  /**
   * Equivalent to virtual values
   *
   * ```js
   * UserSchema.virtual('image').get(function() {
   *   return '...';
   * });
   * ```
   */
  get image() {
    const md5 = createHashMd5(this.email.toLowerCase());

    return `https://www.gravatar.com/avatar/${md5}?s=500`;
  }

  /**
   * Equivalent to methods
   *
   * ```js
   * UserSchema.methods.getFormattedAddress = function() {
   *   return '...';
   * };
   * ```
   */
  getFormattedAddress() {
    return `${this.name} <${this.email}>`;
  }

  /**
   * Equivalent to methods
   *
   * ```js
   * UserSchema.static('findByEmail', function(){
   *   return '...';
   * })
   * ```
   *
   * @param {String} email
   */
  static findByEmail(email) {
    return this.findOne({ email });
  }
}

// Loads an ES6 class into a schema. Maps setters + getters,
// static methods, and instance methods to schema virtuals,
// statics, and methods.
UserSchema.loadClass(UserClass);

export default mongoose.model('User', UserSchema);
