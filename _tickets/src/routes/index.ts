export { default as createTicketRouter } from './new';
export { default as showTicketRouter } from './show';
export { default as updateTicketRouter } from './update';
export { default as indexTicketRouter } from '.';

import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

export default router.get(
  '/api/tickets',
  async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});
    res.send(tickets);
  }
);
