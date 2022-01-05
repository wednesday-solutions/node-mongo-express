import mongoose from 'mongoose';

let userSchema = new mongoose.Schema({
  name: { type: String },
  password: { type: String },
  email: { type: String, unique: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
