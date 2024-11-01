import { CustomError } from './custom-errors';
export class DatabaseConnectionError extends CustomError {
  reason = 'Error connection to database';
  statusCode = 500;
  constructor() {
    super('Error connection to database');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reason }];
  }
}
