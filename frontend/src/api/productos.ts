import { z } from "zod";

const productoSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  precio: z.number(),
});

const productosSchema = z.array(productoSchema);

export type Producto = z.infer<typeof productoSchema>;

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
