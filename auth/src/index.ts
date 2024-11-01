import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';

// import { currentUserRouter } from './routes/current-user';
// import { signinRouter } from './routes/signin';
// import { signoutRouter } from './routes/signout';
// import { signupRouter } from './routes/signup';
import {
  currentUserRouter,
  signinRouter,
  signoutRouter,
  signupRouter,
} from './routes';
import { errorHandler } from './middlewares';
import { NotFoundError } from './errors';

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('/*', async () => {
  // nach allen bekannten Routen, aber vor dem Errorhandler fügt man diese "catch all" Route hinzu
  throw new NotFoundError();
});

app.use(errorHandler); // der Errorhandler muss möglichst nahe am app.listen sein, damit er alle Fehler, die "unterwegs" aufgetreten sind, sieht
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   errorHandler(err, req, res, next);
// });

const start = async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('connected to mongodb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Auth - Listening on port 3000');
  });
};

start();
