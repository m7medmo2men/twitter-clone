export type Post = {
  id?: number;
  content?: string;
  pinned?: boolean;
  userId?: number;
  parentTweetId?: number;
};
