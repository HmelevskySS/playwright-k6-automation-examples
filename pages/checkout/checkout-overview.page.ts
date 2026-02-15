import { Locator, Page } from '@playwright/test';

import { ROUTES } from '../../data/routes';
import { BasePage } from '../base/base-page.page';
import { HeaderComponent } from '../components/header.component';
import { CheckoutCompletePage } from './checkout-complete.page';

export class CheckoutOverviewPage extends BasePage {
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly totalLabel: Locator;

  constructor(page: Page) {
    super(page);

    this.header = new HeaderComponent(this.page);
    this.title = this.page.locator('[data-test="title"]');
    this.finishButton = this.page.locator('[data-test="finish"]');
    this.cancelButton = this.page.locator('[data-test="cancel"]');
    this.totalLabel = this.page.locator('[data-test="total-label"]');
  }

  orderItemByName(productName: string): Locator {
    return this.page.locator('[data-test="inventory-item-name"]', { hasText: productName });
  }

  async finishOrder(): Promise<CheckoutCompletePage> {
    await this.finishButton.click();
    await this.waitForRoute(ROUTES.checkoutComplete);

    return new CheckoutCompletePage(this.page);
  }

  async cancelCheckout(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForRoute(ROUTES.inventory);
  }
}
