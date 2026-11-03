import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { makeApp } from '../../src/app';

describe('GET /reportes/facturacion', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('devuelve 200 y lo facturado entre todos los pedidos', async () => {
    await request(app).post('/pedidos').send({ items: [{ productoId: 1, cantidad: 2 }] });
    await request(app).post('/pedidos').send({ items: [{ productoId: 19, cantidad: 1 }] });
    const res = await request(app).get('/reportes/facturacion');
    expect(res.status).toBe(200);
    expect(res.body.facturacion).toBe(12540);
  });
});

describe('GET /reportes/mas-vendido', () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(':memory:');
  });

  it('devuelve 200 y el nombre del producto mas vendido', async () => {
    await request(app).post('/pedidos').send({ items: [{ productoId: 1, cantidad: 2 }] });
    await request(app).post('/pedidos').send({ items: [{ productoId: 19, cantidad: 1 }] });
    const res = await request(app).get('/reportes/mas-vendido');
    expect(res.status).toBe(200);
    expect(res.body.producto).toBe('Expreso Pocillo Brasil');
  });
});