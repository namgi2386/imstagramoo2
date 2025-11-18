export const QUERY_KEYS = {
  profile: {
    all: ["profile"],
    list: ["profile", "list"],
    byId: (userId: string) => ["profile", "byId", userId],
  },
  post: {
    all: ["post"],
    list: ["post", "list"],
    userList: (userId: string) => ["post", "userList", userId],
    byId: (postId: number) => ["post", "byId", postId],
  },
  comment: {
    all: ["comment"],
    post: (postId: number) => ["comment", "post", postId],
    root: (postId: number) => ["comment", "root", postId],
    replies: (postId: number, rootCommentId: number) => [
      "comment",
      "replies",
      postId,
      rootCommentId,
    ],
    byId: (commentId: number) => ["comment", "byId", commentId],
  },
};
export const BUCKET_NAME = "uploads";
export const MAX_COMMENT_DEPTH = 3;
