# Dental Clinic Backend

Express + PostgreSQL (Sequelize) API for the dental clinic assessment.

## Scripts

- `npm run dev` — start API with nodemon
- `npm start` — start API
- `npm run migrate` — run pending SQL migrations
- `npm run rollback` — rollback latest migration
- `npm run seed` — seed doctors/appointments (+ ensure admin)

## Docker

```bash
docker compose up -d
```

- Postgres on `localhost:5433`
- pgAdmin on `http://localhost:8080`

## Demo credentials

Admin is auto-created on server start:

- `admin@dental.local` / `Admin123!`

See the root README for full setup and endpoint docs.
