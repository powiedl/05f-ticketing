import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper'; // auch hier wird eigentlich der gemockte importiert
import mongoose, { mongo } from 'mongoose';

it('has a route handler listening to /api/orders/:orderId for delete requests', async () => {
  const response = await request(app).delete('/api/orders/123').send(); // delete the order with id 123

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  await request(app).delete(`/api/orders/${orderId}`).send().expect(401);
});

it('can only cancel an order if the user owns it', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // make an order associated with this ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user) // user is signed in
    .send({ ticketId: ticket.id })
    .expect(201);

  // try to cancel the order
  const wrongUser = global.signin();
  await request(app)
    .delete(`/api/orders/${order.id}`) // delete the order
    .set('Cookie', wrongUser) // user is signed in
    .send()
    .expect(401);
});

it('marks an order as cancelled', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // make an order associated with this ticket
  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user) // user is signed in
    .send({ ticketId: ticket.id })
    .expect(201);

  // try to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`) // delete the order
    .set('Cookie', user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
