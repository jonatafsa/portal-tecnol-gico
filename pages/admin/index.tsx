import { FormEvent, useEffect, useState } from 'react'
import styles from '../../styles/Admin.module.css'
// import { toast } from 'react-toastify'

// import axios from 'axios'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { toast } from 'react-toastify'
import axios from 'axios'
import app from '../../lib/Firebase'
import { getDatabase, onValue, ref as databaseRef, update } from 'firebase/database'

import { GiRoundStar } from 'react-icons/gi'
import { BsCircleFill } from 'react-icons/bs'
import { FcDeleteDatabase } from 'react-icons/fc'

import { getAllPosts } from '../api/posts'

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
    favorite: boolean
    emphasis: boolean
  }>
}

export default function Admin(props: PostsProps) {

  const [post, setPost] = useState<any>()
  const [image, setImage] = useState<any>()
  const [progress, setProgress] = useState("")

  const [categories, setCategories] = useState<any[]>([])
  const [category, setCategory] = useState("")
  const [color, setColor] = useState("")
  const [modalProps, setModalProps] = useState("")
  const [slug, setSlug] = useState("")

  const objectOfCategories: any = {}

  useEffect(() => {
    const db = getDatabase()
    const dbRef = databaseRef(db, "categories")

    onValue(dbRef, res => {
      if (res.exists()) {
        setCategories(Object.values(res.val()))
      }
    })
  }, [])

  const insertNewPost = async (e: FormEvent) => {
    e.preventDefault()

    if (post === undefined) {
      toast.error('A postagem não pode ser vazia')
      return
    }

    if (image === undefined) {
      toast.error('É necessário uma imagem de capa')
      return
    }

    const storage = getStorage(app)
    const storageRef = ref(storage, 'images/' + post[0].name.replaceAll(' ', '-').replace('.md', ''))

    await uploadBytes(storageRef, image[0]).then(res => {
      console.log(res)
    }).catch(error => {
      console.log(error)
    })

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: any) => {
        setProgress(`Progresso de upload: ${Math.round((event.loaded * 100) / event.total)}%`);
      },
    };

    var formData = new FormData()
    formData.append('file', post[0])

    await axios.post('/api/insertPost', formData, config).then(res => {
      if (res.data.status === 'success') {
        axios.post('/api/savePost', {
          fileName: res.data.filename,
          categories: objectOfCategories
        }).then(() => {
          toast.success('Postagem salva com sucesso!')
        }).catch(err => toast.error('Erro ao publicar, ' + err.code))
      }
      console.log(res)
    })
      .catch(err => console.log(err))
  }

  const categoryToggle = () => {
    const admin = document.querySelector(".admin")
    admin?.classList.toggle("open")
    setModalProps("insert-categorories")
  }

  const insertNewCategory = (e: FormEvent) => {
    e.preventDefault()

    const db = getDatabase()
    const dbRef = databaseRef(db, "categories")

    update(dbRef, {
      [category]: {
        category,
        color
      }
    })

    toast.success("Nova categoria inserida.")

    return categoryToggle()
  }

  const defineCategories = (e: any) => {
    if (e.target.checked === true) {
      objectOfCategories[e.target.name] = {
        name: e.target.name,
        color: e.target.classList[0]
      }
    } else {
      delete objectOfCategories[e.target.name]
    }
    console.log(objectOfCategories)
  }

  const favoritePost = (slug: string, favorite: boolean) => {
    const db = getDatabase()
    const dbRef = databaseRef(db, "posts/" + slug)
    const star = document.querySelector("#" + slug + "-star")

    if (favorite === true) {
      update(dbRef, { favorite: false })
        .then(res => {
          star?.classList.remove("active-yellow")
          toast.success("Postagem removida da parte fixa")
        })
    } else {
      update(dbRef, { favorite: true })
        .then(res => {
          star?.classList.add("active-yellow")
          toast.success("Postagem definida como fixa")
        })
    }
  }

  const highlightPost = (slug: string, emphasis: boolean) => {
    const db = getDatabase()
    const dbRef = databaseRef(db, "posts/" + slug)
    const circle = document.querySelector("#" + slug + "-circle")

    if (emphasis === true) {
      update(dbRef, { emphasis: false })
        .then(res => {
          circle?.classList.remove("active-green")
          toast.success("Postagem removida dos destaques")
        })
    } else {
      update(dbRef, { emphasis: true })
        .then(res => {
          circle?.classList.add("active-green")
          toast.success("Postagem definida como destaque")
        })
    }
  }

  const modalDelete = (slug: string) => {
    const admin = document.querySelector(".admin")
    admin?.classList.toggle("open")
    setModalProps("delete")
    setSlug(slug)
  }

  const deletePost = () => {
    const admin = document.querySelector(".admin")
    const div = document.querySelector("#" + slug)
    
    div?.classList.add("hide")
    admin?.classList.toggle("open")

    const db = getDatabase()
    const dbRef = databaseRef(db, "posts/" + slug)

    update(dbRef, {status: "excluded"})
    .then(() => {
      toast.success("Postagem Excluida")
    })
  }

  if (typeof window !== 'undefined') {
    document.body.classList.add("dark")
  }

  return (
    <div className={`${styles.container} admin`}>
      <div className={styles.progress}>
        {progress}
      </div>

      <div className={styles.insertPost}>
        <form encType="multipart/form-data">
          <h2>Coloque os dados da sua postagem</h2>

          <div className={styles.formElement}>
            <label htmlFor="file-upload-post" className={styles.fileUpload}>Selecione o arquivo de pestagem</label>
            <input
              type="file"
              onChange={(e: any) => setPost(e.target.files)}
              id="file-upload-post"
              accept='.md'
            />
          </div>

          <div className={styles.formElement}>
            <label htmlFor="file-upload-image" className={styles.fileUpload}>Selecione uma imagem de capa da postagem</label>
            <input
              type="file"
              onChange={(e: any) => setImage(e.target.files)}
              id="file-upload-image"
              accept="image/png, image/jpeg"
            />
          </div>

          <div className={styles.tags}>
            <ul className="ks-cboxtags">
              <h4>Marque a(s) categorias da postagem</h4>

              {categories.map(item => (
                <li>
                  <input
                    type="checkbox"
                    id={item.category}
                    value={item.category}
                    name={item.category}
                    className={item.color}
                    onClick={defineCategories}
                  />
                  <label htmlFor={item.category}>{item.category}</label>
                </li>
              ))}

              <button type="button" className="st1" onClick={categoryToggle}> ++ Adicionar categoria</button>
            </ul>


          </div>

          <button onClick={insertNewPost}>Inserir nova postagem</button>
        </form>

      </div>

      <div className={styles.favoritePosts}>
        <h2>Selecione as postagens em destaque</h2>

        {props.posts.map(post => (
          <div className={styles.post} id={post.slug}>
            <div className={styles.actions}>
              <span>
                {post.favorite === true ? (
                  <GiRoundStar
                    className="active-yellow"
                    onClick={() => favoritePost(post.slug, post.favorite)}
                    id={`${post.slug}-star`}
                  />
                ) : (
                  <GiRoundStar
                    onClick={() => favoritePost(post.slug, post.favorite)}
                    id={`${post.slug}-star`}
                  />
                )}
              </span>

              <span>
                {post.emphasis === true ? (
                  <BsCircleFill
                    className="active-green"
                    style={{
                      fontSize: "1.4rem"
                    }}
                    onClick={() => highlightPost(post.slug, post.emphasis)}
                    id={`${post.slug}-circle`}
                  />
                ) : (
                  <BsCircleFill onClick={() => highlightPost(post.slug, post.emphasis)} id={`${post.slug}-circle`} />
                )}
              </span>
            </div>
            <span>{post.date}</span>
            <span>{post.title}</span>
            <FcDeleteDatabase
              size={26}
              onClick={() => modalDelete(post.slug)}
            />
          </div>
        ))}
      </div>

      <div className="modal">
        <div className="modalOverlay" onClick={categoryToggle}></div>
        <div className="insertCategoryForm">
          {modalProps === "insert-categorories" ? (
            <form>
              <h3>Nome da categoria</h3>
              <select onChange={(e) => setColor(e.target.value)}>
                <option value="" defaultValue="" selected>Selecione uma cor de fundo</option>
                <option value="red" className="red">Vermelho</option>
                <option value="blue" className="blue">Azul</option>
                <option value="green" className="green">Verde</option>
                <option value="yellow" className="yellow">Amarelo</option>
                <option value="gray" className="gray">Cinza</option>
                <option value="black" className="black">Preto</option>
              </select>
              <input
                type="text"
                placeholder="Nome da categoria"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              />

              <div className="buttons">
                <button className="btn" type="button" onClick={insertNewCategory}>Inserir</button>
                <button className="btn-secondary" type="button" onClick={categoryToggle}>Cancelar</button>
              </div>
            </form>
          ) : ""}

          {modalProps === "delete" ? (
            <form>
              <h3>Tem certeza que deseja excluir essa postagem?</h3>

              <div className="buttons">
                <button className="btn" type="button" onClick={deletePost}>Inserir</button>
                <button className="btn-secondary" type="button" onClick={categoryToggle}>Cancelar</button>
              </div>
            </form>
          ) : ""}
        </div>
      </div>
    </div>
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
