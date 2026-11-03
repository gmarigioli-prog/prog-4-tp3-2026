import { describe, it, expect } from "vitest";
import { Expreso, Filtrado, Pasteleria } from "../../src/models/Producto";

describe('calcularPrecio()', () => {
   it('Expreso Pocillo Brasil cuesta 5020', () => {
    const producto = new Expreso(1, 'Pocillo', 'Brasil');
    const precio = producto.calcularPrecio()
    expect(precio).toBe(5020)
});
    it('Expreso Taza Grande Etiopia', () =>{
        const producto = new Expreso(9, 'Taza grande', 'Etiopia')
        const precio = producto.calcularPrecio()
        expect(precio).toBe(11140)
})
    it('Filtrado Mediano Colombia', () => {
        const producto = new Filtrado(14, 'Mediano', 'Colombia')
        const precio = producto.calcularPrecio()
        expect(precio).toBe(5900)
})
    it('Muffin de chocolate cuesta 2500', () => {
        const producto = new Pasteleria(19, 'Muffin de chocolate', 2500)
        const precio = producto.calcularPrecio()
        expect(precio).toBe(2500)
})

});
