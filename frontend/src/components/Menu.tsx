import { useCallback, useEffect, useState } from "react";
import { obtenerProductos, type Producto } from "../api/productos";
import { useCarrito } from "../carrito/CarritoContext";

type Estado = "cargando" | "error" | "listo";
type Categoria = "bebidas" | "pasteleria";
type TipoBebida = "Expreso" | "Filtrado";
type Tamanio = "Pocillo" | "Mediano" | "Grande";
type Origen = "Colombia" | "Brasil" | "Etiopia";

const origenes: Record<Origen, string> = {
  Colombia: "Dulce, equilibrado, frutal.",
  Brasil: "Cuerpo intenso y chocolatoso.",
  Etiopia: "Aromático, leve acidez.",
};

function formatearPrecio(precio: number): string {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });
}

function Menu() {
  const [estado, setEstado] = useState<Estado>("cargando");
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mensajeError, setMensajeError] = useState("");
  const [categoria, setCategoria] = useState<Categoria>("bebidas");
  const [tipo, setTipo] = useState<TipoBebida | "">("");
  const [tamanio, setTamanio] = useState<Tamanio | "">("");
  const [origen, setOrigen] = useState<Origen | "">("");
  const { agregar } = useCarrito();

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

  const tamanioCatalogo = tamanio === "Grande" ? "Taza grande" : tamanio;
  const prefijoCombinacion =
    tipo && tamanioCatalogo ? `${tipo} ${tamanioCatalogo} ` : "";
  const combinaciones = prefijoCombinacion
    ? productos.filter((producto) =>
        producto.nombre.startsWith(prefijoCombinacion),
      )
    : [];
  const precioDesde =
    combinaciones.length > 0
      ? Math.min(...combinaciones.map((producto) => producto.precio))
      : undefined;
  const productoElegido =
    tipo && tamanioCatalogo && origen
      ? productos.find(
          (producto) =>
            producto.nombre === `${tipo} ${tamanioCatalogo} ${origen}`,
        )
      : undefined;
  const productosBebida = productos.filter(
    (producto) =>
      producto.nombre.startsWith("Expreso ") ||
      producto.nombre.startsWith("Filtrado "),
  );
  const productosPasteleria = productos.filter(
    (producto) =>
      !producto.nombre.startsWith("Expreso ") &&
      !producto.nombre.startsWith("Filtrado "),
  );
  const productosVisibles =
    categoria === "bebidas" ? productosBebida : productosPasteleria;

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
    <>
      <nav aria-label="Categorías de productos">
        <button
          type="button"
          aria-pressed={categoria === "bebidas"}
          onClick={() => setCategoria("bebidas")}
        >
          Bebidas
        </button>
        <button
          type="button"
          aria-pressed={categoria === "pasteleria"}
          onClick={() => setCategoria("pasteleria")}
        >
          Pastelería
        </button>
      </nav>

      {categoria === "bebidas" && (
        <section aria-labelledby="armar-cafe">
          <h2 id="armar-cafe">Arma tu café</h2>
          <label>
            Tipo de bebida
            <select
              value={tipo}
              onChange={(event) => {
                setTipo(event.target.value as TipoBebida | "");
                setTamanio("");
                setOrigen("");
              }}
            >
              <option value="">Elegí una bebida</option>
              <option value="Expreso">Expreso</option>
              <option value="Filtrado">Filtrado</option>
            </select>
          </label>

          <label>
            Tamaño
            <select
              value={tamanio}
              disabled={!tipo}
              onChange={(event) => {
                setTamanio(event.target.value as Tamanio | "");
                setOrigen("");
              }}
            >
              <option value="">Elegí un tamaño</option>
              <option value="Pocillo">Pocillo</option>
              <option value="Mediano">Mediano</option>
              <option value="Grande">Grande</option>
            </select>
          </label>

          {tipo && tamanio && (
            <p>
              {precioDesde === undefined
                ? "No hay precios disponibles para esta combinación."
                : `Precio desde: ${formatearPrecio(precioDesde)}`}
            </p>
          )}

          <label>
            País de origen
            <select
              value={origen}
              disabled={!tipo || !tamanio}
              onChange={(event) =>
                setOrigen(event.target.value as Origen | "")
              }
            >
              <option value="">Elegí un origen</option>
              {Object.entries(origenes).map(([nombre, descripcion]) => (
                <option key={nombre} value={nombre}>
                  {`${nombre} — ${descripcion}`}
                </option>
              ))}
            </select>
          </label>

          {origen && <p>{origenes[origen]}</p>}
          {tipo && tamanio && origen && (
            <>
              <p>
                {productoElegido
                  ? `Precio total: ${formatearPrecio(productoElegido.precio)}`
                  : "Esta combinación no está disponible."}
              </p>
              <button
                type="button"
                disabled={!productoElegido}
                onClick={() => {
                  if (productoElegido) {
                    agregar({ ...productoElegido, cantidad: 1 });
                  }
                }}
              >
                Agregar café al carrito
              </button>
            </>
          )}
        </section>
      )}

      <section aria-labelledby={categoria === "bebidas" ? "titulo-bebidas" : "titulo-pasteleria"}>
        <h2
          id={categoria === "bebidas" ? "titulo-bebidas" : "titulo-pasteleria"}
        >
          {categoria === "bebidas" ? "Bebidas" : "Pastelería"}
        </h2>
        <ul
          aria-label={
            categoria === "bebidas"
              ? "Productos de bebidas"
              : "Productos de pastelería"
          }
        >
          {productosVisibles.map((producto) => (
            <li key={producto.id}>
  <span>{producto.nombre}</span>
  <span>Precio: {formatearPrecio(producto.precio)}</span>
  {categoria === "pasteleria" && (
    <button
      type="button"
      onClick={() => agregar({ ...producto, cantidad: 1 })}
    >
      Agregar al carrito
    </button>
  )}
</li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Menu;
