import mongoose from 'mongoose';

const schema = new mongoose.Schema({
   name: { type: String, required: true },
   last_name: { type: String, required: true },
   email: { type: String, required: true },
   password: { type: String, required: true },
   device_token: String,
   status: { type: String, default: '1' }
});

export default mongoose.model('User', schema);