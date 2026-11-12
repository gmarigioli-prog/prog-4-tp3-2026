import { Expreso, Filtrado, Pasteleria } from "../src/models/Producto";

export const productos = [
  new Expreso(1, "Pocillo", "Brasil"),
  new Expreso(2, "Pocillo", "Colombia"),
  new Expreso(3, "Pocillo", "Etiopia"),

  new Expreso(4, "Mediano", "Brasil"),
  new Expreso(5, "Mediano", "Colombia"),
  new Expreso(6, "Mediano", "Etiopia"),

  new Expreso(7, "Grande", "Brasil"),
  new Expreso(8, "Grande", "Colombia"),
  new Expreso(9, "Grande", "Etiopia"),

  new Filtrado(10, "Pocillo", "Brasil"),
  new Filtrado(11, "Pocillo", "Colombia"),
  new Filtrado(12, "Pocillo", "Etiopia"),

  new Filtrado(13, "Mediano", "Brasil"),
  new Filtrado(14, "Mediano", "Colombia"),
  new Filtrado(15, "Mediano", "Etiopia"),

  new Filtrado(16, "Grande", "Brasil"),
  new Filtrado(17, "Grande", "Colombia"),
  new Filtrado(18, "Grande", "Etiopia"),

  new Pasteleria(19, "Muffin de chocolate", 2500),
  new Pasteleria(20, "Torta selva negra", 4200),
];