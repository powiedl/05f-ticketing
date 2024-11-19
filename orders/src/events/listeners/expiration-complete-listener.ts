import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from '@powidl2024/common__powidl2024';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName = queueGroupName;
  readonly subject = Subjects.ExpirationComplete;
  async onMessage(data: { orderId: string }, msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      // Order is already complete, so only acknowledge the message
      return msg.ack(); // ack the message
    }

    order.set({ status: OrderStatus.Cancelled }); // man muss das ticket nicht wieder freigeben, weil das isReserved den Cancelled Status berücksichtigt
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
