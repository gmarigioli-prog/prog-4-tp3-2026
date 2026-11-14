import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Menu from "./Menu";
import { server } from "../test/msw";
import { CarritoProvider } from "../carrito/CarritoContext";
import App from "../App";

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
    const user = userEvent.setup();
    renderMenu();

    expect(
      await screen.findByText("Expreso Mediano Colombia"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Muffin de chocolate")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Pastelería" }));
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

  it("envía el pedido completo a la API y muestra la confirmación", async () => {
  const user = userEvent.setup();
  let cuerpoRecibido: unknown;

  server.use(
    http.post("/pedidos", async ({ request }) => {
      cuerpoRecibido = await request.json();

      return HttpResponse.json(
        {
          id: 21,
          items: [
            { productoId: 1, cantidad: 2 },
            { productoId: 19, cantidad: 1 },
          ],
          estado: "pendiente",
          mesaId: 4,
          total: 17220,
        },
        { status: 201 },
      );
    }),
  );

  const urlAnterior =
    window.location.pathname + window.location.search + window.location.hash;

  window.history.replaceState({}, "", "/?mesa=4");
  render(<App />);
  window.history.replaceState({}, "", urlAnterior || "/");

  expect(
    screen.getByRole("heading", { name: "Mesa 4" }),
  ).toBeInTheDocument();

  await user.selectOptions(
    await screen.findByLabelText("Tipo de bebida"),
    "Expreso",
  );
  await user.selectOptions(screen.getByLabelText("Tamaño"), "Mediano");
  await user.selectOptions(
    screen.getByLabelText("País de origen"),
    "Colombia",
  );

  await user.click(
    screen.getByRole("button", { name: "Agregar café al carrito" }),
  );
  await user.click(
    screen.getByRole("button", { name: "Agregar café al carrito" }),
  );

  await user.click(screen.getByRole("button", { name: "Pastelería" }));
  await user.click(
    screen.getByRole("button", { name: "Agregar al carrito" }),
  );
  await user.click(
    screen.getByRole("button", { name: "Confirmar pedido" }),
  );

  expect(cuerpoRecibido).toEqual({
    mesaId: 4,
    items: [
      { productoId: 1, cantidad: 2 },
      { productoId: 19, cantidad: 1 },
    ],
  });

  expect(await screen.findByText("Pedido #21")).toBeInTheDocument();
  expect(screen.getByText("Estado: pendiente")).toBeInTheDocument();

  const totalFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(17220);

  expect(
    screen.getByText(
      (texto) =>
        texto.replace(/\s/g, " ") ===
        `Total: ${totalFormateado}`.replace(/\s/g, " "),
    ),
  ).toBeInTheDocument();
});

  it(
    "actualiza el estado consultando GET /pedidos/:id sin recargar",
    async () => {
      const user = userEvent.setup();
      let consultas = 0;

      const pedido = {
        id: 21,
        items: [{ productoId: 1, cantidad: 1 }],
        estado: "pendiente",
        mesaId: 4,
        total: 7360,
      };

      server.use(
        http.post("/pedidos", () =>
          HttpResponse.json(pedido, { status: 201 }),
        ),
        http.get("/pedidos/21", () => {
          consultas += 1;

          return HttpResponse.json({
            ...pedido,
            estado: consultas === 1 ? "pendiente" : "entregado",
          });
        }),
      );

      const urlAnterior =
        window.location.pathname +
        window.location.search +
        window.location.hash;

      window.history.replaceState({}, "", "/?mesa=4");
      render(<App />);
      window.history.replaceState({}, "", urlAnterior || "/");

      await user.selectOptions(
        await screen.findByLabelText("Tipo de bebida"),
        "Expreso",
      );
      await user.selectOptions(screen.getByLabelText("Tamaño"), "Mediano");
      await user.selectOptions(
        screen.getByLabelText("País de origen"),
        "Colombia",
      );
      await user.click(
        screen.getByRole("button", { name: "Agregar café al carrito" }),
      );
      await user.click(
        screen.getByRole("button", { name: "Confirmar pedido" }),
      );

      expect(await screen.findByText("Pedido #21")).toBeInTheDocument();
      expect(await screen.findByText("Estado: pendiente")).toBeInTheDocument();
      expect(
        await screen.findByText(
          "Estado: entregado",
          {},
          { timeout: 8000 },
        ),
      ).toBeInTheDocument();
      expect(consultas).toBeGreaterThanOrEqual(2);
    },
    10000,
  );
});
