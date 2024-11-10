import request from 'supertest';
import { app } from './../app';

export const signin = async (
  email = '2I8wT@example.com',
  password = 'password'
): Promise<string[]> => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');
  if (!cookie) {
    throw new Error('Expected cookie but got undefined.');
  }
  return cookie;
};
