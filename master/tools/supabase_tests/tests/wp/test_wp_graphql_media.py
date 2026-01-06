import requests

from conftest import DEFAULT_TIMEOUT, require_env


def graphql_request(query, variables=None):
    url = require_env("WP_GRAPHQL_URL").rstrip("/")
    resp = requests.post(
        url,
        json={"query": query, "variables": variables or {}},
        timeout=DEFAULT_TIMEOUT,
    )
    if resp.status_code == 404:
        raise AssertionError("WPGraphQL no esta activo")
    assert resp.status_code == 200, f"WPGraphQL HTTP error: {resp.status_code}"
    try:
        payload = resp.json()
    except ValueError as exc:
        raise AssertionError("WPGraphQL no esta activo") from exc
    if payload.get("errors"):
        raise AssertionError(f"WPGraphQL error: {payload['errors'][0].get('message')}")
    return payload.get("data") or {}


def test_wp_graphql_media_featured_image():
    query = """
    query PostsWithFeaturedImage {
      posts(first: 5) {
        nodes {
          featuredImage {
            node { sourceUrl }
          }
        }
      }
    }
    """
    data = graphql_request(query)
    nodes = (data.get("posts") or {}).get("nodes") or []
    source_url = None
    for node in nodes:
        featured = (node.get("featuredImage") or {}).get("node") or {}
        source_url = featured.get("sourceUrl")
        if source_url:
            break

    assert source_url, "No featuredImage sourceUrl found in posts"
    assert "/wp-content/uploads/" in source_url, "sourceUrl not in uploads path"

    resp = requests.get(source_url, timeout=DEFAULT_TIMEOUT)
    assert resp.status_code == 200, f"Media fetch failed: {resp.status_code}"
    content_type = resp.headers.get("Content-Type", "")
    assert content_type.startswith("image/"), "Media content-type is not image/*"
