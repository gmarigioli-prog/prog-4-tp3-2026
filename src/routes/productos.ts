import {Router} from 'express';
import {productos} from '../../data/producto.seed';

function respuestaProducto(producto: (typeof productos)[number]) {
  return {
    id: producto.id,
    nombre: producto.nombre,
    precio: producto.calcularPrecio()
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

    if (!producto) {
      return res.status(404).json({ error: 'NotFound' });
    }

    res.json(respuestaProducto(producto));
  });

  return router;
}