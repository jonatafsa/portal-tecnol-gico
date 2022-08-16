import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'

import { AiOutlineMessage } from 'react-icons/ai'
import { BiTimeFive } from 'react-icons/bi'

import { getPostByCategory } from './api/posts'
import Link from 'next/link'
import FeaturedArticles from '../components/featuredarticles'
import Footer from '../components/footer'
import { useEffect, useState } from 'react'

interface PostsProps {
  posts: Array<{
    slug: string
    title: string
    description: string
    thumbnail: string
    category: any
    by: string
    avatar: string
    date: string
    favorite: string
  }>
}

export default function Categories(props: PostsProps) {

  const [post, setPosts] = useState([])

  useEffect(() => {
    getPostsByCategory()
  }, [])

  const getPostsByCategory = async () => {
    
    const url = new URL(window.location.href)
    const params = url.search.replace("?", "")
    const posts = await getPostByCategory(params)
    // setPosts(posts)
    console.log("Posts: ", posts)
  }

  if (typeof window !== 'undefined') {
    document.body.classList.add("dark")
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>JS - Seu portal de notícias</title>
        <meta name="description" content="Portal de notícias sobre tecnologia." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className={styles.main}>

        <div className={styles.articles} id="articles">
          <div className={styles.fullArticles}>
            <h2>Todas as postagens</h2>

            {/* {postsByDate.map(post => (
              <Link href={`${post.slug}`} key={post.slug}>
                <div className={styles.post}>

                  <div className={styles.postImg}>
                    <img src={post.thumbnail} alt="" />
                  </div>

                  <div className={styles.postDetails}>
                    <div className={styles.tags}>
                      {!post.category ? "" : (
                        Object.values(post.category).map((category: any) => (
                          <>
                            <Link href={`categories/${category.name}`} key={category.name}>
                              <span className={category.color}>{category.name}</span>
                            </Link>
                          </>
                        ))
                      )}
                    </div>

                    <h3 className={styles.title}>
                      {post.title}
                    </h3>
                    <p className={styles.description}>
                      {post.description}
                    </p>

                    <div className={styles.postFooter}>
                      <p><BiTimeFive /> {post.date}</p>
                      <p><AiOutlineMessage /> 02 comentários</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))} */}

          </div>

          <FeaturedArticles />
        </div>

      </main >

      <Footer />
    </div >
  )
}
