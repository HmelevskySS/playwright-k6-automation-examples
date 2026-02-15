import { Page } from '@playwright/test';

export abstract class BasePage {
  // Saucedemo has no shared pre-login shell and a simple post-login shell,
  // so the base page stays intentionally minimal.
  protected constructor(protected readonly page: Page) {}

  protected async waitForRoute(path: string): Promise<void> {
    await this.page.waitForURL(`**${path}`);
  }
}
