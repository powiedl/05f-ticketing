import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

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
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test', // secure: true - in "non test" environments, otherwise: false (if it is true, the request must be made to https)
  })
);
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

export { app };
