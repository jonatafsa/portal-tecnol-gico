import Head from 'next/head'
import Link from 'next/link'
import FeaturedArticles from '../components/featuredarticles'
import Footer from '../components/footer'
import Navbar from '../components/navbar'

import styles from '../styles/Post.module.css'

interface PostLayoutProps {
  slug: string
  title: string
  description: string
  category: any
  thumbnail: string
  by: string
  avatar: string
  date: string
  content: string
}

export default function PostLayout(props: PostLayoutProps) {

  if (typeof window !== 'undefined') {
    document.body.classList.add("dark")
  }

  return (
    <>
      <Head>
        <title>{props.title}</title>

        <meta name="description" content={props.description} />

        <meta property="og:site_name" content="JS - Portal de notícias" />

        <meta property="og:title" content={props.title} />
        <meta property="og:description" content={props.description} />

        <meta property="og:image" content={props.thumbnail} />
        <meta property="og:image:type" content="image/png" />

        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={props.title} />
        <meta name="twitter:description" content={props.description} />
      </Head>

      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <section>
            <h2>{props.title}</h2>
            <article className={styles.article}>
              <div className={styles.postHeader}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<img src='${props.avatar}' alt='Avatar' />`
                  }}
                />

                <p><strong>Por:</strong> {props.by}</p>
                <p><strong>Postado em:</strong> {props.date}</p>
                <div className={styles.categories}>
                  {Object.values(props.category).map((category: any) => (
                    <Link href={`/category?${category.name}`}>
                      <a>
                        <span className={category.color}>{category.name}</span>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>

              <img src={props.thumbnail} className={styles.thumbnail} alt="" />

              <p className={styles.description}>{props.description}</p>

              <div dangerouslySetInnerHTML={{ __html: props.content }} className={styles.post} />
            </article>
          </section>

          <aside>
            <FeaturedArticles />
          </aside>
        </div>
      </div>
      <Footer />
    </>
  )
}