import { GraphQLClient, gql } from "graphql-request";

const CMS_URL = import.meta.env.ASTRO_PUBLIC_CMS_URL || "http://localhost:8080";
const GRAPHQL_ENDPOINT = new URL("/graphql", CMS_URL).toString();
const client = new GraphQLClient(GRAPHQL_ENDPOINT);

export type MediaNode = {
  sourceUrl: string;
  altText?: string | null;
};

export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  count?: number | null;
};

export type TagSummary = {
  id: string;
  name: string;
  slug: string;
};

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  date?: string | null;
  categories?: { nodes: CategorySummary[] };
  featuredImage?: { node: MediaNode | null } | null;
  author?: { node: { name: string } | null } | null;
};

export type PostDetail = {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  date?: string | null;
  excerpt?: string | null;
  categories?: { nodes: CategorySummary[] };
  tags?: { nodes: TagSummary[] };
  featuredImage?: { node: MediaNode | null } | null;
  author?: { node: { name: string } | null } | null;
};

async function cmsRequest<T>(query: string, variables: Record<string, unknown> = {}) {
  return client.request<T>(query, variables);
}

const POST_SUMMARY_FIELDS = `
  id
  title
  slug
  excerpt
  date
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
  categories {
    nodes {
      id
      name
      slug
      count
    }
  }
  author {
    node {
      name
    }
  }
`;

export async function getPosts(limit = 12): Promise<PostSummary[]> {
  const data = await cmsRequest<{ posts: { nodes: PostSummary[] } }>(
    gql`
      query Posts($first: Int) {
        posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            ${POST_SUMMARY_FIELDS}
          }
        }
      }
    `,
    { first: limit }
  );

  return data.posts?.nodes ?? [];
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  const data = await cmsRequest<{ postBy: PostDetail | null }>(
    gql`
      query PostBySlug($slug: String!) {
        postBy(slug: $slug) {
          id
          title
          slug
          content
          excerpt
          date
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              id
              name
              slug
              count
            }
          }
          tags {
            nodes {
              id
              name
              slug
            }
          }
          author {
            node {
              name
            }
          }
        }
      }
    `,
    { slug }
  );

  return data.postBy ?? null;
}

export async function getCategories(): Promise<CategorySummary[]> {
  const data = await cmsRequest<{ categories: { nodes: CategorySummary[] } }>(
    gql`
      query Categories {
        categories(first: 50) {
          nodes {
            id
            name
            slug
            count
          }
        }
      }
    `
  );

  return data.categories?.nodes ?? [];
}
