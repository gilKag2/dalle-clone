import mongoose from 'mongoose';


const connectDB = async (url) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(url).then(() => console.log('connected'));
};

export default connectDB;
