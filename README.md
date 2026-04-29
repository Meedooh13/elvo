# Elvo — F1 Racing Streetwear E-Commerce

## Stack
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Backend:** NestJS + TypeScript + PostgreSQL
- **Cache:** Redis (ioredis)
- **Storage:** Cloudflare R2 (configure in products.service.ts)
- **Payments:** Paymob API (backend-to-backend)

## Quick Start

### 1. Start infrastructure
```bash
docker-compose up postgres redis -d
```

### 2. Backend
```bash
cd elvo-backend
cp .env.example .env        # Fill in your values
npm install
npx prisma migrate dev --name init
npm run start:dev
```

### 3. Frontend
```bash
cd elvo-frontend
cp .env.example .env        # Fill in your values
npm install
npm run dev
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login |
| POST | /api/auth/refresh | Cookie | Refresh token |
| POST | /api/auth/logout | JWT | Logout |
| GET | /api/products | Public | List products |
| GET | /api/products/:slug | Public | Product detail |
| POST | /api/products | ADMIN | Create product |
| POST | /api/orders | JWT | Create order |
| GET | /api/orders | JWT | My orders |
| POST | /api/payments/checkout/:orderId | JWT | Initiate Paymob |
| POST | /api/webhooks/paymob | HMAC | Paymob webhook |

## Environment Variables
See `.env.example` in each package for required variables.
Never commit `.env` files to git.
