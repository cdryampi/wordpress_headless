import uuid

import requests

from conftest import DEFAULT_TIMEOUT


def test_profiles_rls(settings, auth_users):
    user1 = auth_users["user1"]
    user2 = auth_users["user2"]
    url = f"{settings.rest_url}/profiles"

    resp = requests.get(
        url,
        params={"select": "id,display_name", "id": f"eq.{user1['id']}"},
        headers=settings.headers(user1["token"]),
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code == 200, f"profiles select failed: {resp.status_code}"
    rows = resp.json()
    assert len(rows) == 1, "user1 should be able to select own profile"

    resp = requests.get(
        url,
        params={"select": "id", "id": f"eq.{user1['id']}"},
        headers=settings.headers(user2["token"]),
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code == 200, f"user2 select failed: {resp.status_code}"
    assert resp.json() == [], "user2 should not see user1 profile"

    new_name = f"pytest_{uuid.uuid4().hex[:8]}"
    update_headers = settings.headers(user1["token"])
    update_headers["Prefer"] = "return=representation"
    resp = requests.patch(
        url,
        params={"id": f"eq.{user1['id']}"},
        headers=update_headers,
        json={"display_name": new_name},
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code in (200, 204), f"profile update failed: {resp.status_code}"

    resp = requests.get(
        url,
        params={"select": "id,display_name", "id": f"eq.{user1['id']}"},
        headers=settings.headers(user1["token"]),
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.json()[0]["display_name"] == new_name, "profile update did not persist"

    resp = requests.patch(
        url,
        params={"id": f"eq.{user1['id']}"},
        headers=settings.headers(user2["token"]),
        json={"display_name": "hacked"},
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code in (200, 204, 401, 403), "user2 update should be blocked"

    resp = requests.get(
        url,
        params={"select": "id,display_name", "id": f"eq.{user1['id']}"},
        headers=settings.headers(user1["token"]),
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.json()[0]["display_name"] == new_name, "user2 update should not change data"

    requests.patch(
        url,
        params={"id": f"eq.{user1['id']}"},
        headers=settings.headers(user1["token"]),
        json={"display_name": None},
        timeout=DEFAULT_TIMEOUT,
    )
