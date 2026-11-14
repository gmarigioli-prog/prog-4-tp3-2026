import { z } from "zod";

const productoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  precio: z.number(),
});

const productosSchema = z.array(productoSchema);

const itemPedidoSchema = z.object({
  productoId: z.number().int().positive(),
  cantidad: z.number().int().positive(),
});

const entradaPedidoSchema = z.object({
  items: z.array(itemPedidoSchema).min(1),
  mesaId: z.number().int().positive().optional(),
});

const pedidoSchema = z.object({
  id: z.number().int().positive(),
  items: z.array(itemPedidoSchema),
  estado: z.enum(["pendiente", "enviado", "entregado"]),
  mesaId: z.number().int().positive().optional(),
  total: z.number().nonnegative(),
});

export type Producto = z.infer<typeof productoSchema>;
export type EntradaPedido = z.infer<typeof entradaPedidoSchema>;
export type Pedido = z.infer<typeof pedidoSchema>;

export async function obtenerProductos(): Promise<Producto[]> {
  const response = await fetch("/productos");

  if (response.status !== 200) {
    throw new Error("No se pudo cargar el menú");
  }

  const data: unknown = await response.json();
  const result = productosSchema.safeParse(data);

  if (!result.success) {
    throw new Error("La respuesta de productos no cumple el contrato");
  }

  return result.data;
}

export async function crearPedido(entrada: EntradaPedido): Promise<Pedido> {
  const response = await fetch("/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entrada),
  });

  if (response.status !== 201) {
    throw new Error("No se pudo confirmar el pedido");
  }

  const data: unknown = await response.json();
  const result = pedidoSchema.safeParse(data);

  if (!result.success) {
    throw new Error("La respuesta del pedido no cumple el contrato");
  }

  return result.data;
}

export async function obtenerPedido(id: number): Promise<Pedido> {
  const response = await fetch(`/pedidos/${id}`);

  if (response.status !== 200) {
    throw new Error("No se pudo consultar el pedido");
  }

  const data: unknown = await response.json();
  const result = pedidoSchema.safeParse(data);

  if (!result.success) {
    throw new Error("La respuesta del pedido no cumple el contrato");
  }

  return result.data;
}
