export type User = {
  id: string;
  email: string;
  [key: string]: unknown;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
};
