import mongoose from 'mongoose';

export default async function dbConnection() {
   try {
      await mongoose.connect(process.env.DB_CONNECTION, {
         useNewUrlParser: true,
         useUnifiedTopology: true
      })
      console.log('>>> MongoDB Connected')
   } catch (error) {
      console.log('>>> Error with MongoDB connection')
      console.log(error)
   }
}