import {
  agregarItem,
  calcularSubtotal,
  estaVacio,
  quitarItem,
  restarItem,
  vaciarCarrito,
  type EstadoCarrito,
  type ItemCarrito,
} from "./carrito";
import { createContext, useContext, useReducer, type ReactNode } from "react";

type AccionCarrito =
  | { type: "agregar"; item: ItemCarrito }
  | { type: "restar"; id: number }
  | { type: "quitar"; id: number }
  | { type: "vaciar" };

type ContextoCarrito = {
  items: ItemCarrito[];
  agregar: (item: ItemCarrito) => void;
  restar: (id: number) => void;
  quitar: (id: number) => void;
  vaciar: () => void;
  subtotal: number;
  estaVacio: boolean;
};

const estadoInicial: EstadoCarrito = { items: [] };
const contextoCarrito = createContext<ContextoCarrito | null>(null);

function reducerCarrito(
  estado: EstadoCarrito,
  accion: AccionCarrito,
): EstadoCarrito {
  switch (accion.type) {
    case "agregar":
      return agregarItem(estado, accion.item);
    case "restar":
      return restarItem(estado, accion.id);
    case "quitar":
      return quitarItem(estado, accion.id);
    case "vaciar":
      return vaciarCarrito(estado);
  }
}

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [estado, dispatch] = useReducer(reducerCarrito, estadoInicial);

  const contexto: ContextoCarrito = {
    items: estado.items,
    agregar: (item) => dispatch({ type: "agregar", item }),
    restar: (id) => dispatch({ type: "restar", id }),
    quitar: (id) => dispatch({ type: "quitar", id }),
    vaciar: () => dispatch({ type: "vaciar" }),
    subtotal: calcularSubtotal(estado),
    estaVacio: estaVacio(estado),
  };

  return (
    <contextoCarrito.Provider value={contexto}>
      {children}
    </contextoCarrito.Provider>
  );
}

export function useCarrito(): ContextoCarrito {
  const contexto = useContext(contextoCarrito);

  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  }

  return contexto;
}
