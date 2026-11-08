import { useCarrito } from "./CarritoContext";

function formatearPrecio(precio: number): string {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

export function CarritoUI() {
  const { items, restar, quitar, agregar, subtotal, estaVacio } = useCarrito();

  if (estaVacio) {
    return (
      <section>
        <p>El carrito está vacío</p>
        <button type="button" disabled>
          Confirmar pedido
        </button>
      </section>
    );
  }

  return (
    <section>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span>{item.nombre}</span>
            <span>{`Cantidad: ${item.cantidad}`}</span>
            <span>{formatearPrecio(item.precio)}</span>
            <button
              type="button"
              aria-label="sumar"
              onClick={() => agregar(item)}
            >
              +
            </button>
            <button
              type="button"
              aria-label="restar"
              onClick={() => restar(item.id)}
            >
              -
            </button>
            <button type="button" onClick={() => quitar(item.id)}>
              Quitar
            </button>
          </li>
        ))}
      </ul>
      <p>{`Subtotal: ${formatearPrecio(subtotal)}`}</p>
      <button type="button">Confirmar pedido</button>
    </section>
  );
}
