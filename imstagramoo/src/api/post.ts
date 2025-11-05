import { uploadImage } from "@/api/image";
import supabase from "@/lib/supabase";
import type { PostEntity } from "@/types";

export async function fetchPosts() {
  const { data, error } = await supabase
    .from("post")
    .select("*, author: profile!author_id (*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createPost(content: string) {
  const { data, error } = await supabase
    .from("post")
    .insert({
      content,
    })
    .select()
    .single(); // insert는 원래 return data가 없으니까 select해서 data가져오기
  if (error) throw error;
  return data;
}

// Partial타입으로 값하나만 업데이트 하도록
// 단, 인터섹션타입으로 id를 추가하여, id는 꼭 추가하도록
export async function updatePost(post: Partial<PostEntity> & { id: number }) {
  const { data, error } = await supabase
    .from("post")
    .update(post)
    .eq("id", post.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePost(id: number) {
  const { data, error } = await supabase
    .from("post")
    .delete()
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createPostWithImages({
  content,
  images,
  userId,
}: {
  content: string;
  images: File[];
  userId: string;
}) {
  // post insert
  const post = await createPost(content);
  if (images.length === 0) return post;
  try {
    // image upload 병렬처리
    // return되는 업로드 비동기함수 배열이 Promise.all에 의해 병렬처리
    const imageUrls = await Promise.all(
      images.map((image) => {
        const fileExtension = image.name.split(".").pop() || "webp";
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `${userId}/${post.id}/${fileName}`;
        return uploadImage({
          file: image,
          filePath,
        });
      }),
    );
    // post table update
    const updatedPost = await updatePost({
      id: post.id,
      "image-urls": imageUrls,
    });
    return updatedPost;
  } catch (error) {
    await deletePost(post.id);
    throw error;
  }
}
