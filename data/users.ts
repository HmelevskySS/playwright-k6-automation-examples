export interface Credentials {
  username: string;
  password: string;
}

const sharedPassword = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const USERS = {
  standard: {
    username: process.env.STANDARD_USER ?? 'standard_user',
    password: sharedPassword,
  },
  lockedOut: {
    username: process.env.LOCKED_OUT_USER ?? 'locked_out_user',
    password: sharedPassword,
  },
} as const satisfies Record<string, Credentials>;

export const EMPTY_CREDENTIALS: Credentials = {
  username: '',
  password: '',
};
