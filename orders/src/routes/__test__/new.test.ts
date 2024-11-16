import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper'; // auch hier wird eigentlich der gemockte importiert
import mongoose, { mongo } from 'mongoose';

it('has a route handler listening to /api/orders for post requests', async () => {
  const response = await request(app).post('/api/orders').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/orders').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid tickedId is provided', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketid: '1234546',
    })
    .expect(400);

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({})
    .expect(400);
});

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it('returns an error if the ticket is already reservered', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: '12345',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('reserves a ticket', async () => {
  const cookie = global.signin();
  const initialOrders = await Order.find({});
  expect(initialOrders.length).toEqual(0);
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
  const orders = await Order.find({}).populate('ticket');
  expect(orders.length).toEqual(1);
  expect(orders[0].ticket.id).toEqual(ticket.id);
});

it.todo('emits an order created event');
