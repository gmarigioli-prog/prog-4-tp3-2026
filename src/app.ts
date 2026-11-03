import express from 'express';
import { Pedido } from './models/Pedido';
import { productos } from '../data/producto.seed';
import { makeProductoRouter } from './routes/productos';
import { makePedidoRouter} from './routes/pedidos';
import { makeReportesRouter } from './routes/reportes';


export function makeApp(dbPath?: string) {
  const app = express();
  app.use(express.json());

  const pedidos: Pedido[] = [];

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/productos', makeProductoRouter(productos));
  app.use('/pedidos', makePedidoRouter(pedidos));
  app.use('/reportes', makeReportesRouter(pedidos));

  return app;
}
