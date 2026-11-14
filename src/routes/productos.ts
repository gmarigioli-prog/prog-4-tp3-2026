import {Router} from 'express';
import {productos} from '../../data/producto.seed';
import {Expreso, Filtrado, Pasteleria} from '../models/Producto';

function respuestaProducto(producto: (typeof productos)[number]) {
  return {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.calcularPrecio(),
    tipo: producto instanceof Expreso ? 'Expreso' : producto instanceof Filtrado ? 'Filtrado' : 'Pasteleria'
  };
}

export function makeProductoRouter() {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json(productos.map(respuestaProducto));
  });

  router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const producto = productos.find(producto => producto.id === id);
    //cambio tp3
    const precio = producto?.calcularPrecio();
    const tipo = producto instanceof Expreso ? 'Expreso' : producto instanceof Filtrado ? 'Filtrado' : 'Pasteleria';
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(respuestaProducto(producto));
  });

  return router;
}