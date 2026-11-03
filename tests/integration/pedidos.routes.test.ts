import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';
describe('GET /pedidos', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('devuelve 200 y la lista de pedidos creados', async () => {
    await request(app).post('/pedidos').send({ items: [{ productoId: 1, cantidad: 2 }] });
    await request(app).post('/pedidos').send({ items: [{ productoId: 19, cantidad: 1 }] });
    const res = await request(app).get('/pedidos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('GET /pedidos/:id', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('devuelve 200 y el pedido cuando existe', async () => {
    const creado = await request(app).post('/pedidos').send({ items: [{ productoId: 1, cantidad: 2 }] });
    const res = await request(app).get(`/pedidos/${creado.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(10040);
  });

  it('devuelve 404 cuando no existe', async () => {
    const res = await request(app).get('/pedidos/999');
    expect(res.status).toBe(404);
  });
});