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


def test_wp_graphql_schema_minimal():
    query = """
    query MinimalIntrospection {
      schema: __schema {
        queryType {
          name
          fields { name }
        }
      }
      mediaItem: __type(name: "MediaItem") { name }
      category: __type(name: "Category") { name }
    }
    """
    data = graphql_request(query)
    schema = data.get("schema") or {}
    query_type = schema.get("queryType") or {}
    fields = {field.get("name") for field in (query_type.get("fields") or [])}
    query_name = query_type.get("name")
    assert query_name in ("Query", "RootQuery"), "Root query type missing"
    assert "posts" in fields, "Query.posts missing in schema"
    assert "post" in fields, "Query.post missing in schema"
    assert data.get("mediaItem", {}).get("name") == "MediaItem", "MediaItem type missing"
    assert data.get("category", {}).get("name") == "Category", "Category type missing"
