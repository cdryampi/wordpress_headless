# Supabase (Auth + Profiles + Bookmarks + Comments + Newsletter + Storage)

Este folder contiene todo lo necesario para reproducir el esquema y funciones en Supabase sin tocar Docker ni el resto del repo.

> **Platform:** Windows (PowerShell)

## Esquema

**Tablas principales (schema `public`):**

| Tabla | Descripcion |
|-------|-------------|
| `profiles` | 1:1 con `auth.users` |
| `bookmarks` | por `user_id` + `post_slug` |
| `comments` | por `user_id` + `post_slug` (lectura publica) |
| `newsletter_subscribers` | emails normalizados a lowercase |

**Storage:**
- Bucket `avatars` (public read) con rutas `avatars/{user_id}/...`

## RLS (resumen)

RLS esta habilitado en todas las tablas:

| Tabla | Permisos |
|-------|----------|
| `profiles` | Solo dueño puede leer/insertar/actualizar |
| `bookmarks` | Solo dueño puede leer/insertar/borrar |
| `comments` | Lectura publica, escritura solo del dueño |
| `newsletter_subscribers` | Solo service role puede insertar/leer |
| `storage.objects` (avatars) | Lectura publica, escritura/borrado solo del dueño |

## Migraciones

**Archivos:**
- `supabase/migrations/20260105000001_init.sql`
- `supabase/migrations/20260105000002_storage.sql`

### Con Supabase CLI

Si puedes alcanzar la DB desde tu maquina:

```powershell
supabase db push --db-url "postgres://postgres:<POSTGRES_PASSWORD>@<HOST>:5432/postgres"
```

### Sin Supabase CLI (psql via Docker) - Windows PowerShell

```powershell
Get-Content supabase\migrations\20260105000001_init.sql | docker compose exec -T supabase-db psql -U postgres -d postgres
Get-Content supabase\migrations\20260105000002_storage.sql | docker compose exec -T supabase-db psql -U postgres -d postgres
```

## Edge Functions

**Funciones en `supabase/functions`:**

| Funcion | Metodo | Descripcion |
|---------|--------|-------------|
| `newsletter-subscribe` | POST | Inserta email en `newsletter_subscribers` |
| `profile-bootstrap` | GET/POST | Devuelve perfil, lo crea si falta |

### Variables de entorno

Usa `supabase/functions/.env.example` como base:

| Variable | Ejemplo |
|----------|---------|
| `SUPABASE_URL` | `http://localhost:54321` |
| `SUPABASE_ANON_KEY` | (tu anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | (tu service role key) |

En self-hosted, define secrets via CLI:

```powershell
supabase secrets set SUPABASE_URL=... SUPABASE_ANON_KEY=... SUPABASE_SERVICE_ROLE_KEY=...
```

### Self-hosted local (sin tocar docker-compose) - Windows

El stack actual no incluye runtime de Edge Functions. Para correrlas en local, levanta containers:

```powershell
# Newsletter function
docker run -d --name supabase-edge-newsletter --network wordpress_headless_default -p 54324:9000 `
  -v "${PWD}/supabase/functions:/functions:ro" `
  -e SUPABASE_URL=http://supabase-kong:8000 `
  -e SUPABASE_ANON_KEY=<ANON_KEY> `
  -e SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY> `
  supabase/edge-runtime:v1.69.28 start --main-service /functions/newsletter-subscribe

# Profile function
docker run -d --name supabase-edge-profile --network wordpress_headless_default -p 54325:9000 `
  -v "${PWD}/supabase/functions:/functions:ro" `
  -e SUPABASE_URL=http://supabase-kong:8000 `
  -e SUPABASE_ANON_KEY=<ANON_KEY> `
  -e SUPABASE_SERVICE_ROLE_KEY=<SERVICE_ROLE_KEY> `
  supabase/edge-runtime:v1.69.28 start --main-service /functions/profile-bootstrap
```

Para detener:

```powershell
docker rm -f supabase-edge-newsletter supabase-edge-profile
```

### Deploy (CLI - cloud)

```powershell
supabase functions deploy newsletter-subscribe --no-verify-jwt
supabase functions deploy profile-bootstrap
```

### Pruebas con PowerShell

**Newsletter:**

```powershell
Invoke-RestMethod -Uri "http://localhost:54324" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"demo@example.com"}'
```

**Profile bootstrap (requiere JWT de usuario):**

```powershell
Invoke-RestMethod -Uri "http://localhost:54325" `
  -Headers @{ Authorization = "Bearer <access_token>" }
```

## Notas de uso

- `post_slug` debe coincidir con el slug publicado en WordPress.
- Convencion de avatars: sube a `avatars/{user_id}/archivo.ext` y guarda `avatar_url`.
- Al crear un usuario nuevo en Auth, se auto-crea `profiles` via trigger.
