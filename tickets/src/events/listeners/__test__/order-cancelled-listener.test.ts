import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Ticket } from '../../../models/ticket';
import {
  OrderCancelledEvent,
  OrderStatus,
} from '@powidl2024/common__powidl2024';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // create and save a ticket
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });
  ticket.set({ orderId }); // beim Anlegen kann man keine OrderId setzen, daher machen wir es danach
  await ticket.save();

  // create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, orderId };
};

it('clears the orderId inside of the ticket', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  expect(natsWrapper.client.publish).toHaveBeenCalled(); // works, because the client is a mock object

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
});

it('acks the message', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  expect(natsWrapper.client.publish).toHaveBeenCalled(); // works, because the client is a mock object

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();

  const ticketUpdatedJSON = (natsWrapper.client.publish as jest.Mock).mock
    .calls[0][1]; // mit as jest.Mock sagt man TS, dass es sich hierbei um einen Mock der eigentlichen Funktion handelt
  // - damit kann es sein Type Checking wieder machen (und man braucht das @ts-ignore in der Zeile davor nicht mehr)
  console.log('ticketUpdatedJSON', ticketUpdatedJSON);
  const ticketUpdatedData = JSON.parse(ticketUpdatedJSON);

  expect(ticketUpdatedData.orderId).not.toBeDefined();
  expect(ticketUpdatedData.id).toEqual(ticket.id);
});
