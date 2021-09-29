import mongoose, { Schema } from 'mongoose';

const schema = new mongoose.Schema({
      users_id: [{
         _id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
         name: { type: String, required: true }
      }],
      messages: [{
         sent_by_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
         content: { type: String, required: true },
         date: { type: Date, default: Date.now }
      }],
      status: { type: String, default: '1' }
   }, { timestamps: true }
);

export default mongoose.model('Chat', schema);