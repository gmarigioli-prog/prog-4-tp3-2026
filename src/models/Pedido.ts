export interface ItemPedido {
  productoId: number;
  cantidad: number;
}

export interface ProductoConPrecio {
  id: number;
  nombre: string;
  calcularPrecio(): number;
}

export class Pedido {
  constructor(
    public id: number,
    public items: ItemPedido[],
    public estado: 'pendiente' | 'enviado' | 'entregado' = 'pendiente'
  ) {}

  calcularTotal(productos: ProductoConPrecio[]): number {
    let total = 0;
    for(const item of this.items){
        const producto = productos.find(p => p.id === item.productoId);
        if (producto){
            total = total + producto.calcularPrecio() * item.cantidad; 
        }
    }
    return total;
}
}