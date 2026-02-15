import {
  CHECKOUT_CONFIRMATION,
  CHECKOUT_ERRORS,
  EXPECTED_COUNTS,
  PAGE_TITLES,
} from '../../data/messages';
import { PRODUCTS } from '../../data/products';
import { test, expect } from '../../fixtures/ui.fixture';

test.describe('Checkout', () => {
  test('starts checkout from cart', async ({ cartPage }) => {
    const checkoutInformationPage = await cartPage.startCheckout();

    await expect(checkoutInformationPage.title).toHaveText(PAGE_TITLES.checkoutInformation);
    await expect(checkoutInformationPage.firstNameInput).toBeVisible();
  });

  test('requires first name in checkout information form', async ({ checkoutInformationPage }) => {
    await checkoutInformationPage.continueWithCurrentForm();

    await expect(checkoutInformationPage.errorMessage).toContainText(
      CHECKOUT_ERRORS.missingFirstName,
    );
  });

  test('completes checkout successfully', async ({ checkoutOverviewPage }) => {
    await expect(checkoutOverviewPage.orderItemByName(PRODUCTS.backpack.name)).toBeVisible();

    const checkoutCompletePage = await checkoutOverviewPage.finishOrder();

    await expect(checkoutCompletePage.title).toHaveText(PAGE_TITLES.checkoutComplete);
    await expect(checkoutCompletePage.confirmationHeader).toHaveText(CHECKOUT_CONFIRMATION.header);
    await expect(checkoutCompletePage.confirmationMessage).toHaveText(CHECKOUT_CONFIRMATION.body);
  });

  test('returns to inventory from checkout complete page', async ({ checkoutOverviewPage }) => {
    const checkoutCompletePage = await checkoutOverviewPage.finishOrder();

    await checkoutCompletePage.returnToInventory();

    await expect(checkoutCompletePage.title).toHaveText(PAGE_TITLES.inventory);
    await expect(checkoutCompletePage.header.cartBadge).toHaveCount(0);
  });

  test('cancels checkout from overview and returns to inventory', async ({
    checkoutOverviewPage,
  }) => {
    await expect(checkoutOverviewPage.header.cartBadge).toHaveText(String(EXPECTED_COUNTS.oneItem));

    await checkoutOverviewPage.cancelCheckout();

    await expect(checkoutOverviewPage.title).toHaveText(PAGE_TITLES.inventory);
    await expect(checkoutOverviewPage.header.cartBadge).toHaveText(String(EXPECTED_COUNTS.oneItem));
  });
});
