# Docs

Guia agil para instalar, ejecutar y entender el monorepo.

## Requerimientos

- Docker Desktop con Compose v2
- Puertos libres: 8080 (edge), 4321 (astro), 54321 (supabase kong), 54323 (studio)
- 6-8 GB de RAM libres recomendados

## Instalacion rapida

1) Copia variables de entorno:

```bash
cp .env.example .env
```

2) Inicia todo:

```bash
docker compose up --build
```

3) URLs principales:

- App (edge): http://localhost:8080
- WP admin: http://localhost:8080/wp-admin
- WPGraphQL: http://localhost:8080/graphql
- Supabase Kong (API): http://localhost:54321
- Supabase Studio: http://localhost:54323
- Astro directo: http://localhost:4321

## Variables de entorno clave

Archivo raiz `.env`:

- WordPress usa MariaDB (no Postgres).
- Supabase usa su propio Postgres.
- `ASTRO_PUBLIC_CMS_URL` debe ser `http://edge` dentro de Docker (para que Astro resuelva al edge).

Archivo `frontend/.env` (Vite/Astro):

- `ASTRO_PUBLIC_CMS_URL` para llamadas desde el navegador.
- `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY` para el cliente de Supabase.

## Servicios (12)

1) `db_wp` (MariaDB)
   - DB para WordPress. Datos persistidos en `volumes/db_wp`.

2) `wp` (PHP-FPM 8.3)
   - WordPress + WP-CLI. Instala WP, activa permalinks y WPGraphQL.

3) `supabase-db` (Postgres)
   - Base Postgres para Supabase. Persistencia en `volumes/supabase_db`.

4) `supabase-auth` (GoTrue)
   - Auth y JWT. Requiere `API_EXTERNAL_URL`.

5) `supabase-rest` (PostgREST)
   - API REST sobre Postgres. Usa `JWT_SECRET`.

6) `supabase-realtime`
   - WebSocket realtime. Requiere `SECRET_KEY_BASE` y `FLY_APP_NAME`.

7) `supabase-storage`
   - Storage API. Usa PostgREST y Postgres.

8) `supabase-meta`
   - Postgres metadata para Studio.

9) `supabase-kong`
   - API gateway. Expone `/auth`, `/rest`, `/storage`, `/realtime`.

10) `supabase-studio`
    - UI de administracion para Supabase.

11) `astro`
    - Frontend Astro dev server en 4321.

12) `edge` (Nginx)
    - Reverse proxy unico:
      - `/` y `/assets` -> Astro
      - `/wp-admin`, `/wp-login.php`, `/wp-json`, `/graphql`, `/wp-content`, `/wp-includes` -> WordPress

## Por que este stack

- WordPress sigue nativo en MariaDB (menos friccion con plugins y WPGraphQL).
- Supabase aporta auth, storage y APIs sin mezclar datos con WP.
- Astro ofrece performance y DX para un frontend moderno.
- Un solo edge simplifica rutas y evita confusiones en el navegador.

Casos de uso:

- Marketing + blog (WPGraphQL) con app frontend moderna.
- B2B con panel propio (Supabase) y contenido editorial en WP.
- MVP headless rapido con auth y storage listos.

## Troubleshooting (la odisea)

Problemas reales que se resolvieron en este proyecto:

- `supabase/kong` y `supabase/postgrest` no existen publicamente:
  - Solucion: usar `kong:2.8.1` y `postgrest/postgrest:v12.2.0`.

- MariaDB healthcheck fallaba:
  - Solucion: usar `mariadb-admin` en lugar de `mysqladmin`.

- GoTrue caia por `API_EXTERNAL_URL` faltante:
  - Solucion: definir `API_EXTERNAL_URL=${PUBLIC_SUPABASE_URL}`.

- Realtime caia por `SECRET_KEY_BASE` y `APP_NAME`:
  - Solucion: definir `SECRET_KEY_BASE` y `REALTIME_APP_NAME` (mapeado a `FLY_APP_NAME`).

- Studio no pasaba healthcheck:
  - Solucion: healthcheck via `node` apuntando al hostname del contenedor, no `127.0.0.1`.

- WP CLI moria por memoria:
  - Solucion: ejecutar WP-CLI con `php -d memory_limit=256M`.

- PHP-FPM mostraba ayuda y no arrancaba:
  - Solucion: ejecutar `/usr/local/sbin/php-fpm -F -R`.

- `/wp-admin` sin estilos:
  - Solucion: no usar `^~` en `/wp-admin/` para que los `.php` pasen por FastCGI.

- Astro dentro de Docker no podia llamar a WP:
  - Solucion: `ASTRO_PUBLIC_CMS_URL=http://edge` en `.env` del root.

## Reset total

```bash
docker compose down -v
rm -rf volumes/db_wp volumes/supabase_db
```
