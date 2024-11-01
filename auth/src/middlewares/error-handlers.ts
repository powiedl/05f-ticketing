import { Request, Response, NextFunction } from 'express';
import { RequestValidationError, DatabaseConnectionError } from '../errors';
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    console.log('handling this error as a request validation error');
    const formattedErrors = err.errors.map((err) => {
      return { message: err.msg, field: err.type === 'field' ? err.path : '' };
    });
    return res.status(400).send({ errors: formattedErrors });
  }
  if (err instanceof DatabaseConnectionError) {
    console.log('handling this error as a database connection error');
  }

  res.status(400).send({ message: err.message });
};
