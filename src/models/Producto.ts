export class Expreso {
  constructor(
    public id: number,
    public tamanio: string,
    public variedad: string
  ) {}
  get nombre(): string {
  return `Expreso ${this.tamanio} ${this.variedad}`;
}

  calcularPrecio(): number {
    const GramosPorTamanio = {Pocillo: 18, Mediano: 27, 'Taza grande': 36};
    const precioPorGramo = {Brasil: 140, Colombia: 180, Etiopia: 240};
    const gramos = GramosPorTamanio[this.tamanio];
    const precioGramo = precioPorGramo[this.variedad];
    return  2500 + gramos * precioGramo;
  }
}
export class Filtrado{
    constructor(
        public id: number,
        public tamanio: string,
        public variedad: string,
    ){}
    get nombre(): string {
    return `Filtrado ${this.tamanio} ${this.variedad}`;
}

    calcularPrecio(): number {
    const GramosPorTamanio = {Pocillo: 6, Mediano: 15, 'Taza grande': 25};
    const precioPorGramo = {Brasil: 140, Colombia: 180, Etiopia: 240};
    const gramos = GramosPorTamanio[this.tamanio];
    const precioGramo = precioPorGramo[this.variedad];
    return  3200 + gramos * precioGramo;
  }
}
export class Pasteleria{
    constructor(
        public id: number,
        public nombre: string,
        public precioBase: number,
    ){}
    calcularPrecio(): number{
        return this.precioBase;
    }
}
