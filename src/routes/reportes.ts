import { Router } from 'express';
import { productos } from '../../data/producto.seed';
import { Pedido } from '../models/Pedido';
import { facturacionTotal, productoMasVendido } from '../models/Reportes';

export function makeReportesRouter(pedidos: Pedido[]) {
  const router = Router();

  router.get('/facturacion', (req, res) => {
    res.json({ facturacion: facturacionTotal(pedidos, productos) });
  });

  router.get('/mas-vendido', (req, res) => {
    res.json({ producto: productoMasVendido(pedidos, productos) });
  });

  return router;
}