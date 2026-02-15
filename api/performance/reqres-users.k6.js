import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate } from 'k6/metrics';

const vus = Number(__ENV.VUS ?? __ENV.K6_VUS ?? '100');
const duration = __ENV.DURATION ?? __ENV.K6_DURATION ?? '3m';
const baseUrl = __ENV.API_BASE_URL ?? __ENV.K6_API_BASE_URL ?? 'https://reqres.in';
const requestIntervalSeconds = Number(__ENV.REQUEST_INTERVAL_SECONDS ?? '1');
const requestTimeout = __ENV.REQUEST_TIMEOUT ?? '10s';
const reqresApiKey = __ENV.REQRES_API_KEY ?? '';
const enforceThresholds = (__ENV.ENFORCE_THRESHOLDS ?? 'false').toLowerCase() === 'true';

const usersEndpoint = `${baseUrl}/api/users?page=1`;

export const errors = new Rate('errors');
export const successfulRequests = new Counter('successful_requests');

export const options = {
  vus,
  duration,
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(50)', 'p(95)', 'p(99)', 'count'],
  thresholds: enforceThresholds
    ? {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<800', 'p(99)<1200'],
        errors: ['rate<0.01'],
      }
    : undefined,
  tags: {
    scenario: 'reqres-users-page-1',
  },
};

export default function () {
  const headers = {
    Accept: 'application/json',
  };

  if (reqresApiKey) {
    headers['x-api-key'] = reqresApiKey;
  }

  const response = http.get(usersEndpoint, {
    headers,
    tags: {
      endpoint: '/api/users?page=1',
      method: 'GET',
    },
    timeout: requestTimeout,
  });

  const isSuccessfulResponse = check(response, {
    'status is 200': (res) => res.status === 200,
    'body has data list': (res) => Array.isArray(res.json('data')),
    'response time under timeout': (res) => res.timings.duration < 10_000,
  });

  errors.add(!isSuccessfulResponse);

  if (isSuccessfulResponse) {
    successfulRequests.add(1);
  }

  sleep(requestIntervalSeconds);
}
