import { describe, expect, it } from "vitest";
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

describe("carrito", () => {
  const item: ItemCarrito = {
    id: 1,
    nombre: "Expreso Mediano Colombia",
    precio: 7360,
    cantidad: 1,
  };
  const otroItem: ItemCarrito = {
    id: 2,
    nombre: "Muffin de chocolate",
    precio: 2500,
    cantidad: 1,
  };
  const estadoInicial: EstadoCarrito = { items: [] };

  it("tiene un estado inicial vacio", () => {
    expect(estadoInicial).toEqual({ items: [] });
  });

  it("agrega un item nuevo con cantidad 1", () => {
    expect(agregarItem(estadoInicial, item)).toEqual({ items: [item] });
  });

  it("incrementa la cantidad de un item existente", () => {
    const estado = { items: [item] };

    expect(agregarItem(estado, item)).toEqual({
      items: [{ ...item, cantidad: 2 }],
    });
  });

  it("resta una unidad de un item", () => {
    const estado = { items: [{ ...item, cantidad: 2 }] };

    expect(restarItem(estado, item.id)).toEqual({ items: [item] });
  });

  it("quita el item cuando se resta su ultima unidad", () => {
    const estado = { items: [item] };

    expect(restarItem(estado, item.id)).toEqual({ items: [] });
  });

  it("quita un item por id", () => {
    const estado = { items: [item, otroItem] };

    expect(quitarItem(estado, item.id)).toEqual({ items: [otroItem] });
  });

  it("vacía el carrito", () => {
    const estado = { items: [item, otroItem] };

    expect(vaciarCarrito(estado)).toEqual({ items: [] });
  });

  it("calcula el subtotal sumando precio por cantidad", () => {
    const estado = { items: [{ ...item, cantidad: 2 }, otroItem] };

    expect(calcularSubtotal(estado)).toBe(17220);
  });

  it("indica que el carrito esta vacio", () => {
    expect(estaVacio(estadoInicial)).toBe(true);
  });
});
