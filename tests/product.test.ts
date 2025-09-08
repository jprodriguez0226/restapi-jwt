import request from 'supertest';
import app from '../src/app';

let token: string;

beforeAll(async () => {
  const res = await request(app).post('/auth/signin').send({
    email: 'admin@example.com',
    password: 'adminpass'
  });
  token = res.headers['auth-token'];
});

describe('Product Endpoints', () => {
  it('should create a product', async () => {
    const res = await request(app)
      .post('/products')
      .set('auth-token', token)
      .send({
        sku: 'SKU123',
        name: 'Test Product',
        price: 100,
        stock: 50
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should get paginated products', async () => {
    const res = await request(app).get('/products?page=1&limit=5');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('products');
  });
});