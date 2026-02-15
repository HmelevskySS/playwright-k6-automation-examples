import { Locator, Page } from '@playwright/test';

import { Product } from '../../data/products';
import { ROUTES } from '../../data/routes';
import { BasePage } from '../base/base-page.page';
import { CartPage } from '../cart/cart.page';
import { HeaderComponent } from '../components/header.component';

export class InventoryPage extends BasePage {
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);

    this.header = new HeaderComponent(this.page);
    this.title = this.page.locator('[data-test="title"]');
    this.inventoryList = this.page.locator('[data-test="inventory-list"]');
    this.inventoryItems = this.page.locator('[data-test="inventory-item"]');
    this.sortDropdown = this.page.locator('[data-test="product-sort-container"]');
  }

  itemName(name: string): Locator {
    return this.page.locator('[data-test="inventory-item-name"]', { hasText: name });
  }

  async addProductToCart(product: Product): Promise<void> {
    await this.page.locator(`[data-test="add-to-cart-${product.testIdSuffix}"]`).click();
  }

  async removeProductFromCart(product: Product): Promise<void> {
    await this.page.locator(`[data-test="remove-${product.testIdSuffix}"]`).click();
  }

  async openCart(): Promise<CartPage> {
    await this.header.openCart();
    await this.waitForRoute(ROUTES.cart);

    return new CartPage(this.page);
  }
}
