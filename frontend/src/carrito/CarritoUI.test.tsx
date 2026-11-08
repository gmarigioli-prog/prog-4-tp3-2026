import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CarritoProvider, useCarrito } from "./CarritoContext";
import { type ItemCarrito } from "./carrito";
import { CarritoUI } from "./CarritoUI";

const item: ItemCarrito = {
  id: 1,
  nombre: "Expreso Mediano Colombia",
  precio: 7360,
  cantidad: 1,
};

const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

function coincidePrecio(texto: string, precio: number): boolean {
  const esperado = `Subtotal: ${formatoPrecio.format(precio)}`;
  return texto.replace(/\s/g, " ") === esperado.replace(/\s/g, " ");
}

function AgregarProducto() {
  const { agregar } = useCarrito();

  return (
    <button type="button" onClick={() => agregar(item)}>
      Agregar producto
    </button>
  );
}

function renderCarrito() {
  return render(
    <CarritoProvider>
      <AgregarProducto />
      <CarritoUI />
    </CarritoProvider>,
  );
}

describe("CarritoUI", () => {
  it("muestra el carrito vacio y deshabilita confirmar pedido", () => {
    renderCarrito();

    expect(screen.getByText("El carrito está vacío")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Confirmar pedido" }),
    ).toBeDisabled();
  });

  it("muestra nombre, cantidad y subtotal al agregar un item", async () => {
    const user = userEvent.setup();
    renderCarrito();

    await user.click(screen.getByRole("button", { name: "Agregar producto" }));

    expect(screen.getByText(item.nombre)).toBeInTheDocument();
    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
    expect(
      screen.getByText((texto) => coincidePrecio(texto, item.precio)),
    ).toBeInTheDocument();
  });

  it("incrementa la cantidad al hacer click en +", async () => {
    const user = userEvent.setup();
    renderCarrito();

    await user.click(screen.getByRole("button", { name: "Agregar producto" }));
    await user.click(screen.getByRole("button", { name: "sumar" }));

    expect(screen.getByText("Cantidad: 2")).toBeInTheDocument();
  });

  it("quita el item al hacer click en - con cantidad 1", async () => {
    const user = userEvent.setup();
    renderCarrito();

    await user.click(screen.getByRole("button", { name: "Agregar producto" }));
    await user.click(screen.getByRole("button", { name: "restar" }));

    expect(screen.getByText("El carrito está vacío")).toBeInTheDocument();
  });

  it("elimina el item al hacer click en Quitar", async () => {
    const user = userEvent.setup();
    renderCarrito();

    await user.click(screen.getByRole("button", { name: "Agregar producto" }));
    await user.click(screen.getByRole("button", { name: "Quitar" }));

    expect(screen.getByText("El carrito está vacío")).toBeInTheDocument();
  });

  it("muestra el subtotal general", async () => {
    const user = userEvent.setup();
    renderCarrito();

    await user.click(screen.getByRole("button", { name: "Agregar producto" }));

    expect(
      screen.getByText((texto) => coincidePrecio(texto, item.precio)),
    ).toBeInTheDocument();
  });
});
