import { supabase } from '../../lib/supabase';

export const getBookmarks = async () => {
  // Graceful fail if table doesn't exist
  const { data, error } = await supabase.from('bookmarks').select('*');
  if (error) {
     // Return empty if table not found (code 42P01 in Postgres usually, but Supabase JS wrapper might vary)
     if (error.code === '42P01') return []; 
     throw error;
  }
  return data || [];
};

export const addBookmark = async (post: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in");
  
  const { error } = await supabase.from('bookmarks').insert({
    user_id: user.id,
    post_id: post.id,
    post_title: post.title,
  });
  if (error) throw error;
};
