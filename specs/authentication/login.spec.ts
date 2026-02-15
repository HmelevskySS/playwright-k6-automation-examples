import { EMPTY_CREDENTIALS, USERS } from '../../data/users';
import { EXPECTED_PRODUCT_COUNT } from '../../data/products';
import { LOGIN_ERRORS, PAGE_TITLES } from '../../data/messages';
import { test, expect } from '../../fixtures/ui.fixture';

test.describe('Authentication', () => {
  test('allows a standard user to log in successfully', async ({ loginPage }) => {
    const inventoryPage = await test.step('Sign in with valid credentials', async () => {
      return loginPage.authenticate(USERS.standard);
    });

    await test.step('Display the product catalog', async () => {
      await expect(inventoryPage.title).toHaveText(PAGE_TITLES.inventory);
      await expect(inventoryPage.inventoryItems).toHaveCount(EXPECTED_PRODUCT_COUNT);
    });
  });

  test('blocks login for a locked out user', async ({ loginPage }) => {
    await loginPage.submitCredentials(USERS.lockedOut);

    await expect(loginPage.errorMessage).toContainText(LOGIN_ERRORS.lockedOut);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('requires username when login form is submitted empty', async ({ loginPage }) => {
    await loginPage.submitCredentials(EMPTY_CREDENTIALS);

    await expect(loginPage.errorMessage).toContainText(LOGIN_ERRORS.missingUsername);
  });

  test('requires password when username is provided', async ({ loginPage }) => {
    await loginPage.submitCredentials({
      username: USERS.standard.username,
      password: EMPTY_CREDENTIALS.password,
    });

    await expect(loginPage.errorMessage).toContainText(LOGIN_ERRORS.missingPassword);
  });
});
