import request from 'supertest';
import { app } from '../../app';

const createTicket = (title: string, price: number) => {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title,
    price,
  });
};
it('can fetch a list of tickets', async () => {
  createTicket('test', 20).expect(201);
  createTicket('another test', 30).expect(201);
  const response = await request(app).get('/api/tickets');
  console.log('ticket data', response.body);
  expect(response.status).toEqual(200);
  expect(response.body.length).toEqual(2);
});
