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

  // cambio tp3
  it('devuelve 200 y el pedido cuando existe con su estado, items y total', async () => {
    await request(app).post('/pedidos').send({ items: [{ productoId: 1, cantidad: 2 }] });
    const res = await request(app).get('/pedidos/1');
    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('pendiente');
    expect(res.body.items).toHaveLength(1);
    expect(res.body.total).toBe(10000);
  });

  //mensaje de error añadido
  it('devuelve 404 cuando no existe', async () => {
    const res = await request(app).get('/pedidos/999');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Pedido no encontrado');
  });
});

// cambio tp3
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
    expect(res.body.total).toBe(10040);
  });

  it('acepta mesaID opcional y lo devuelve en la respuesta', async () => {
    const res = await request(app)
      .post('/pedidos')
      .send({ items: [{ productoId: 1, cantidad: 2 }], mesaId: 5 });
    expect(res.status).toBe(201);
    expect(res.body.mesaId).toBe(5);
  });
});