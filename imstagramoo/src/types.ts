import { type Database } from "@/database.types";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];

export type ProfileEntitiy = Database["public"]["Tables"]["profile"]["Row"];

export type CommentEntitiy = Database["public"]["Tables"]["comment"]["Row"];

export type Post = PostEntity & { author: ProfileEntitiy; isLiked: boolean };
export type Comment = CommentEntitiy & { author: ProfileEntitiy };

export type UseMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
