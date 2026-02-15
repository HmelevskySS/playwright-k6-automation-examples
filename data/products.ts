export const PRODUCTS = {
  backpack: {
    name: 'Sauce Labs Backpack',
    testIdSuffix: 'sauce-labs-backpack',
  },
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    testIdSuffix: 'sauce-labs-bike-light',
  },
  boltTShirt: {
    name: 'Sauce Labs Bolt T-Shirt',
    testIdSuffix: 'sauce-labs-bolt-t-shirt',
  },
  fleeceJacket: {
    name: 'Sauce Labs Fleece Jacket',
    testIdSuffix: 'sauce-labs-fleece-jacket',
  },
  onesie: {
    name: 'Sauce Labs Onesie',
    testIdSuffix: 'sauce-labs-onesie',
  },
  redTShirt: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    testIdSuffix: 'test.allthethings()-t-shirt-(red)',
  },
} as const;

export type Product = (typeof PRODUCTS)[keyof typeof PRODUCTS];

export const EXPECTED_PRODUCT_COUNT = Object.keys(PRODUCTS).length;
