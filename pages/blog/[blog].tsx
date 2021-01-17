import React from 'react';
import { GetStaticPaths, GetStaticProps } from "next"
import glob from 'glob';
import { BlogPost } from '../../components/BlogPost';
import { loadPost, PostData } from '../../loader';

const Post: React.FC<{post: PostData}> = ({ post }) => {
  return <BlogPost post={post} />;
}

export const getStaticPaths: GetStaticPaths = async (_context) => {
  const blogs = glob.sync('./md/blog/*.md');
  const slugs = blogs.map((file: string) => {
    const popped = file.split('/').pop();
    if (!popped) throw new Error(`Invalid blog path: ${file}`);
    return popped.slice(0, -3).trim();
  });

  const paths = slugs.map((slug) => `/blog/${slug}`);
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{post: PostData}, {blog: string}> = async ({ params }) => {
  const post = await loadPost(`blog/${params?.blog}.md`);
  return { props: { post } };
};

export default Post;
