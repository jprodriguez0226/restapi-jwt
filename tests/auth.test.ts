import request from 'supertest';
import app from '../src/app';

describe('Auth Endpoints', () => {
  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        email: 'test1@example.com',
        password: '123456',
        role: 'customer'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.headers).toHaveProperty('auth-token');
  });

  it('should signin an existing user', async () => {
    const res = await request(app)
      .post('/auth/signin')
      .send({
        email: 'test1@example.com',
        password: '123456'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.headers).toHaveProperty('auth-token');
  });
});