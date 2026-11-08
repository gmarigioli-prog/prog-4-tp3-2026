import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ItemCarrito } from "./carrito";
import { CarritoProvider, useCarrito } from "./CarritoContext";

const item: ItemCarrito = {
  id: 1,
  nombre: "Expreso Mediano Colombia",
  precio: 7360,
  cantidad: 1,
};

function ConsumidorCarrito() {
  const { agregar, restar, quitar, items, estaVacio, subtotal } = useCarrito();
  const cantidad =
    items.find((itemActual) => itemActual.id === item.id)?.cantidad ?? 0;

  return (
    <div>
      <button type="button" onClick={() => agregar(item)}>
        Agregar
      </button>
      <button type="button" onClick={() => restar(item.id)}>
        Restar
      </button>
      <button type="button" onClick={() => quitar(item.id)}>
        Quitar
      </button>
      <span>Cantidad: {cantidad}</span>
      <span>Vacio: {estaVacio ? "si" : "no"}</span>
      <span>Subtotal: {subtotal}</span>
    </div>
  );
}

describe("CarritoContext", () => {
  it("lanza un error si useCarrito se usa sin Provider", () => {
    expect(() => render(<ConsumidorCarrito />)).toThrow();
  });

  it("agrega un item", async () => {
    const user = userEvent.setup();

    render(
      <CarritoProvider>
        <ConsumidorCarrito />
      </CarritoProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
  });

  it("resta un item", async () => {
    const user = userEvent.setup();

    render(
      <CarritoProvider>
        <ConsumidorCarrito />
      </CarritoProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Agregar" }));
    await user.click(screen.getByRole("button", { name: "Agregar" }));
    await user.click(screen.getByRole("button", { name: "Restar" }));

    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
  });

  it("quita un item", async () => {
    const user = userEvent.setup();

    render(
      <CarritoProvider>
        <ConsumidorCarrito />
      </CarritoProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Agregar" }));
    await user.click(screen.getByRole("button", { name: "Quitar" }));

    expect(screen.getByText("Vacio: si")).toBeInTheDocument();
  });

  it("indica que el carrito vacio esta vacio", () => {
    render(
      <CarritoProvider>
        <ConsumidorCarrito />
      </CarritoProvider>,
    );

    expect(screen.getByText("Vacio: si")).toBeInTheDocument();
  });

  it("refleja el subtotal calculado", async () => {
    const user = userEvent.setup();

    render(
      <CarritoProvider>
        <ConsumidorCarrito />
      </CarritoProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Agregar" }));

    expect(screen.getByText("Subtotal: 7360")).toBeInTheDocument();
  });
});
