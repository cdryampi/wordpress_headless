# AGENTS.md

> **Platform:** Windows (PowerShell)

## Contexto del repo

- Monorepo dockerizado con WordPress headless (WPGraphQL + MariaDB), Supabase self-hosted (Postgres + servicios) y Astro.
- Nginx edge unico enruta Astro y WordPress. Supabase NO pasa por el edge.
- Debe funcionar con `docker compose up --build` usando `.env`.

## Reglas clave

- WordPress usa MariaDB/MySQL; Supabase usa su Postgres. No mezclar.
- Entrypoint de WordPress es idempotente: espera DB, instala WP, activa permalinks y WPGraphQL.
- Astro usa Tailwind v4 via `@tailwindcss/vite` (NO `@astrojs/tailwind`).
- Astro dentro de Docker debe usar `ASTRO_PUBLIC_CMS_URL=http://edge`.

## Puertos y rutas

| Servicio | URL |
|----------|-----|
| Edge | http://localhost:8080 |
| Astro directo | http://localhost:4321 |
| WP admin | http://localhost:8080/wp-admin |
| WPGraphQL | http://localhost:8080/graphql |
| Supabase Kong | http://localhost:54321 |
| Supabase Studio | http://localhost:54323 |

## Archivos importantes

| Archivo | Descripcion |
|---------|-------------|
| `docker-compose.yml` | Orquesta servicios |
| `docker\wp\*` | Build + entrypoint de WP |
| `docker\edge\nginx.conf` | Routing WP vs Astro y CORS dev |
| `frontend\*` | App Astro |
| `apps\mobile\*` | App móvil Expo/React Native |
| `supabase\kong.yml` | Config declarativa de Kong |

## Arranque (12 servicios)

```powershell
# 1) Copiar env
Copy-Item .env.example .env

# 2) Levantar todo
docker compose up --build

# 3) Solo lo esencial
docker compose up -d db_wp wp astro edge
```

## Debug rapido (PowerShell)

```powershell
# Estado de servicios
docker compose ps

# Logs por servicio
docker compose logs <service> --tail=200

# Reiniciar servicio
docker compose up -d --force-recreate <service>

# Rebuild completo
docker compose up -d --build
```

## Errores conocidos y fixes

| Problema | Solucion |
|----------|----------|
| WP admin sin estilos | Revisar `docker\edge\nginx.conf`, no usar `^~` en `/wp-admin/` |
| Astro no llega al CMS | `ASTRO_PUBLIC_CMS_URL=http://edge` en `.env` |
| Supabase realtime cae | Falta `SECRET_KEY_BASE` o `REALTIME_APP_NAME` |

## Windows-specific

| Problema | Solucion |
|----------|----------|
| Docker lento | Habilitar WSL 2 en Docker Desktop |
| Line endings | `git config --global core.autocrlf input` |
| Puertos ocupados | `netstat -ano \| findstr :<PORT>` |
| Paths con backslash | Usar `\` en PowerShell, `/` en Docker |
