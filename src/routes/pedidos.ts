import { Router } from 'express';
import { z } from 'zod';
import { productos } from '../../data/producto.seed';
import { Pedido } from '../models/Pedido';

const createSchemaPedido = z.object({
  items: z.array(
    z.object({
      productoId: z.number().int().positive(),
      cantidad: z.number().int().positive(),
    }),
  ).min(1),
  estado: z.enum(['pendiente', 'enviado', 'entregado']).optional()
});

export function makePedidoRouter(pedidos: Pedido[] = []) {
  const router = Router();
  let nextId = 1;

  router.post('/', (req, res) => {
    const parsed = createSchemaPedido.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: 'ValidationError',
        details: parsed.error.flatten()
      });
    }

    const ProductoInvalido = parsed.data.items.some(
      item => !productos.some(producto => producto.id === item.productoId)
    );

    if (ProductoInvalido) {
      return res.status(400).json({ error: 'Producto no encontrado' });
    }

    const pedido = new Pedido(nextId++, parsed.data.items, parsed.data.estado || 'pendiente');
    pedidos.push(pedido);

    res.status(201).json({
      ...pedido,
      total: pedido.calcularTotal(productos)
    });
  });

  router.get('/', (_req, res) => {
    res.json(
      pedidos.map(pedido => ({
        ...pedido,
        total: pedido.calcularTotal(productos)
      }))
    );
  });

  router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const pedido = pedidos.find(pedido => pedido.id === id);

    if (!pedido) {
      return res.status(404).json({ error: 'NotFound' });
    }

    res.json({
      ...pedido,
      total: pedido.calcularTotal(productos)
    });
  });

  return router;
}