import React from "react";
import PostLayout from "../_layouts/PostLayout";
import { getPostBySlug, getAllPosts } from './api/posts';
import { GetStaticPropsContext } from "next";

interface PostProps {
  slug: string
  title: string
  description: string
  thumbnail: string
  content: string
  category: any
  by: string
  avatar: string
  date: string
}

export default function Post(props: PostProps) {
  return (
    <PostLayout
      title={props.title}
      description={props.description}
      // thumbnailUrl={props.thumbnailUrl} 
      content={props.content}
      thumbnail={props.thumbnail}
      category={props.category}
      by={props.by}
      avatar={props.avatar}
      date={props.date}
      slug={props.slug}
    />
  )
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: await getPostBySlug(context.params?.slug)
  }
}

export async function getStaticPaths() {
  let paths: any = await getAllPosts()

  paths = paths.map((post: any) => {
    return {
      params: { slug: post.slug }
    }
  });

  return {
    paths: paths,
    fallback: false
  }
}