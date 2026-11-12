import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { obtenerProductos } from "../api/productos";
import { CarritoProvider } from "../carrito/CarritoContext";
import { CarritoUI } from "../carrito/CarritoUI";
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

  function renderMenu() {
    return render(
      <CarritoProvider>
        <Menu />
        <CarritoUI />
      </CarritoProvider>,
    );
  }

  beforeEach(() => {
    obtenerProductosMock.mockReset();
  });

  it("muestra Cargando al iniciar", () => {
    obtenerProductosMock.mockReturnValue(new Promise(() => {}));

    renderMenu();

    expect(screen.getByText("Cargando")).toBeInTheDocument();
  });

  it("muestra las bebidas cuando la carga resuelve", async () => {
    obtenerProductosMock.mockResolvedValue(productos);

    renderMenu();

    expect(
      await screen.findByText("Expreso Mediano Colombia"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Muffin de chocolate")).not.toBeInTheDocument();
  });

  it("separa bebidas y pastelería al cambiar de categoría", async () => {
    const user = userEvent.setup();
    obtenerProductosMock.mockResolvedValue(productos);

    renderMenu();

    expect(
      await screen.findByText("Expreso Mediano Colombia"),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Pastelería" }));

    expect(screen.getByText("Muffin de chocolate")).toBeInTheDocument();
    expect(
      screen.queryByText("Expreso Mediano Colombia"),
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Tipo de bebida")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Bebidas" }));

    expect(screen.getByText("Expreso Mediano Colombia")).toBeInTheDocument();
    expect(screen.queryByText("Muffin de chocolate")).not.toBeInTheDocument();
  });

  it("muestra un error y el boton Reintentar cuando la carga rechaza", async () => {
    obtenerProductosMock.mockRejectedValue(
      new Error("No se pudo cargar el menu"),
    );

    renderMenu();

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

    renderMenu();

    await user.click(await screen.findByRole("button", { name: "Reintentar" }));

    await waitFor(() => {
      expect(obtenerProductosMock).toHaveBeenCalledTimes(2);
    });
    expect(
      await screen.findByText("Expreso Mediano Colombia"),
    ).toBeInTheDocument();
  });

  it("guia la elección secuencial y agrega la combinación completa al carrito", async () => {
    const user = userEvent.setup();
    obtenerProductosMock.mockResolvedValue(productos);

    renderMenu();

    const tamanio = await screen.findByLabelText("Tamaño");
    const origen = screen.getByLabelText("País de origen");
    expect(tamanio).toBeDisabled();
    expect(origen).toBeDisabled();

    await user.selectOptions(screen.getByLabelText("Tipo de bebida"), "Expreso");
    expect(tamanio).toBeEnabled();
    expect(origen).toBeDisabled();

    await user.selectOptions(tamanio, "Mediano");
    expect(screen.getByText(/Precio desde:/)).toBeInTheDocument();
    expect(origen).toBeEnabled();
    expect(
      screen.queryByRole("button", { name: "Agregar café al carrito" }),
    ).not.toBeInTheDocument();

    await user.selectOptions(origen, "Colombia");
    expect(
      screen.getByText("Dulce y equilibrado, con notas frutales.", {
        selector: "p",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Precio total:/)).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Agregar café al carrito" }),
    );

    expect(screen.getByText("Cantidad: 1")).toBeInTheDocument();
  });

  it("limpia las opciones posteriores al cambiar una elección anterior", async () => {
    const user = userEvent.setup();
    obtenerProductosMock.mockResolvedValue(productos);

    renderMenu();

    await user.selectOptions(
      await screen.findByLabelText("Tipo de bebida"),
      "Expreso",
    );
    await user.selectOptions(screen.getByLabelText("Tamaño"), "Mediano");
    await user.selectOptions(screen.getByLabelText("País de origen"), "Colombia");
    await user.selectOptions(screen.getByLabelText("Tipo de bebida"), "Filtrado");

    expect(screen.getByLabelText("Tamaño")).toHaveValue("");
    expect(screen.getByLabelText("País de origen")).toHaveValue("");
    expect(screen.getByLabelText("País de origen")).toBeDisabled();
  });
});
