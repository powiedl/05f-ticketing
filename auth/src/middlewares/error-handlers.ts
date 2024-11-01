import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-errors';
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Error handler ...');
  if (err instanceof CustomError) {
    console.log('ERROR CustomError kicked in ...');
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }
  res.status(400).send({ errors: [{ message: 'Something went wrong' }] });
  return;
};
