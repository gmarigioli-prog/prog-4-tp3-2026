import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { obtenerProductos } from "../api/productos";
import Menu from "./Menu";

vi.mock("../api/productos", () => ({
  obtenerProductos: vi.fn(),
}));

describe("Menu", () => {
  const obtenerProductosMock = vi.mocked(obtenerProductos);
  const productos = [
    { id: 1, nombre: "Expreso Mediano Colombia", precio: 7360 },
    { id: 19, nombre: "Muffin de chocolate", precio: 2500 },
  ];

  beforeEach(() => {
    obtenerProductosMock.mockReset();
  });

  it("muestra Cargando al iniciar", () => {
    obtenerProductosMock.mockReturnValue(new Promise(() => {}));

    render(<Menu />);

    expect(screen.getByText("Cargando")).toBeInTheDocument();
  });

  it("muestra los productos cuando la carga resuelve", async () => {
    obtenerProductosMock.mockResolvedValue(productos);

    render(<Menu />);

    expect(
      await screen.findByText("Expreso Mediano Colombia"),
    ).toBeInTheDocument();
    expect(screen.getByText("Muffin de chocolate")).toBeInTheDocument();
  });

  it("muestra un error y el boton Reintentar cuando la carga rechaza", async () => {
    obtenerProductosMock.mockRejectedValue(
      new Error("No se pudo cargar el menu"),
    );

    render(<Menu />);

    expect(
      await screen.findByText("No se pudo cargar el menu"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reintentar" }),
    ).toBeInTheDocument();
  });

  it("vuelve a llamar a obtenerProductos al reintentar", async () => {
    const user = userEvent.setup();
    obtenerProductosMock
      .mockRejectedValueOnce(new Error("No se pudo cargar el menu"))
      .mockResolvedValueOnce(productos);

    render(<Menu />);

    await user.click(await screen.findByRole("button", { name: "Reintentar" }));

    await waitFor(() => {
      expect(obtenerProductosMock).toHaveBeenCalledTimes(2);
    });
    expect(
      await screen.findByText("Expreso Mediano Colombia"),
    ).toBeInTheDocument();
  });
});
