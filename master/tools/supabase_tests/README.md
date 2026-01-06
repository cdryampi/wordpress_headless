# Supabase self-hosted tests (pytest)

This folder provides a local, reproducible pytest suite to validate:
- Edge Functions (HTTP)
- RLS policies (REST)
- Auth basics (signup/signin)
- Storage smoke (optional)

## Setup (Windows-first)

PowerShell:
```
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
pytest -q
```

If activation is blocked:
```
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Linux/Mac:
```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
pytest -q
```

## Env notes

Required keys are listed in `.env.example`.

Plan B if signup is disabled:
- Use existing users for `TEST_USER_EMAIL_*` and `TEST_USER_PASSWORD_*`.
- Or set optional tokens in `.env`:
  - `TEST_USER_ACCESS_TOKEN_1` + `TEST_USER_ID_1`
  - `TEST_USER_ACCESS_TOKEN_2` + `TEST_USER_ID_2`

If Functions are not routed via Kong, you can override per function:
- `SUPABASE_NEWSLETTER_FUNCTION_URL`
- `SUPABASE_PROFILE_FUNCTION_URL`

Example (local edge runtime containers):
```
SUPABASE_NEWSLETTER_FUNCTION_URL=http://localhost:54324
SUPABASE_PROFILE_FUNCTION_URL=http://localhost:54325
```

## WordPress Headless tests

These tests validate WordPress availability and headless APIs.
Files live under `tests/wp/`:
- `test_wp_health.py`
- `test_wp_graphql_schema.py`
- `test_wp_graphql_posts.py`
- `test_wp_graphql_media.py`
- `test_wp_rest_smoke.py`
- Health: `WP_BASE_URL`, `WP_REST_URL`
- WPGraphQL schema and content: `WP_GRAPHQL_URL`
- Media uploads: featured image URL and public access
- REST smoke: `/wp-json/wp/v2/posts` and `/wp-json/wp/v2/categories`

Endpoints used (configurable in `.env`):
- `WP_BASE_URL`
- `WP_GRAPHQL_URL`
- `WP_REST_URL`
- `WP_TEST_POST_SLUG`

Common failures:
- `WPGraphQL no esta activo`: plugin not enabled or `/graphql` not routed
- `WP test post not found by slug`: seed content missing (`WP_TEST_POST_SLUG`)
- `No featuredImage sourceUrl found`: posts have no featured image
- Media fetch not image/*: uploads not public or incorrect URL
