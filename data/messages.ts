export const PAGE_TITLES = {
  inventory: 'Products',
  cart: 'Your Cart',
  checkoutInformation: 'Checkout: Your Information',
  checkoutOverview: 'Checkout: Overview',
  checkoutComplete: 'Checkout: Complete!',
} as const;

export const LOGIN_ERRORS = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  missingUsername: 'Epic sadface: Username is required',
  missingPassword: 'Epic sadface: Password is required',
} as const;

export const CHECKOUT_ERRORS = {
  missingFirstName: 'Error: First Name is required',
} as const;

export const CHECKOUT_CONFIRMATION = {
  header: 'Thank you for your order!',
  body: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
} as const;

export const EXPECTED_COUNTS = {
  oneItem: 1,
  twoItems: 2,
} as const;
