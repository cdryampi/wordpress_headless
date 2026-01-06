import pytest
import requests

from conftest import DEFAULT_TIMEOUT


def test_storage_bucket_exists(settings):
    if not settings.service_role_key:
        pytest.skip("SUPABASE_SERVICE_ROLE_KEY not set")

    headers = {
        "apikey": settings.service_role_key,
        "Authorization": f"Bearer {settings.service_role_key}",
    }
    resp = requests.get(
        f"{settings.storage_url}/bucket/avatars",
        headers=headers,
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code == 200, f"avatars bucket missing: {resp.status_code}"
