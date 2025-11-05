import { type Database } from "@/database.types";

export type PostEntity = Database["public"]["Tables"]["post"]["Row"];

export type ProfileEntitiy = Database["public"]["Tables"]["profile"]["Row"];

export type Post = PostEntity & { author: ProfileEntitiy };

export type UseMutationCallback = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onMutate?: () => void;
  onSettled?: () => void;
};
