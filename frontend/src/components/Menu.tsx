import { useCallback, useEffect, useState } from "react";
import { obtenerProductos, type Producto } from "../api/productos";

type Estado = "cargando" | "error" | "listo";

function Menu() {
  const [estado, setEstado] = useState<Estado>("cargando");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mensajeError, setMensajeError] = useState("");

  const cargarProductos = useCallback(async () => {
    setEstado("cargando");

    try {
      const productosCargados = await obtenerProductos();
      setProductos(productosCargados);
      setEstado("listo");
    } catch (error: unknown) {
      setMensajeError(
        error instanceof Error ? error.message : "No se pudo cargar el menu",
      );
      setEstado("error");
    }
  }, []);

  useEffect(() => {
    void cargarProductos();
  }, [cargarProductos]);

  if (estado === "cargando") {
    return <p>Cargando</p>;
  }

  if (estado === "error") {
    return (
      <div>
        <p>{mensajeError}</p>
        <button type="button" onClick={() => void cargarProductos()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <ul>
      {productos.map((producto) => (
        <li key={producto.id}>
          <span>{producto.nombre}</span>
          <span>
            {producto.precio.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default Menu;
