import requests

from conftest import DEFAULT_TIMEOUT, require_env


def test_wp_base_url():
    base_url = require_env("WP_BASE_URL").rstrip("/")
    resp = requests.get(base_url, allow_redirects=False, timeout=DEFAULT_TIMEOUT)
    assert resp.status_code in (200, 301, 302), (
        f"WP_BASE_URL not reachable: {resp.status_code}"
    )


def test_wp_rest_root():
    rest_url = require_env("WP_REST_URL").rstrip("/")
    resp = requests.get(rest_url, timeout=DEFAULT_TIMEOUT)
    assert resp.status_code == 200, f"WP_REST_URL failed: {resp.status_code}"
    try:
        data = resp.json()
    except ValueError as exc:
        raise AssertionError("WP_REST_URL did not return JSON") from exc
    assert isinstance(data, dict), "WP_REST_URL response is not JSON object"
