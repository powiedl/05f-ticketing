import request from 'supertest';
import { signin } from '../../test/auth-helper';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  const cookie = await signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual('2I8wT@example.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app) // no cookie
    .get('/api/users/currentuser')
    .send()
    .expect(200);
  expect(response.body.currentUser).toBeNull();
});
