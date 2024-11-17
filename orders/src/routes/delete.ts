import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@powidl2024/common__powidl2024';
import {
  OrderCancelledPublisher,
  OrderCancelledPublisherIndependentVersioning,
} from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    const prevVersion = order.version;
    order.status = OrderStatus.Cancelled;
    await order.save();

    // publish an event to say this was cancelled
    new OrderCancelledPublisherIndependentVersioning(
      natsWrapper.client
    ).publish({
      id: order.id,
      version: order.version,
      prevVersion,
      ticket: {
        id: order.ticket.id,
      },
    });
    console.log('order cancelled:', order);

    res.status(200).send(order); //204 means no content, so you can't send a body with it ...
  }
);

export { router as deleteOrderRouter };
