import { useEffect, useState } from "react";
import { crearPedido, obtenerPedido, type Pedido } from "../api/api";
import { useCarrito } from "./CarritoContext";

function formatearPrecio(precio: number): string {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

type CarritoUIProps = {
  mesaId?: number | null;
};

export function CarritoUI({ mesaId }: CarritoUIProps) {
  const { items, restar, quitar, agregar, subtotal, estaVacio, vaciar } =
    useCarrito();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const pedidoId = pedido?.id;
  const estadoPedido = pedido?.estado;

  useEffect(() => {
    if (pedidoId === undefined || estadoPedido === "entregado") {
      return;
    }

    const id = pedidoId;
    let cancelado = false;
    let timer: ReturnType<typeof setTimeout>;

    async function consultarPedido() {
      try {
        const pedidoActualizado = await obtenerPedido(id);

        if (cancelado) {
          return;
        }

        setPedido(pedidoActualizado);
        setMensajeError("");

        if (pedidoActualizado.estado !== "entregado") {
          timer = setTimeout(() => void consultarPedido(), 1000);
        }
      } catch (error: unknown) {
        if (!cancelado) {
          setMensajeError(
            error instanceof Error
              ? error.message
              : "No se pudo consultar el pedido",
          );
        }
      }
    }

    timer = setTimeout(() => void consultarPedido(), 1000);

    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, [pedidoId, estadoPedido]);

  async function confirmarPedido() {
    setEnviando(true);
    setMensajeError("");

    try {
      const pedidoCreado = await crearPedido({
        items: items.map(({ id, cantidad }) => ({
          productoId: id,
          cantidad,
        })),
        ...(mesaId !== null && mesaId !== undefined ? { mesaId } : {}),
      });

      setPedido(pedidoCreado);
      vaciar();
    } catch (error: unknown) {
      setMensajeError(
        error instanceof Error
          ? error.message
          : "No se pudo confirmar el pedido",
      );
    } finally {
      setEnviando(false);
    }
  }

  if (estaVacio && !pedido) {
    return (
      <section>
        <p>El carrito está vacío</p>
        <button type="button" disabled>
          Confirmar pedido
        </button>
        {mensajeError && <p role="alert">{mensajeError}</p>}
      </section>
    );
  }

  if (pedido) {
    return (
      <section aria-live="polite">
        <p>{`Pedido #${pedido.id}`}</p>
        <p>{`Estado: ${pedido.estado}`}</p>
        <p>{`Total: ${formatearPrecio(pedido.total)}`}</p>
        {mensajeError && <p role="alert">{mensajeError}</p>}
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
      {mensajeError && <p role="alert">{mensajeError}</p>}
      <button
        type="button"
        disabled={enviando}
        onClick={() => void confirmarPedido()}
      >
        {enviando ? "Enviando pedido..." : "Confirmar pedido"}
      </button>
    </section>
  );
}
