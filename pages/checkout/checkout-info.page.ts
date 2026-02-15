import { Locator, Page } from '@playwright/test';

import { CheckoutCustomer } from '../../data/checkout';
import { ROUTES } from '../../data/routes';
import { BasePage } from '../base/base-page.page';
import { HeaderComponent } from '../components/header.component';
import { CheckoutOverviewPage } from './checkout-overview.page';

export class CheckoutInfoPage extends BasePage {
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.header = new HeaderComponent(this.page);
    this.title = this.page.locator('[data-test="title"]');
    this.firstNameInput = this.page.locator('[data-test="firstName"]');
    this.lastNameInput = this.page.locator('[data-test="lastName"]');
    this.postalCodeInput = this.page.locator('[data-test="postalCode"]');
    this.continueButton = this.page.locator('[data-test="continue"]');
    this.cancelButton = this.page.locator('[data-test="cancel"]');
    this.errorMessage = this.page.locator('[data-test="error"]');
  }

  async provideCustomerInformation(customer: CheckoutCustomer): Promise<CheckoutOverviewPage> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
    await this.continueButton.click();
    await this.waitForRoute(ROUTES.checkoutOverview);

    return new CheckoutOverviewPage(this.page);
  }

  async continueWithCurrentForm(): Promise<void> {
    await this.continueButton.click();
  }

  async cancelCheckout(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForRoute(ROUTES.inventory);
  }
}
