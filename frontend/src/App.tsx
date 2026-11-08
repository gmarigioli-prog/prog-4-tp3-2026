import Menu from "./components/Menu";
import { leerMesa } from "./lib/mesa";
import "./App.css";

function App() {
  const mesa = leerMesa(window.location.search);

  return (
    <main>
      <header>
        <h1>{mesa ? `Mesa ${mesa}` : "Retiro en barra"}</h1>
      </header>
      <Menu />
    </main>
  );
}

export default App;
