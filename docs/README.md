# Docs

Guia agil para instalar, ejecutar y entender el monorepo.

> **Platform:** Windows (PowerShell)

## Requerimientos

- **Docker Desktop** con Compose v2 (WSL 2 backend recomendado)
- **Puertos libres:** 8080 (edge), 4321 (astro), 54321 (supabase kong), 54323 (studio)
- **RAM:** 6-8 GB libres recomendados
- **WSL 2:** Habilitar para mejor rendimiento de Docker en Windows

## Instalacion rapida

1) Copia variables de entorno:

```powershell
Copy-Item .env.example .env
```

2) Inicia todo:

```powershell
docker compose up --build
```

3) URLs principales:

| Service | URL |
|---------|-----|
| App (edge) | http://localhost:8080 |
| WP admin | http://localhost:8080/wp-admin |
| WPGraphQL | http://localhost:8080/graphql |
| Supabase Kong (API) | http://localhost:54321 |
| Supabase Studio | http://localhost:54323 |
| Astro directo | http://localhost:4321 |

## Variables de entorno clave

**Archivo raiz `.env`:**

- WordPress usa MariaDB (no Postgres).
- Supabase usa su propio Postgres.
- `ASTRO_PUBLIC_CMS_URL` debe ser `http://edge` dentro de Docker.

**Archivo `frontend/.env` (Vite/Astro):**

- `ASTRO_PUBLIC_CMS_URL` para llamadas desde el navegador.
- `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` para el cliente de Supabase.

## Servicios (12)

| # | Servicio | Descripcion |
|---|----------|-------------|
| 1 | `db_wp` (MariaDB) | DB para WordPress. Datos en `volumes\db_wp` |
| 2 | `wp` (PHP-FPM 8.3) | WordPress + WP-CLI. Instala WP, permalinks, WPGraphQL |
| 3 | `supabase-db` (Postgres) | Base Postgres para Supabase. En `volumes\supabase_db` |
| 4 | `supabase-auth` (GoTrue) | Auth y JWT. Requiere `API_EXTERNAL_URL` |
| 5 | `supabase-rest` (PostgREST) | API REST sobre Postgres. Usa `JWT_SECRET` |
| 6 | `supabase-realtime` | WebSocket. Requiere `SECRET_KEY_BASE` y `FLY_APP_NAME` |
| 7 | `supabase-storage` | Storage API. Usa PostgREST y Postgres |
| 8 | `supabase-meta` | Postgres metadata para Studio |
| 9 | `supabase-kong` | API gateway. Expone `/auth`, `/rest`, `/storage`, `/realtime` |
| 10 | `supabase-studio` | UI de administracion para Supabase |
| 11 | `astro` | Frontend Astro dev server en 4321 |
| 12 | `edge` (Nginx) | Reverse proxy unico (Astro + WP) |

### Routing del Edge

- `/` y `/assets` → Astro
- `/wp-admin`, `/wp-login.php`, `/wp-json`, `/graphql`, `/wp-content`, `/wp-includes` → WordPress

## Por que este stack

- WordPress sigue nativo en MariaDB (menos friccion con plugins y WPGraphQL).
- Supabase aporta auth, storage y APIs sin mezclar datos con WP.
- Astro ofrece performance y DX para un frontend moderno.
- Un solo edge simplifica rutas y evita confusiones en el navegador.

**Casos de uso:**

- Marketing + blog (WPGraphQL) con app frontend moderna.
- B2B con panel propio (Supabase) y contenido editorial en WP.
- MVP headless rapido con auth y storage listos.

## Troubleshooting (Windows)

### Problemas comunes en Windows

| Problema | Solucion |
|----------|----------|
| Docker lento | Habilitar WSL 2 en Docker Desktop Settings |
| Puertos ocupados | `netstat -ano \| findstr :8080` para encontrar proceso |
| Permisos de volumen | Asegurar que Docker tiene acceso a la unidad |
| Line endings (CRLF) | Configurar Git: `git config --global core.autocrlf input` |

### Problemas resueltos del proyecto

| Problema | Solucion |
|----------|----------|
| `supabase/kong` no existe | Usar `kong:2.8.1` y `postgrest/postgrest:v12.2.0` |
| MariaDB healthcheck falla | Usar `mariadb-admin` en lugar de `mysqladmin` |
| GoTrue cae | Definir `API_EXTERNAL_URL=${PUBLIC_SUPABASE_URL}` |
| Realtime cae | Definir `SECRET_KEY_BASE` y `REALTIME_APP_NAME` |
| Studio no pasa healthcheck | Healthcheck via `node` al hostname, no `127.0.0.1` |
| WP CLI sin memoria | Ejecutar con `php -d memory_limit=256M` |
| PHP-FPM no arranca | Ejecutar `/usr/local/sbin/php-fpm -F -R` |
| `/wp-admin` sin estilos | No usar `^~` en `/wp-admin/` en nginx |
| Astro no llega a WP | `ASTRO_PUBLIC_CMS_URL=http://edge` en `.env` |

## Debug rapido (PowerShell)

```powershell
# Estado de servicios
docker compose ps

# Logs de un servicio (ej: wp)
docker compose logs wp --tail=200

# Reiniciar un servicio
docker compose up -d --force-recreate wp

# Rebuild completo
docker compose up -d --build

# Ejecutar comando en contenedor
docker compose exec wp bash
```

## Reset total

```powershell
docker compose down -v
Remove-Item -Recurse -Force volumes\db_wp, volumes\supabase_db
```
