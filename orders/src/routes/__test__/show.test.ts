import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it('throws a 401 error if you are not signed in', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/orders/${orderId}`).send().expect(401);
});

it('throws a 404 error if the ticket is not found', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', global.signin())
    .send()
    .expect(404);
});

it('throws a 401 error, if the user does not own the order', async () => {
  const userOne = global.signin();
  const userTwo = global.signin();

  const ticket = await buildTicket();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(401);
});

it('fetches the order if it is owned by the current user', async () => {
  const userOne = global.signin();

  const ticket = await buildTicket();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(200);
  expect(fetchedOrder).toEqual(order);
});
