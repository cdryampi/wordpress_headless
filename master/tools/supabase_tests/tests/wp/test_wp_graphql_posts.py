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


def test_wp_graphql_posts_list():
    query = """
    query ListPosts {
      posts(first: 5) {
        nodes {
          title
          slug
          excerpt
          date
          categories {
            nodes { slug }
          }
        }
      }
    }
    """
    data = graphql_request(query)
    nodes = (data.get("posts") or {}).get("nodes") or []
    assert nodes, "Expected at least 1 post from WPGraphQL"
    for node in nodes:
        assert node.get("title"), "Post title missing"
        assert node.get("slug"), "Post slug missing"
        assert node.get("excerpt") is not None and node.get("excerpt") != "", "Post excerpt missing"
        assert node.get("date"), "Post date missing"
        categories = (node.get("categories") or {}).get("nodes")
        assert isinstance(categories, list), "Post categories.nodes missing"
        for category in categories:
            assert category.get("slug"), "Category slug missing"


def test_wp_graphql_post_by_slug():
    slug = require_env("WP_TEST_POST_SLUG")
    query = """
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        slug
        content
      }
    }
    """
    data = graphql_request(query, {"slug": slug})
    post = data.get("post")
    assert post, "WP test post not found by slug"
    assert post.get("title"), "Post title missing"
    assert post.get("content"), "Post content missing"
    assert post.get("slug") == slug, "Post slug mismatch"
