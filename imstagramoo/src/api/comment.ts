import supabase from "@/lib/supabase";
import { MAX_COMMENT_DEPTH } from "@/lib/constants";

export async function fetchRootComments(postId: number) {
  const { data, error } = await supabase
    .from("comment")
    .select("*, author:profile!author_id (*)")
    .eq("post_id", postId)
    .is("root_comment_id", null)
    .order("reply_count", { ascending: true });
  if (error) throw error;
  return data;
}
export async function fetchReplyComments({
  postId,
  rootCommentId,
}: {
  postId: number;
  rootCommentId: number;
}) {
  const { data, error } = await supabase
    .from("comment")
    .select("*, author:profile!author_id (*)")
    .eq("post_id", postId)
    .eq("root_comment_id", rootCommentId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createComment({
  postId,
  content,
  parentCommentId,
  rootCommentId,
  depth,
  path,
}: {
  postId: number;
  content: string;
  parentCommentId?: number;
  rootCommentId?: number;
  depth?: number;
  path?: string;
}) {
  const finalDepth = depth ?? 0;

  // depth 검증
  if (finalDepth > MAX_COMMENT_DEPTH) {
    throw new Error("Maximum comment depth exceeded");
  }
  const { data, error } = await supabase
    .from("comment")
    .insert({
      post_id: postId,
      content: content,
      parent_comment_id: parentCommentId,
      root_comment_id: rootCommentId,
      depth: finalDepth,
      path: path,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateComment({
  id,
  content,
}: {
  id: number;
  content: string;
}) {
  const { data, error } = await supabase
    .from("comment")
    .update({
      content,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComment(id: number) {
  const { data, error } = await supabase
    .from("comment")
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
