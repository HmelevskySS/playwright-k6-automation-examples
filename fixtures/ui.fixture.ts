import { expect, test as base } from '@playwright/test';

import { CHECKOUT_CUSTOMER } from '../data/checkout';
import { PRODUCTS } from '../data/products';
import { USERS } from '../data/users';
import { LoginPage } from '../pages/auth/login.page';
import { CartPage } from '../pages/cart/cart.page';
import { InventoryPage } from '../pages/catalog/inventory.page';
import { CheckoutInfoPage } from '../pages/checkout/checkout-info.page';
import { CheckoutOverviewPage } from '../pages/checkout/checkout-overview.page';

type UiFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInformationPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
};

export const test = base.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await use(loginPage);
  },

  inventoryPage: async ({ loginPage }, use) => {
    const inventoryPage = await loginPage.authenticate(USERS.standard);
    await use(inventoryPage);
  },

  cartPage: async ({ inventoryPage }, use) => {
    await inventoryPage.addProductToCart(PRODUCTS.backpack);
    const cartPage = await inventoryPage.openCart();
    await use(cartPage);
  },

  checkoutInformationPage: async ({ cartPage }, use) => {
    const checkoutInformationPage = await cartPage.startCheckout();
    await use(checkoutInformationPage);
  },

  checkoutOverviewPage: async ({ checkoutInformationPage }, use) => {
    const checkoutOverviewPage =
      await checkoutInformationPage.provideCustomerInformation(CHECKOUT_CUSTOMER);
    await use(checkoutOverviewPage);
  },
});

export { expect };
