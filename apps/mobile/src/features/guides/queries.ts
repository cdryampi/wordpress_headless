import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { wpClient } from '../../lib/wpgraphql';

const GET_POSTS = gql`
  query GetPosts {
    posts(first: 20) {
      nodes {
        id
        slug
        title
        excerpt
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
`;

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const data: any = await wpClient.request(GET_POSTS);
        return data.posts.nodes;
      } catch (error) {
        console.error("WP Fetch Error", error);
        throw error;
      }
    }
  });
};

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const data: any = await wpClient.request(GET_POST_BY_SLUG, { slug });
      return data.post;
    },
    enabled: !!slug
  });
};
