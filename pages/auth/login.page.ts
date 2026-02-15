import { Locator, Page } from '@playwright/test';

import { ROUTES } from '../../data/routes';
import { Credentials } from '../../data/users';
import { BasePage } from '../base/base-page.page';
import { InventoryPage } from '../catalog/inventory.page';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly dismissErrorButton: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = this.page.locator('[data-test="username"]');
    this.passwordInput = this.page.locator('[data-test="password"]');
    this.loginButton = this.page.locator('[data-test="login-button"]');
    this.errorMessage = this.page.locator('[data-test="error"]');
    this.dismissErrorButton = this.page.locator('[data-test="error-button"]');
  }

  async open(): Promise<void> {
    await this.page.goto(ROUTES.login);
    await this.waitForRoute(ROUTES.login);
  }

  async submitCredentials(credentials: Credentials): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
  }

  async authenticate(credentials: Credentials): Promise<InventoryPage> {
    await this.submitCredentials(credentials);
    await this.waitForRoute(ROUTES.inventory);

    return new InventoryPage(this.page);
  }

  async dismissError(): Promise<void> {
    await this.dismissErrorButton.click();
  }
}
