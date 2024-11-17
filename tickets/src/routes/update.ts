import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  currentUser,
} from '@powidl2024/common__powidl2024';
import { Ticket } from '../models/ticket';
import {
  TicketUpdatedPublisher,
  TicketUpdatedPublisherIndependentVersioning,
} from '../events/publishers';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    const prevVersion = ticket.version;
    ticket.set({
      title: req.body.title,
      price: req.body.price,
      version: ticket.version + 1,
    });
    await ticket.save();
    console.log('updated ticket version', prevVersion, 'to', ticket.version);
    new TicketUpdatedPublisherIndependentVersioning(natsWrapper.client).publish(
      {
        id: ticket.id,
        version: ticket.version,
        prevVersion,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      }
    );
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
