import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { formatDate } from '@powidl2024/common__powidl2024';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  try {
    await natsWrapper.connect('ticketing', 'jfsdlf', 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    console.log('Connected to NATS');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log(`${formatDate(new Date())}: Tickets - Listening on port 3000`);
  });
};

start();
