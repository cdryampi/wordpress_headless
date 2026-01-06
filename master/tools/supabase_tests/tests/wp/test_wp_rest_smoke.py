import requests

from conftest import DEFAULT_TIMEOUT, require_env


def test_wp_rest_posts():
    rest_url = require_env("WP_REST_URL").rstrip("/")
    resp = requests.get(f"{rest_url}/wp/v2/posts", timeout=DEFAULT_TIMEOUT)
    assert resp.status_code == 200, f"WP REST posts failed: {resp.status_code}"
    data = resp.json()
    assert isinstance(data, list), "WP REST posts response is not a list"


def test_wp_rest_categories():
    rest_url = require_env("WP_REST_URL").rstrip("/")
    resp = requests.get(f"{rest_url}/wp/v2/categories", timeout=DEFAULT_TIMEOUT)
    assert resp.status_code == 200, f"WP REST categories failed: {resp.status_code}"
    data = resp.json()
    assert isinstance(data, list), "WP REST categories response is not a list"
