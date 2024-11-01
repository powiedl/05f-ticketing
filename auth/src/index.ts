import express, { Request, Response, NextFunction } from 'express';
import { json } from 'body-parser';

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

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.use(errorHandler); // der Errorhandler muss möglichst nahe am app.listen sein, damit er alle Fehler, die "unterwegs" aufgetreten sind, sieht
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   errorHandler(err, req, res, next);
// });
app.listen(3000, () => {
  console.log('Auth - Listening on port 3000');
});
