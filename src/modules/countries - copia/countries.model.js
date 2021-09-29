import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
   name: { type: String, required: true },
   code: { type: String, required: true },
   status: { type: String, default: '1' }
});

export default mongoose.model('Countries', modelSchema);