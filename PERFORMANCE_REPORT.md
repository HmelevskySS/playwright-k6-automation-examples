# Performance Report - ReqRes Users API

## 1. Test Setup and Assumptions

- Tool: k6
- Script: `api/performance/reqres-users.k6.js`
- Endpoint: `https://reqres.in/api/users?page=1`
- Date executed: February 14, 2026
- Load profile: 100 concurrent virtual users, each loop sends 1 GET request then `sleep(1)`
- Duration: 3 minutes
- Execution command:

```bash
DURATION=3m k6 run --summary-export=reports/k6-summary.json api/performance/reqres-users.k6.js
```

- ReqRes currently requires a valid `x-api-key` (`REQRES_API_KEY`) for success-path responses.

## 2. Load Model Explanation

- Concurrency model: fixed 100 VUs to emulate 100 active users.
- Per-user pacing: one request per iteration + 1 second sleep.
- This model prioritizes user-concurrency realism over exact fixed RPS.

## 3. Duration Justification

- 3 minutes is long enough to:
  - accumulate a statistically meaningful request count
  - smooth startup variance
  - observe percentile stability (P95/P99)
- Observed volume: 17,600 total requests.

## 4. Captured Metrics

Source: `reports/k6-summary.json`

- P50 latency: **19.49 ms**
- P95 latency: **32.33 ms**
- P99 latency: **41.52 ms**
- Error rate (`http_req_failed`): **100.00%**
- Throughput (`http_reqs`): **97.64 req/s**
- Total requests: **17,600**

## 5. Interpretation

- Transport/network response times are low and stable (sub-50ms at P99).
- Functional success is 0% because endpoint access is denied without a valid API key.
- Throughput is near expected 100 req/s; the delta comes from request latency + iteration pacing overhead.

## 6. Bottleneck Discussion

Primary bottleneck is not compute capacity; it is an access/authentication gate at the API boundary:

- Missing/invalid API key causes every request to fail.
- In this state, latency metrics represent failure-path performance, not business-success path.

## 7. Optimization Suggestions

- Provide a valid `REQRES_API_KEY` in CI and local runs.
- Split scenarios into:
  - authenticated success-path load
  - unauthorized/error-path resilience load
- Enable strict thresholds (`ENFORCE_THRESHOLDS=true`) once success-path auth is configured.
- Add response status tagging (2xx/4xx/5xx) for clearer dashboard segmentation.

## 8. Engineering Trade-offs

- `constant-vus` + `sleep(1)` chosen to model user concurrency directly.
- `constant-arrival-rate` would provide tighter RPS control but weaker direct user-concurrency mapping.
- Threshold enforcement is configurable:
  - disabled by default for observability in unknown environments
  - enabled for release gating in controlled environments with valid credentials
