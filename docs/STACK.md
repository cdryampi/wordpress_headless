# Stack Cheat Sheet

Guia ultra rapida del stack y como encenderlo.

> **Platform:** Windows (PowerShell)

## TL;DR

```powershell
Copy-Item .env.example .env
docker compose up --build
```

## URLs

| Service | URL |
|---------|-----|
| App (edge) | http://localhost:8080 |
| WordPress admin | http://localhost:8080/wp-admin |
| WPGraphQL | http://localhost:8080/graphql |
| Supabase Kong | http://localhost:54321 |
| Supabase Studio | http://localhost:54323 |
| Astro directo | http://localhost:4321 |

## Servicios

| Servicio | Descripcion |
|----------|-------------|
| `edge` | Nginx routing unico (Astro + WP) |
| `astro` | Frontend dev server |
| `wp` | WordPress php-fpm (WPGraphQL) |
| `db_wp` | MariaDB para WordPress |
| `supabase-db` | Postgres para Supabase |
| `supabase-auth` | GoTrue |
| `supabase-rest` | PostgREST |
| `supabase-realtime` | WebSocket realtime |
| `supabase-storage` | Storage API |
| `supabase-meta` | Metadata para Studio |
| `supabase-kong` | API gateway |
| `supabase-studio` | UI de admin |

## Variables clave

**Root `.env`:**
- `ASTRO_PUBLIC_CMS_URL=http://edge`
- `JWT_SECRET` debe coincidir con las keys JWT

**`frontend/.env`:**
- `ASTRO_PUBLIC_CMS_URL=http://localhost:8080`
- `PUBLIC_SUPABASE_URL=http://localhost:54321`

## Reset

```powershell
docker compose down -v
Remove-Item -Recurse -Force volumes\db_wp, volumes\supabase_db
```

## Debug rapido (PowerShell)

```powershell
# Estado de servicios
docker compose ps

# Logs de un servicio
docker compose logs <service> --tail=200

# Reiniciar servicio
docker compose up -d --force-recreate <service>

# Rebuild completo
docker compose up -d --build
```
