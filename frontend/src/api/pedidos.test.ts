import { beforeEach, describe, expect, it, vi } from "vitest";
import { crearPedido } from "./pedidos";

describe("crearPedido", () => {
  const fetchMock = vi.fn();

  const pedidoDevuelto = {
    id: 12,
    items: [{ productoId: 1, cantidad: 2 }],
    estado: "pendiente",
    mesaId: 5,
    total: 10000,
  };

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("envía los ítems y la mesa con POST /pedidos y devuelve la respuesta", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(pedidoDevuelto), { status: 201 }),
    );

    const entrada = {
      items: [{ productoId: 1, cantidad: 2 }],
      mesaId: 5,
    };

    await expect(crearPedido(entrada)).resolves.toEqual(pedidoDevuelto);

    expect(fetchMock).toHaveBeenCalledWith("/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entrada),
    });
  });

  it("envía el pedido sin mesaId cuando no hay una mesa asociada", async () => {
    const pedidoSinMesa = {
      id: 13,
      items: [{ productoId: 1, cantidad: 1 }],
      estado: "pendiente",
      total: 5000,
    };

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify(pedidoSinMesa), { status: 201 }),
    );

    const entrada = {
      items: [{ productoId: 1, cantidad: 1 }],
    };

    await expect(crearPedido(entrada)).resolves.toEqual(pedidoSinMesa);

    expect(fetchMock).toHaveBeenCalledWith("/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entrada),
    });
  });
});