# Stack Cheat Sheet

Guia ultra rapida del stack y como encenderlo.

## TL;DR

```bash
cp .env.example .env
docker compose up --build
```

## URLs

- App (edge): http://localhost:8080
- WordPress admin: http://localhost:8080/wp-admin
- WPGraphQL: http://localhost:8080/graphql
- Supabase Kong: http://localhost:54321
- Supabase Studio: http://localhost:54323
- Astro directo: http://localhost:4321

## Servicios

- `edge` -> Nginx routing unico (Astro + WP)
- `astro` -> frontend dev server
- `wp` -> WordPress php-fpm (WPGraphQL)
- `db_wp` -> MariaDB para WordPress
- `supabase-db` -> Postgres para Supabase
- `supabase-auth` -> GoTrue
- `supabase-rest` -> PostgREST
- `supabase-realtime` -> WebSocket realtime
- `supabase-storage` -> Storage API
- `supabase-meta` -> Metadata para Studio
- `supabase-kong` -> API gateway
- `supabase-studio` -> UI de admin

## Variables clave

Root `.env`:
- `ASTRO_PUBLIC_CMS_URL=http://edge`
- `JWT_SECRET` debe coincidir con las keys JWT

`frontend/.env`:
- `ASTRO_PUBLIC_CMS_URL=http://localhost:8080`
- `PUBLIC_SUPABASE_URL=http://localhost:54321`

## Reset

```bash
docker compose down -v
rm -rf volumes/db_wp volumes/supabase_db
```
