import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Menu from "./Menu";
import { server } from "../test/msw";
import { CarritoProvider } from "../carrito/CarritoContext";

const productos = [
  { id: 1, nombre: "Expreso Mediano Colombia", precio: 7360 },
  { id: 19, nombre: "Muffin de chocolate", precio: 2500 },
];

function responderProductos() {
  return HttpResponse.json(productos);
}

function renderMenu() {
  return render(
    <CarritoProvider>
      <Menu />
    </CarritoProvider>,
  );
}

describe("Menu con API", () => {
  beforeEach(() => {
    server.use(http.get("/productos", responderProductos));
  });

  it("muestra los productos de una respuesta 200 valida", async () => {
    renderMenu();

    expect(
      await screen.findByText("Expreso Mediano Colombia"),
    ).toBeInTheDocument();
    expect(screen.getByText("Muffin de chocolate")).toBeInTheDocument();
  });

  it("permite reintentar despues de un error 500", async () => {
    const user = userEvent.setup();
    server.use(
      http.get("/productos", () => new HttpResponse(null, { status: 500 })),
    );
    renderMenu();

    expect(
      await screen.findByText("No se pudo cargar el menú"),
    ).toBeInTheDocument();

    server.use(http.get("/productos", responderProductos));
    await user.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(
      await screen.findByText("Expreso Mediano Colombia"),
    ).toBeInTheDocument();
  });

  it("muestra un error cuando la red se cae", async () => {
    server.use(http.get("/productos", () => HttpResponse.error()));
    renderMenu();

    expect(await screen.findByText(/failed to fetch/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reintentar" }),
    ).toBeInTheDocument();
  });

  it("muestra un error si el JSON no cumple el contrato", async () => {
    server.use(
      http.get("/productos", () =>
        HttpResponse.json([{ id: 1, nombre: "Sin precio" }]),
      ),
    );
    renderMenu();

    expect(
      await screen.findByText(
        "La respuesta de productos no cumple el contrato",
      ),
    ).toBeInTheDocument();
  });

  it("muestra un error ante una respuesta 400", async () => {
    server.use(
      http.get("/productos", () => new HttpResponse(null, { status: 400 })),
    );
    renderMenu();

    expect(
      await screen.findByText("No se pudo cargar el menú"),
    ).toBeInTheDocument();
  });
});
