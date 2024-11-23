import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { OrderStatus } from '@powidl2024/common__powidl2024';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payments';

//jest.mock('../../stripe.ts');

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      token: '123',
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      orderId: order.id,
      token: '123',
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  expect(true).toBeTruthy();
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ orderId: order.id, token: '123' })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 10000) / 100;
  //  console.log('price of the order:', price, 'USD');
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0, // version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app) // await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({ orderId: order.id, token: 'tok_visa' })
    .expect(201);

  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // expect(stripe.charges.create).toHaveBeenCalled();
  // expect(chargeOptions.currency).toEqual('usd');
  // expect(chargeOptions.amount).toEqual(20 * 100);
  // expect(chargeOptions.source).toEqual('tok_visa');

  const stripeCharges = await stripe.charges.list({ limit: 20 });
  let chargeFound = false;
  let charge;
  for (charge of stripeCharges.data) {
    if (charge.amount === price * 100) {
      //      console.log(`  ... checking ${charge.amount} with ${price * 100}`);
      //console.log(charge);
      expect(charge.currency).toEqual('usd');
      //expect(charge.source).toEqual('tok_visa');
      chargeFound = true;
      break;
    }
  }
  expect(chargeFound).toBeTruthy();
  const updatedOrder = await Order.findById(order.id);
  const payment = await Payment.findOne({ orderId: order.id });

  expect(payment).not.toBeNull();
  expect(payment!.orderId).toEqual(order.id);
  expect(payment!.stripeId).toEqual(charge!.id);
  //expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});
