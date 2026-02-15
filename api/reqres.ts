export const REQRES = {
  baseUrl: process.env.K6_API_BASE_URL ?? 'https://reqres.in',
  usersPath: '/api/users?page=1',
} as const;
