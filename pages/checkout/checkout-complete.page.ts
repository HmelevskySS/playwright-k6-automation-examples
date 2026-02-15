import { Locator, Page } from '@playwright/test';

import { ROUTES } from '../../data/routes';
import { BasePage } from '../base/base-page.page';
import { HeaderComponent } from '../components/header.component';

export class CheckoutCompletePage extends BasePage {
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly confirmationHeader: Locator;
  readonly confirmationMessage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);

    this.header = new HeaderComponent(this.page);
    this.title = this.page.locator('[data-test="title"]');
    this.confirmationHeader = this.page.locator('[data-test="complete-header"]');
    this.confirmationMessage = this.page.locator('[data-test="complete-text"]');
    this.backHomeButton = this.page.locator('[data-test="back-to-products"]');
  }

  async returnToInventory(): Promise<void> {
    await this.backHomeButton.click();
    await this.waitForRoute(ROUTES.inventory);
  }
}
