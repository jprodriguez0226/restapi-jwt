import request from 'supertest';
import app from '../src/app';

let token: string;

beforeAll(async () => {
  const res = await request(app).post('/auth/signin').send({
    email: 'customer@example.com',
    password: 'customerpass'
  });
  token = res.headers['auth-token'];
});

describe('Order Endpoints', () => {
  it('should create an order', async () => {
    const res = await request(app)
      .post('/orders')
      .set('auth-token', token)
      .set('Idempotency-Key', 'unique-key-123')
      .send({
        products: [{ name: 'Test Product', quantity: 1 }]
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.body).toHaveProperty('orderId');
  });

  it('should get order by ID', async () => {
    const orderRes = await request(app)
      .post('/orders')
      .set('auth-token', token)
      .set('Idempotency-Key', 'unique-key-456')
      .send({
        products: [{ name: 'Test Product', quantity: 1 }]
      });

    const orderId = orderRes.body.orderId;

    const res = await request(app)
      .get(`/orders/${orderId}`)
      .set('auth-token', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('products');
  });
});