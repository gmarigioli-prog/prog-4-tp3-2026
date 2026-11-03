import { Expreso, Filtrado, Pasteleria } from "../src/models/Producto";

export const productos = [
  new Expreso(1, "Pocillo", "Brasil"),
  new Expreso(2, "Pocillo", "Colombia"),
  new Expreso(3, "Pocillo", "Etiopia"),

  new Expreso(4, "Mediano", "Brasil"),
  new Expreso(5, "Mediano", "Colombia"),
  new Expreso(6, "Mediano", "Etiopia"),

  new Expreso(7, "Taza grande", "Brasil"),
  new Expreso(8, "Taza grande", "Colombia"),
  new Expreso(9, "Taza grande", "Etiopia"),

  new Filtrado(10, "Pocillo", "Brasil"),
  new Filtrado(11, "Pocillo", "Colombia"),
  new Filtrado(12, "Pocillo", "Etiopia"),

  new Filtrado(13, "Mediano", "Brasil"),
  new Filtrado(14, "Mediano", "Colombia"),
  new Filtrado(15, "Mediano", "Etiopia"),

  new Filtrado(16, "Taza grande", "Brasil"),
  new Filtrado(17, "Taza grande", "Colombia"),
  new Filtrado(18, "Taza grande", "Etiopia"),

  new Pasteleria(19, "Muffin de chocolate", 2500),
  new Pasteleria(20, "Torta selva negra", 4200),
];