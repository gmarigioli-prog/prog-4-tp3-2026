import { CarritoProvider } from "./carrito/CarritoContext";
import { CarritoUI } from "./carrito/CarritoUI";
import Menu from "./components/Menu";
import { leerMesa } from "./lib/mesa";
import "./App.css";

function App() {
  const mesa = leerMesa(window.location.search);

  return (
    <CarritoProvider>
      <main>
        <header>
          <h1>{mesa ? `Mesa ${mesa}` : "Retiro en barra"}</h1>
        </header>
        <Menu />
        <CarritoUI mesaId={mesa} />
      </main>
    </CarritoProvider>
  );
}

export default App;
