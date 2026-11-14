# Web Cafetería Origen

Aplicación web con API Express y frontend React/Vite. La API escucha en `http://localhost:3000` y el frontend la consume mediante el proxy de Vite.

## Instalacion

Desde la raiz, instala las dependencias de ambos paquetes:

```sh
npm install
cd frontend
npm install
cd ..
```

## Levantar la API y el frontend

Abre dos terminales desde la raiz del repositorio:

```sh
# Terminal 1: API en http://localhost:3000
npm run dev
```

```sh
# Terminal 2: frontend en http://localhost:5173
cd frontend
npm run dev
```

## Tests

Desde la raiz:

```sh
# Todos los tests de backend (unitarios e integracion)
npm test

# Backend unitario
npm test -- tests/unit

# Backend de integracion HTTP
npm test -- tests/integration

# E2E Playwright (levanta API y frontend)
npm run test:e2e
```

Para los tests del frontend:

```sh
cd frontend
npm test
```

La primera vez, si Playwright no tiene Chromium, realice la instalación con `npx playwright install chromium`.

## Contrato de API consumido por el frontend

El frontend hace las solicitudes al mismo origen; Vite redirige `/productos` y `/pedidos` a la API durante el desarrollo.

### `GET /productos`

Responde `200` con un arreglo. El frontend requiere `id`, `nombre` y `precio`; la API tambien incluye `tipo`.

```json
[
  {
    "id": 1,
    "nombre": "Expreso Pocillo Brasil",
    "precio": 2500,
    "tipo": "Expreso"
  }
]
```

### `POST /pedidos`

Recibe JSON con al menos un item. `mesaId` es opcional; los identificadores y cantidades deben ser enteros positivos.

```json
{
  "items": [{ "productoId": 1, "cantidad": 2 }],
  "mesaId": 5
}
```

Responde `201` con el pedido creado:

```json
{
  "id": 1,
  "items": [{ "productoId": 1, "cantidad": 2 }],
  "estado": "pendiente",
  "mesaId": 5,
  "total": 5000
}
```

El pedido incluye `estado` (`pendiente`, `enviado` o `entregado`); `mesaId` puede omitirse. Los errores responden con `{ "error": "..." }`; los de validacion tambien pueden incluir `details`.

### `GET /pedidos/:id`

Responde `200` con el mismo formato de pedido. Si no existe, responde `404` con `{ "error": "Pedido no encontrado" }`.
