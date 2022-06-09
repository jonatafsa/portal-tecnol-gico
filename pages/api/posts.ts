import { get, getDatabase, onValue, ref as databaseRef } from 'firebase/database'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import matter from 'gray-matter'
import { marked } from 'marked'
import app from '../../lib/Firebase'

export async function getAllPosts() {
  const context = require.context('../../_posts', false, /\.md$/)
  const posts: any = []

  for (const key of context.keys()) {
    const post = key.slice(2)
    const content = await import(`../../_posts/${post}`)
    const meta = matter(content.default)
    const postName = String(post).replace('.md', '')
    const storage = getStorage(app)
    const storageRef = ref(storage, 'images/' + postName)
    var cover = ''

    await getDownloadURL(storageRef)
      .then(res => cover = res)
      .catch(err => cover = "image-not-found")

    const db = getDatabase()
    const dbRef = databaseRef(db, 'posts/' + postName)

    await get(dbRef).then(snapshot => {
        
      if (snapshot.exists() && snapshot.val().status !== 'excluded') {
        posts.push({
          slug: post.replace('.md', ''),
          title: meta.data.title,
          description: meta.data.description,
          thumbnail: cover,
          category: snapshot.val().categories,
          by: meta.data.by,
          avatar: meta.data.avatar,
          date: snapshot.val().date,
          favorite: snapshot.val().favorite || null,
          emphasis: snapshot.val().emphasis || null
        })
      }
    })

  }
//   console.log("Xablau")
  return posts
}

export async function getPostByCategory(category: any) {
  const context = require.context('../../_posts', false, /\.md$/)
  const posts: any = []

  for (const key of context.keys()) {
    const post = key.slice(2)
    const content = await import(`../../_posts/${post}`)
    const meta = matter(content.default)
    const postName = String(post).replace('.md', '')
    const storage = getStorage()
    const storageRef = ref(storage, 'images/' + postName)
    var cover = ''

    await getDownloadURL(storageRef)
      .then(res => cover = res)
      .catch(err => cover = "image-not-found")

    const db = getDatabase()
    const dbRef = databaseRef(db, 'posts/' + postName)

    if(meta.data.category === category) {
      await get(dbRef).then(snapshot => {        
        if (snapshot.val().status !== 'excluded') {
          posts.push({
            slug: post.replace('.md', ''),
            title: meta.data.title,
            description: meta.data.description,
            thumbnail: cover,
            category: meta.data.category,
            by: meta.data.by,
            avatar: meta.data.avatar,
            date: snapshot.val().date
          })
        }
      })
    }

  }

  return posts
}

export async function getFavoritePosts() {
  const context = require.context('../../_posts', false, /\.md$/)
  const posts: any = []

  for (const key of context.keys()) {
    const post = key.slice(2)
    const content = await import(`../../_posts/${post}`)
    const meta = matter(content.default)
    const postName = String(post).replace('.md', '')
    const storage = getStorage()
    const storageRef = ref(storage, 'images/' + postName)
    var cover = ''

    await getDownloadURL(storageRef)
      .then(res => cover = res)
      .catch(err => cover = "image-not-found")

    const db = getDatabase()
    const dbRef = databaseRef(db, 'posts/' + postName)

      await get(dbRef).then(snapshot => {        
        if (snapshot.val().status !== 'excluded') {
          if(snapshot.val().favorite === true) {
            posts.push({
              slug: post.replace('.md', ''),
              title: meta.data.title,
              description: meta.data.description,
              thumbnail: cover,
              category: meta.data.category,
              by: meta.data.by,
              avatar: meta.data.avatar,
              date: snapshot.val().date
            })
          }
        }
      })

  }

  return posts
}

export async function getPostBySlug(slug: any) {
  const fileContent = await import(`../../_posts/${slug}.md`)

  const meta = matter(fileContent.default)
  const content = marked(meta.content)


  const db = getDatabase()
  const dbRef = databaseRef(db, 'posts/' + slug)
  let date: any
  let categories: any

  await get(dbRef).then(snapshot => {
    if (snapshot.val().status !== 'excluded') {
      date = snapshot.val().date
      categories = snapshot.val().categories
    }
  })

  const storage = getStorage(app)
  const storageRef = ref(storage, 'images/' + slug)
  var cover = ''

  await getDownloadURL(storageRef)
    .then(res => cover = res)
    .catch(err => cover = "image-not-found")

  console.log("Xablau: "+ cover)

  return {
    title: meta.data.title,
    description: meta.data.description,
    content,
    thumbnail: cover,
    category: categories,
    by: meta.data.by,
    avatar: meta.data.avatar,
    date: date,
    slug
  }
}