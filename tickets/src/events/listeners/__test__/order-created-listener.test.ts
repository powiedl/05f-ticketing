import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@powidl2024/common__powidl2024';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: '123',
  });
  await ticket.save();

  // create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: '123',
    expiresAt: '123',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created
  expect(natsWrapper.client.publish).toHaveBeenCalled(); // works, because the client is a mock object

  // @ts-ignore
  console.log(natsWrapper.client.publish.mock.calls);
  // @ts-ignore
  console.log('data', natsWrapper.client.publish.mock.calls[0][1]);

  const ticketUpdatedJSON = (natsWrapper.client.publish as jest.Mock).mock
    .calls[0][1]; // mit as jest.Mock sagt man TS, dass es sich hierbei um einen Mock der eigentlichen Funktion handelt
  // - damit kann es sein Type Checking wieder machen (und man braucht das @ts-ignore in der Zeile davor nicht mehr)

  const ticketUpdatedData = JSON.parse(ticketUpdatedJSON);

  expect(ticketUpdatedData.orderId).toEqual(data.id);
  expect(ticketUpdatedData.id).toEqual(ticket.id);
});
