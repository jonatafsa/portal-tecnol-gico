import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'

import { AiOutlineMessage } from 'react-icons/ai'
import { BiTimeFive } from 'react-icons/bi'

import { getAllPosts } from './api/posts'
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

interface headerPosts {
  slug: string
  title: string
  description: string
  thumbnail: string
  category: any
  by: string
  avatar: string
  date: string
  favorite: string
}

export default function Home(props: PostsProps) {

  const [headerTopPosts, setHeaderTopPosts] = useState<headerPosts[]>([])
  const [headerBottomPosts, setHeaderBottomPosts] = useState<headerPosts[]>([])
  const [postsByDate, setPostsByDate] = useState<headerPosts[]>([])

  useEffect(() => {
    let headerTopPosts: headerPosts[] = []
    let headerBottomPosts: headerPosts[] = []

    props.posts.map(post => {
      if (post.slug === 'AMD-Ryzen-3-4100' || post.slug === 'Call-of-Duty-retorna-oficialmente-ao-Steam-com-Modern-Warfare-2') {
        headerTopPosts.push(post)
      }

      if (post.slug === 'O-fim-de-uma-era-em-Pokemon'
        || post.slug === 'A-queda-do-NFT-e-real'
        || post.slug === 'Musk-agora-terá-acesso-a-esses-dados-do-twitter') {
        headerBottomPosts.push(post)
      }
    })

    setHeaderBottomPosts(headerBottomPosts)
    setHeaderTopPosts(headerTopPosts)

    const ordened = props.posts.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date).getDate() - new Date(a.date).getDate()
    })

  setPostsByDate(ordened)
  }, [])

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
        <div className={styles.mainHeader} id="highlights">
          <div className={styles.topMainHeader}>

            {headerTopPosts.map(post => (
              <Link href={`${post.slug}`} key={post.slug}>
                <div className={styles.post}>
                  <div className={styles.postImg}>
                    <img src={post.thumbnail} alt="Post Name" />
                  </div>
                  <span>{post.title}</span>
                </div>
              </Link>
            ))}

          </div>

          <div className={styles.footerMainHeader}>

            {headerBottomPosts.map(post => (
              <Link href={`${post.slug}`} key={post.slug}>
                <div className={styles.post}>
                  <div className={styles.postImg}>
                    <img src={post.thumbnail} alt="Post Name" />
                  </div>
                  <span>{post.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className={styles.highlight} id="highlight">
          <h2>Fique por dentro!</h2>

          {props.posts.map(post => (
            post.slug === "The-Last-of-Us-Part-1-Remake-é-confirmado-com-lançamento-em-setembro-para-PC-e-PS5" ? (
              <Link href={`${post.slug}`} key={post.slug}>
                <div className={styles.post}>
                  <div className={styles.postImg}>
                    <img src={post.thumbnail} alt={post.title} />
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

                    <h3 className={styles.title}> {post.title} </h3>
                    <p className={styles.description}> {post.description} </p>

                    <div className={styles.postFooter}>
                      <p><BiTimeFive /> {post.date}</p>
                      <p><AiOutlineMessage /> 02 comentários</p>
                    </div>
                  </div>
                </div>
              </Link>
            ) : ""
          ))}
        </div>

        <div className={styles.articles} id="articles">
          <div className={styles.fullArticles}>
            <h2>Todas as postagens</h2>

            {postsByDate.map(post => (
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
            ))}

          </div>

          <FeaturedArticles />
        </div>

      </main >

      <Footer />
    </div >
  )
}

export async function getStaticProps() {
  const allPosts = await getAllPosts()

  return {
    props: {
      posts: JSON.parse(JSON.stringify(allPosts)),
    }
  }
}

