import requests

from conftest import DEFAULT_TIMEOUT, unique_slug


def test_comments_rls(settings, auth_users):
    user1 = auth_users["user1"]
    user2 = auth_users["user2"]
    url = f"{settings.rest_url}/comments"
    slug = unique_slug("comment")

    resp = requests.get(
        url,
        params={"select": "id", "limit": 1},
        headers=settings.headers(),
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code == 200, "comments should be publicly readable"

    insert_headers = settings.headers(user1["token"])
    insert_headers["Prefer"] = "return=representation"
    resp = requests.post(
        url,
        headers=insert_headers,
        json={"user_id": user1["id"], "post_slug": slug, "body": "pytest comment"},
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.status_code in (200, 201), f"user1 insert failed: {resp.status_code}"
    rows = resp.json()
    comment_id = rows[0]["id"] if rows else None
    assert comment_id, "comment insert did not return an id"

    requests.patch(
        url,
        params={"id": f"eq.{comment_id}"},
        headers=settings.headers(user2["token"]),
        json={"body": "hacked"},
        timeout=DEFAULT_TIMEOUT,
    )

    resp = requests.get(
        url,
        params={"select": "id,body", "id": f"eq.{comment_id}"},
        headers=settings.headers(user1["token"]),
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.json()[0]["body"] == "pytest comment", "user2 should not update user1 comment"

    requests.delete(
        url,
        params={"id": f"eq.{comment_id}"},
        headers=settings.headers(user2["token"]),
        timeout=DEFAULT_TIMEOUT,
    )

    resp = requests.get(
        url,
        params={"select": "id", "id": f"eq.{comment_id}"},
        headers=settings.headers(user1["token"]),
        timeout=DEFAULT_TIMEOUT,
    )
    assert resp.json(), "user2 should not delete user1 comment"

    requests.delete(
        url,
        params={"id": f"eq.{comment_id}"},
        headers=settings.headers(user1["token"]),
        timeout=DEFAULT_TIMEOUT,
    )
