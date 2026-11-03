import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';

describe('GET /productos/:id', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('devuelve 200 y el producto cuando el id existe', async () => {
    const res = await request(app).get('/productos/1');
    expect(res.status).toBe(200);
    expect(res.body.nombre).toBe('Expreso Pocillo Brasil');
  });

  it('devuelve 404 cuando el id no existe', async () => {
    const res = await request(app).get('/productos/112');
    expect(res.status).toBe(404);
  });
});
describe('GET /productos', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('devuelve 200 y la lista de los 20 productos', async () => {
    const res = await request(app).get('/productos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(20);
  });
});
describe('POST /pedidos', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('crea el pedido y devuelve 201 con su total', async () => {
    const res = await request(app)
      .post('/pedidos')
      .send({ items: [{ productoId: 1, cantidad: 2 }, { productoId: 19, cantidad: 1 }] });
    expect(res.status).toBe(201);
    expect(res.body.total).toBe(12540);
  });
});