export const preciosCafe = {
  tipo: { Expreso: 2500, Filtrado: 3200 },
  adicionalTamanio: { Pocillo: 0, Mediano: 700, Grande: 1400 },
  adicionalOrigen: { Brasil: 0, Colombia: 500, Etiopia: 1000 },
} as const;

export const preciosPasteleria = {
  "Muffin de chocolate": 2500,
  "Torta selva negra": 7000,
} as const;

type TamanioCafe = keyof typeof preciosCafe.adicionalTamanio;
type OrigenCafe = keyof typeof preciosCafe.adicionalOrigen;

function calcularPrecioCafe(
  tipo: keyof typeof preciosCafe.tipo,
  tamanio: TamanioCafe,
  origen: OrigenCafe,
): number {
  return (
    preciosCafe.tipo[tipo] +
    preciosCafe.adicionalTamanio[tamanio] +
    preciosCafe.adicionalOrigen[origen]
  );
}

export class Expreso {
  constructor(
    public id: number,
    public tamanio: TamanioCafe,
    public variedad: OrigenCafe
  ) {}
  get nombre(): string {
  return `Expreso ${this.tamanio} ${this.variedad}`;
}

  calcularPrecio(): number {
    return calcularPrecioCafe("Expreso", this.tamanio, this.variedad);
  }
}
export class Filtrado{
    constructor(
        public id: number,
        public tamanio: TamanioCafe,
        public variedad: OrigenCafe,
    ){}
    get nombre(): string {
    return `Filtrado ${this.tamanio} ${this.variedad}`;
}

    calcularPrecio(): number {
    return calcularPrecioCafe("Filtrado", this.tamanio, this.variedad);
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
