import { Locator, Page } from '@playwright/test';

import { Product } from '../../data/products';
import { ROUTES } from '../../data/routes';
import { BasePage } from '../base/base-page.page';
import { CheckoutInfoPage } from '../checkout/checkout-info.page';
import { HeaderComponent } from '../components/header.component';

export class CartPage extends BasePage {
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);

    this.header = new HeaderComponent(this.page);
    this.title = this.page.locator('[data-test="title"]');
    this.checkoutButton = this.page.locator('[data-test="checkout"]');
    this.continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');
    this.cartItems = this.page.locator('[data-test="inventory-item"]');
  }

  cartItemByName(productName: string): Locator {
    return this.page.locator('[data-test="inventory-item-name"]', { hasText: productName });
  }

  async removeProduct(product: Product): Promise<void> {
    await this.page.locator(`[data-test="remove-${product.testIdSuffix}"]`).click();
  }

  async startCheckout(): Promise<CheckoutInfoPage> {
    await this.checkoutButton.click();
    await this.waitForRoute(ROUTES.checkoutInformation);

    return new CheckoutInfoPage(this.page);
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.waitForRoute(ROUTES.inventory);
  }
}
