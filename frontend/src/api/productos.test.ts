import { beforeEach, describe, expect, it, vi } from "vitest";
import { obtenerProductos } from "./api";

describe("obtenerProductos", () => {
  const fetchMock = vi.fn();
  const productos = [
    { id: 1, nombre: "Expreso Mediano Colombia", precio: 7360 },
    { id: 19, nombre: "Muffin de chocolate", precio: 2500 },
  ];

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("hace GET a /productos y devuelve los productos validados", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(productos), { status: 200 }),
    );

    await expect(obtenerProductos()).resolves.toEqual(productos);
    expect(fetchMock).toHaveBeenCalledWith("/productos");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("devuelve un error legible si la respuesta no es 200", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: "API caída" }), { status: 500 }),
    );

    await expect(obtenerProductos()).rejects.toThrow(
      "No se pudo cargar el menú",
    );
  });

  it("devuelve un error si el JSON no cumple el contrato", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify([{ id: 1, nombre: "Producto sin precio" }]), {
        status: 200,
      }),
    );

    await expect(obtenerProductos()).rejects.toThrow(
      "La respuesta de productos no cumple el contrato",
    );
  });
});
