import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'dsafsd', price: 20 })
    .set('Cookie', global.signin())
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'dsafsd', price: 20 })
    .expect(401);
});

it('returns a 404 if the users does not own the ticket', async () => {});

it('returns a 400 if the user does not provide a valid price and title', async () => {});

it('updates the ticket with provided values', async () => {});
