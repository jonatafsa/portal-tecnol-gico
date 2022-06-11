import { useEffect, useState } from 'react'
import { BiTimeFive } from 'react-icons/bi'
import { getAllPosts } from '../pages/api/posts'
import styles from '../styles/components/featuredArticles.module.css'
import Loading from './loading'

export default function FeaturedArticles() {

  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPosts()
  }, [])

  const getPosts = async () => {
    const posts = await getAllPosts()
    setPosts(JSON.parse(JSON.stringify(posts)))
    return setLoading(false)
  }

  return (
    <div className={styles.featuredArticles}>
      <h2>Destaques</h2>

      {loading === true ? (
        <Loading />
      ) : (
        posts.map(post => (
          post.emphasis === true ? (
            <div className={styles.post} key={post.slug}>
            <div className={styles.postImg}>
              <img src={post.thumbnail} alt="" />
            </div>

            <div className={styles.postDetails}>

              <h3 className="title">
                {post.title}
              </h3>

              <p><BiTimeFive /> {post.date}</p>
            </div>
          </div>
          ) : ""
        ))
      )}

    </div>
  )
}