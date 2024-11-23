import mongoose from 'mongoose';
import { formatDate } from '@powidl2024/common__powidl2024';
import { app } from './app';

const start = async () => {
  console.log('Starting up ...');
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
    console.log('could not connect to mongodb, so lets exit ...');
    process.exit(1);
  }

  app.listen(3000, () => {
    console.log(`${formatDate(new Date())}: Auth - Listening on port 3000`);
  });
};

start();
