import { PAGE_TITLES, EXPECTED_COUNTS } from '../../data/messages';
import { EXPECTED_PRODUCT_COUNT, PRODUCTS } from '../../data/products';
import { test, expect } from '../../fixtures/ui.fixture';

test.describe('Cart', () => {
  test('adds one product to cart from inventory', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(PRODUCTS.backpack);

    await expect(inventoryPage.header.cartBadge).toHaveText(String(EXPECTED_COUNTS.oneItem));

    const cartPage = await inventoryPage.openCart();

    await expect(cartPage.title).toHaveText(PAGE_TITLES.cart);
    await expect(cartPage.cartItemByName(PRODUCTS.backpack.name)).toBeVisible();
  });

  test('keeps both products in cart when multiple items are added', async ({ inventoryPage }) => {
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    await inventoryPage.addProductToCart(PRODUCTS.bikeLight);

    await expect(inventoryPage.header.cartBadge).toHaveText(String(EXPECTED_COUNTS.twoItems));

    const cartPage = await inventoryPage.openCart();

    await expect(cartPage.cartItems).toHaveCount(EXPECTED_COUNTS.twoItems);
    await expect(cartPage.cartItemByName(PRODUCTS.backpack.name)).toBeVisible();
    await expect(cartPage.cartItemByName(PRODUCTS.bikeLight.name)).toBeVisible();
  });

  test('removes an item from cart', async ({ cartPage }) => {
    await cartPage.removeProduct(PRODUCTS.backpack);

    await expect(cartPage.cartItemByName(PRODUCTS.backpack.name)).toHaveCount(0);
    await expect(cartPage.header.cartBadge).toHaveCount(0);
  });

  test('returns to product catalog from cart', async ({ cartPage }) => {
    await cartPage.continueShopping();

    await expect(cartPage.title).toHaveText(PAGE_TITLES.inventory);
    await expect(cartPage.cartItems).toHaveCount(EXPECTED_PRODUCT_COUNT);
  });
});
