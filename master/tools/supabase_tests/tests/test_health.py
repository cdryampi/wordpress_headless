import requests

from conftest import DEFAULT_TIMEOUT


def test_rest_health(settings):
    resp = requests.get(
        f"{settings.rest_url}/",
        headers=settings.headers(),
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code in (200, 401, 403), (
        "REST endpoint not responding as expected. "
        f"Status {resp.status_code}"
    )


def test_functions_health(settings):
    resp = requests.get(
        settings.functions_url,
        headers=settings.headers(),
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code in (200, 401, 403), (
        "Functions endpoint not responding as expected. "
        "If using local edge runtime containers, set SUPABASE_FUNCTIONS_URL or "
        "SUPABASE_*_FUNCTION_URL overrides. "
        f"Status {resp.status_code}"
    )
