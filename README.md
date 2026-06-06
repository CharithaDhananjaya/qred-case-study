# Qred Case Study

A full-stack company dashboard for Qred's credit card product.

---

## ⚙️ Backend architecture

The backend runs in two modes from the same codebase — no duplication of business logic.

```
🖥️  Local dev
    ts-node-dev
      └── server.ts          loads env, starts Express on :4000
            └── app.ts        mounts middleware + routes
                  └── routes/*.route.ts   handles HTTP, calls services

☁️  AWS
    API Gateway
      └── handler.ts         one export per Lambda function, calls services
```

Both paths share the same service and query layers (coming in feature PRs). Swapping between them is a matter of entry point only — `server.ts` for local, `handler.ts` exports for Lambda.

---

## 📡 API endpoints

| Method | Path | Lambda handler | Description |
|--------|------|----------------|-------------|
| 🟢 `GET` | `/dashboard` | `dashboardHandler` | Company overview — card, credit limit, latest transactions, invoice flag |
| 🟢 `GET` | `/transactions` | `transactionsHandler` | Paginated transaction history (`?page=1&limit=20`) |
| 🟢 `GET` | `/invoice` | `invoiceHandler` | Most recent invoice with embedded card details |
| 🔵 `POST` | `/cards/activate` | `activateCardHandler` | Activate an inactive card (`{ cardId }` in request body) |

All endpoints require a `Bearer` token.

---

## 🔐 Auth

Authentication uses JWT Bearer tokens. The token carries `companyId` in its claims — the backend always reads `companyId` from the verified token, never from URL params or query strings. This prevents insecure direct object reference (IDOR) attacks where a caller could access another company's data by changing an ID in the URL.

`cardId` on the activate endpoint is passed in the POST body rather than the URL path so it is never captured in API Gateway access logs.

---

## 🚀 Local auth setup

**1. Add a JWT secret to your envs**

```bash
cp apps/backend/.env.local.example apps/backend/.env.local
```

Edit `apps/backend/.env.local` and set:

```
JWT_SECRET=<output of: openssl rand -hex 32>
```

Also add the same value to the root `.env` (used by docker-compose) so all services share the same secret:

```bash
cp .env.example .env
```

Edit `.env` and set the same `JWT_SECRET`.

**2. Generate a dev token**

```bash
yarn workspace @qred/backend token:generate
```

The token is scoped to a fixed dev `companyId` (`a0000000-0000-0000-0000-000000000001`) and is valid for 7 days.

**3. Test an endpoint**

```bash
curl http://localhost:4000/dashboard \
  -H "Authorization: Bearer <token from step 2>"
```

Expected response while services are still being implemented: `{ "message": "coming soon" }`

---

## 🧪 Tests

Unit and integration tests run with [Vitest](https://vitest.dev/) and [supertest](https://github.com/ladjs/supertest). No database or running server needed — `JWT_SECRET` is injected via the Vitest config.

```bash
# Run all tests
yarn workspace @qred/backend test

# Watch mode
yarn workspace @qred/backend test:watch

# Unit tests only
yarn workspace @qred/backend test:unit

# Integration tests only
yarn workspace @qred/backend test:integration
```

> Tests for the auth middleware and route-level auth enforcement were written with [Claude](https://claude.ai/code).
