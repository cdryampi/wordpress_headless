import uuid

import requests

from conftest import DEFAULT_TIMEOUT


def test_newsletter_subscribe(settings):
    email = f"pytest_{uuid.uuid4().hex[:10]}@example.com"
    url = settings.function_url(
        "newsletter-subscribe",
        settings.newsletter_function_url,
    )
    headers = {"Content-Type": "application/json", **settings.headers()}
    resp = requests.post(
        url,
        headers=headers,
        json={"email": email},
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code == 200, f"newsletter-subscribe failed: {resp.status_code}"
    payload = resp.json()
    assert payload.get("ok") is True, "newsletter-subscribe did not return ok=true"


def test_profile_bootstrap(settings, auth_users):
    user1 = auth_users["user1"]
    url = settings.function_url(
        "profile-bootstrap",
        settings.profile_function_url,
    )
    resp = requests.get(
        url,
        headers=settings.headers(user1["token"]),
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code == 200, f"profile-bootstrap failed: {resp.status_code}"
    payload = resp.json()
    assert payload.get("ok") is True, "profile-bootstrap did not return ok=true"
    profile = payload.get("profile") or {}
    assert profile.get("id") == user1["id"], "profile-bootstrap returned wrong profile"
