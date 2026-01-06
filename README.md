# Headless WordPress + Supabase + Astro

A dockerized monorepo with a single edge Nginx routing Astro and WordPress, while Supabase runs independently.

> **Platform:** Optimized for Windows development with PowerShell commands.

## Quick start

1) Copy environment variables:

```powershell
Copy-Item .env.example .env
```

2) Build and run:

```powershell
docker compose up --build
```

## URLs

| Service | URL |
|---------|-----|
| Site (edge) | http://localhost:8080 |
| Guides | http://localhost:8080/guides |
| WordPress admin | http://localhost:8080/wp-admin |
| WPGraphQL | http://localhost:8080/graphql |
| Supabase Kong API | http://localhost:54321 |
| Supabase Studio | http://localhost:54323 |
| Astro dev server | http://localhost:4321 |

## Reset volumes

```powershell
docker compose down -v
```

If you want to remove persisted data manually:

```powershell
Remove-Item -Recurse -Force volumes\db_wp, volumes\supabase_db
```

## GraphQL verification

```powershell
Invoke-RestMethod -Uri "http://localhost:8080/graphql" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"query":"{ posts(first:2){ nodes{ title slug featuredImage{ node{ sourceUrl } } } } }"}'
```

## Notes

- WordPress uses MariaDB only. Supabase uses its own Postgres.
- Supabase is not routed through the edge by default.
- All commands in this repo use PowerShell syntax.
