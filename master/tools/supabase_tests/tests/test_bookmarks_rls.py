import requests

from conftest import DEFAULT_TIMEOUT, unique_slug


def test_bookmarks_rls(settings, auth_users):
    user1 = auth_users["user1"]
    user2 = auth_users["user2"]
    url = f"{settings.rest_url}/bookmarks"
    slug = unique_slug("bookmark")

    resp = requests.post(
        url,
        headers=settings.headers(),
        json={"user_id": user1["id"], "post_slug": slug},
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code in (401, 403), "anon insert should be blocked"

    insert_headers = settings.headers(user1["token"])
    insert_headers["Prefer"] = "return=representation"
    resp = requests.post(
        url,
        headers=insert_headers,
        json={"user_id": user1["id"], "post_slug": slug},
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code in (200, 201), f"user1 insert failed: {resp.status_code}"
    data = resp.json()
    bookmark_id = data[0]["id"] if data else None

    if not bookmark_id:
        resp = requests.get(
            url,
            params={"select": "id", "user_id": f"eq.{user1['id']}", "post_slug": f"eq.{slug}"},
            headers=settings.headers(user1["token"]),
            timeout=DEFAULT_TIMEOUT,
        )
        rows = resp.json()
        bookmark_id = rows[0]["id"] if rows else None

    assert bookmark_id, "bookmark insert did not return an id"

    requests.delete(
        url,
        params={"id": f"eq.{bookmark_id}"},
        headers=settings.headers(user2["token"]),
        timeout=DEFAULT_TIMEOUT,
    )

    resp = requests.get(
        url,
        params={"select": "id", "id": f"eq.{bookmark_id}"},
        headers=settings.headers(user1["token"]),
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.json(), "user2 should not be able to delete user1 bookmark"

    requests.delete(
        url,
        params={"id": f"eq.{bookmark_id}"},
        headers=settings.headers(user1["token"]),
        timeout=DEFAULT_TIMEOUT,
    )
