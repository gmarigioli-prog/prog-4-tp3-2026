export type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
};

export type EstadoCarrito = {
  items: ItemCarrito[];
};

export function agregarItem(
  estado: EstadoCarrito,
  item: ItemCarrito,
): EstadoCarrito {
  const existe = estado.items.some((itemActual) => itemActual.id === item.id);

  if (!existe) {
    return {
      items: [...estado.items, { ...item, cantidad: 1 }],
    };
  }

  return {
    items: estado.items.map((itemActual) =>
      itemActual.id === item.id
        ? { ...itemActual, cantidad: itemActual.cantidad + 1 }
        : itemActual,
    ),
  };
}

export function restarItem(estado: EstadoCarrito, id: number): EstadoCarrito {
  return {
    items: estado.items.flatMap((item) => {
      if (item.id !== id) {
        return [item];
      }

      return item.cantidad > 1
        ? [{ ...item, cantidad: item.cantidad - 1 }]
        : [];
    }),
  };
}

export function quitarItem(estado: EstadoCarrito, id: number): EstadoCarrito {
  return {
    items: estado.items.filter((item) => item.id !== id),
  };
}

export function vaciarCarrito(_estado: EstadoCarrito): EstadoCarrito {
  return { items: [] };
}

export function calcularSubtotal(estado: EstadoCarrito): number {
  return estado.items.reduce(
    (subtotal, item) => subtotal + item.precio * item.cantidad,
    0,
  );
}

export function estaVacio(estado: EstadoCarrito): boolean {
  return estado.items.length === 0;
}
