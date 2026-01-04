const CMS_URL = import.meta.env.ASTRO_PUBLIC_CMS_URL || "http://localhost:8080";
const GRAPHQL_ENDPOINT = new URL("/graphql", CMS_URL).toString();

type GraphQLError = { message: string };

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  date?: string | null;
};

export type PostDetail = {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  date?: string | null;
};

async function cmsRequest<T>(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  });

  const json = (await response.json()) as GraphQLResponse<T>;

  if (!response.ok || json.errors) {
    const message = json.errors?.map((err) => err.message).join(" | ") || response.statusText;
    throw new Error(`CMS request failed: ${message}`);
  }

  return json.data as T;
}

export async function getPosts(limit = 12): Promise<PostSummary[]> {
  const data = await cmsRequest<{ posts: { nodes: PostSummary[] } }>(
    `query Posts($first: Int) {
      posts(first: $first) {
        nodes {
          id
          title
          slug
          excerpt
          date
        }
      }
    }`,
    { first: limit }
  );

  return data.posts?.nodes ?? [];
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const data = await cmsRequest<{ postBy: PostDetail | null }>(
    `query PostBySlug($slug: String!) {
      postBy(slug: $slug) {
        id
        title
        slug
        content
        date
      }
    }`,
    { slug }
  );

  return data.postBy ?? null;
}
