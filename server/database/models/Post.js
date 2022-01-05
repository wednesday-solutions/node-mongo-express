import mongoose from 'mongoose';

let postSchema = new mongoose.Schema({
  userId: [{ ref: 'User', type: 'ObjectId' }],
  content: String,
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;
