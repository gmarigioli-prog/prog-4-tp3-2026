import { expect, test } from '@playwright/test';

test('completes a customer order from the menu', async ({ page }) => {
  await page.goto('/?mesa=7');

  await expect(page.getByRole('heading', { name: 'Mesa 7' })).toBeVisible();
  await page.getByLabel('Tipo de bebida').selectOption('Expreso');
  await page.getByLabel('Tamaño').selectOption('Pocillo');
  await page.getByLabel('País de origen').selectOption('Brasil');
  await page.getByRole('button', { name: 'Agregar café al carrito' }).click();

  await page.getByRole('button', { name: 'Pastelería' }).click();
  const pasteleria = page.getByRole('list', {
    name: 'Productos de pastelería'
  });
  await pasteleria
    .getByRole('button', { name: 'Agregar al carrito' })
    .first()
    .click();

  const respuestaPedido = page.waitForResponse((response) =>
    response.request().method() === 'POST' &&
    new URL(response.url()).pathname === '/pedidos'
  );
  await page.getByRole('button', { name: 'Confirmar pedido' }).click();

  const response = await respuestaPedido;
  expect(response.status()).toBe(201);
  const pedido: unknown = await response.json();
  expect(pedido).toMatchObject({
    items: [
      { productoId: 1, cantidad: 1 },
      { productoId: 19, cantidad: 1 }
    ],
    estado: 'pendiente',
    mesaId: 7,
    total: 5000
  });

  await expect(page.getByText(/^Pedido #\d+$/)).toBeVisible();
  await expect(page.getByText('Estado: pendiente')).toBeVisible();
});
