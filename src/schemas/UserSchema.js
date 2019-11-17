/* eslint-disable no-unused-vars */
import { Schema, model } from 'mongoose';
import { getImageGravatar } from '../helpers';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual('image').get(function gravatar() {
  return getImageGravatar(String(this.email).toLowerCase(), { s: 50 });
});

UserSchema.methods.getFormattedAddress = function formattedAddress() {
  return `${this.name} <${this.email}>`;
};

UserSchema.static('findByEmail', function findByEmail(email) {
  return this.findOne({ email });
});

// Middleware
// UserSchema.pre('save', function(next) {
//   next();
// });

export default model('UserSchema', UserSchema);
