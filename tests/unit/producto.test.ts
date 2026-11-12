import { describe, it, expect } from "vitest";
import { Expreso, Filtrado, Pasteleria } from "../../src/models/Producto";

describe('calcularPrecio()', () => {
   it('suma el precio base y los adicionales de tamaño y origen', () => {
    const producto = new Expreso(1, 'Pocillo', 'Brasil');
    const precio = producto.calcularPrecio()
    expect(precio).toBe(2500)
});
    it('Expreso Taza Grande Etiopia', () =>{
        const producto = new Expreso(9, 'Taza grande', 'Etiopia')
        const precio = producto.calcularPrecio()
        expect(precio).toBe(4900)
})
    it('Filtrado Mediano Colombia', () => {
        const producto = new Filtrado(14, 'Mediano', 'Colombia')
        const precio = producto.calcularPrecio()
        expect(precio).toBe(4400)
})
    it('cada opción agrega su valor al precio de la bebida', () => {
        const expresoChico = new Expreso(1, 'Pocillo', 'Brasil');
        const expresoMediano = new Expreso(2, 'Mediano', 'Brasil');
        const expresoColombia = new Expreso(3, 'Pocillo', 'Colombia');
        const filtradoChico = new Filtrado(4, 'Pocillo', 'Brasil');

        expect(expresoMediano.calcularPrecio() - expresoChico.calcularPrecio()).toBe(700);
        expect(expresoColombia.calcularPrecio() - expresoChico.calcularPrecio()).toBe(500);
        expect(filtradoChico.calcularPrecio() - expresoChico.calcularPrecio()).toBe(700);
})
    it('Muffin de chocolate cuesta 2500', () => {
        const producto = new Pasteleria(19, 'Muffin de chocolate', 2500)
        const precio = producto.calcularPrecio()
        expect(precio).toBe(2500)
})

});
