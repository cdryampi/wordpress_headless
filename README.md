# Headless WordPress + Supabase + Astro

A dockerized monorepo with a single edge Nginx routing Astro and WordPress, while Supabase runs independently.

## Quick start

1) Copy environment variables:

```bash
cp .env.example .env
```

2) Build and run:

```bash
docker compose up --build
```

## URLs

- Site: http://localhost:8080
- Guides: http://localhost:8080/guides
- WordPress admin: http://localhost:8080/wp-admin
- WPGraphQL: http://localhost:8080/graphql
- Supabase Kong API: http://localhost:54321
- Supabase Studio: http://localhost:54323
- Astro dev server (direct): http://localhost:4321

## Reset volumes

```bash
docker compose down -v
```

If you want to remove persisted data manually:

```bash
rm -rf volumes/db_wp volumes/supabase_db
```

## GraphQL verification

```bash
curl -s http://localhost:8080/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ posts(first:2){ nodes{ title slug featuredImage{ node{ sourceUrl } } } } }"}'
```

## Notes

- WordPress uses MariaDB only. Supabase uses its own Postgres.
- Supabase is not routed through the edge by default.
