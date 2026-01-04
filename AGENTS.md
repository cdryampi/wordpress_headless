# AGENTS.md

## Contexto del repo
- Monorepo dockerizado en `master/` con WordPress headless (WPGraphQL + MariaDB), Supabase self-hosted (Postgres + servicios) y Astro.
- Nginx edge unico enruta Astro y WordPress. Supabase NO pasa por el edge.
- Debe funcionar con `docker compose up --build` usando `.env`.

## Reglas clave
- WordPress usa MariaDB/MySQL; Supabase usa su Postgres. No mezclar.
- Entrypoint de WordPress es idempotente: espera DB, instala WP, activa permalinks y WPGraphQL.
- Astro usa Tailwind v4 via `@tailwindcss/vite` (NO `@astrojs/tailwind`).
- Astro dentro de Docker debe usar `ASTRO_PUBLIC_CMS_URL=http://edge`.

## Puertos y rutas
- Edge: `http://localhost:8080`
- Astro directo: `http://localhost:4321`
- WP admin: `/wp-admin`
- WPGraphQL: `/graphql`
- Supabase: Kong `http://localhost:54321`, Studio `http://localhost:54323`

## Archivos importantes
- `docker-compose.yml` orquesta servicios.
- `docker/wp/*` build + entrypoint de WP.
- `docker/edge/nginx.conf` routing WP vs Astro y CORS dev.
- `frontend/*` app Astro.
- `supabase/kong.yml` config declarativa de Kong.

## Arranque (12 servicios)
1) Copiar env: `cp .env.example .env`
2) Levantar todo: `docker compose up --build`
3) Si solo quieres lo esencial: `docker compose up -d db_wp wp astro edge`

## Debug rapido
- Estado: `docker compose ps`
- Logs por servicio: `docker compose logs <service> --tail=200`
- Reiniciar servicio: `docker compose up -d --force-recreate <service>`
- Rebuild completo: `docker compose up -d --build`

## Errores conocidos y fixes
- WP admin sin estilos: revisar `docker/edge/nginx.conf` para que `/wp-admin/` no use `^~` y permita `.php`.
- Astro no llega al CMS: `ASTRO_PUBLIC_CMS_URL` en `.env` debe ser `http://edge` dentro de Docker.
- Supabase realtime cae si falta `SECRET_KEY_BASE` o `REALTIME_APP_NAME`.
