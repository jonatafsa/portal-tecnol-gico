import { child, get, getDatabase, onValue, ref as databaseRef, remove, set as databaseSet, update } from 'firebase/database'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from '../styles/components/comments.module.css'

import empty from '../assets/empty.svg'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { BiTrashAlt } from 'react-icons/bi'
import { FaWindowClose } from 'react-icons/fa'

const Comments = ({ post }: any) => {

  const { user } = useAuth()

  const [comments, setComments] = useState<any[] | null>()
  const [comment, setComment] = useState('')
  const [token, setToken] = useState(true)
  const [commentId, setCommentId] = useState('')

  useEffect(() => {
    console.log(user)
    const db = getDatabase()
    const dbRef = databaseRef(db, 'posts/' + post.slug + '/comments')

    onValue(dbRef, (snapshot) => {

      if (snapshot.exists()) {
        const getComments = Object.entries(snapshot.val())
        console.log(getComments)
        setComments(getComments)
      } else {
        setComments(null)
      }

    })

  }, [post.slug])

  useEffect(() => {
    const token = Cookies.get('token')

    if (token) {
      setToken(false)
    }
  }, [])

  const sendComment = async () => {
    const dbRef = getDatabase()
    await update(databaseRef(dbRef, `posts/${post.slug}/comments/${new Date()}`), {
      user: user?.displayName,
      avatar: user?.photoURL,
      comment,
      uid: user?.uid
    }).then(res => {
      toast.success('Comentário feio com sucesso')
      setComment('')
    }).catch(err => {
      toast.error(`Erro ao comentar, contacte o administrador do site com esse código de err ${err.code}`)
    })

  }

  const deleteComment = (id: string) => {
    const db = getDatabase()
    const dbRef = databaseRef(db, 'posts/' + post.slug + '/comments/' + id)
    console.log(id)

    remove(dbRef).then(() => {
      toast.success('Comentário apagado com sucesso')
    }).catch(error => toast.error(`Erro ao deletar comentário, ${error.message}`))
  }

   //Função que abre/fecha o modal
   const modalToggle = (modalID: string) => {

    const modal: HTMLElement | null = document.querySelector('#' + modalID)

    if (modal?.style.display === 'flex') {
      modal.style.display = 'none'
      modal.style.opacity = '0'

      return
    }

    modal!.style.display = 'flex'
    modal!.style.opacity = '1'
    return
  }

  return (
    <div className={styles.container}>
      <h3>Comentários</h3>
      <textarea value={comment} onChange={(e: any) => setComment(e.target.value)}></textarea>

      <div className={styles.commentValidate}>
        {Cookies.get('token') ? (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: `<img src='${user?.photoURL || "https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png"}' alt='Avatar' />`
              }}
            />

            <p>{user?.displayName}</p>
          </>
        ) : (
          <span>Para enviar uma pergunta, <a href="../../account/signin">faça seu login</a></span>
        )}
        <button disabled={token} onClick={sendComment}>Enviar pergunta</button>
      </div>

      {!comments ? (
        <div className={styles.commentEmpty}>
          <Image src={empty} alt="empty" />
          <h4>Nenhum comentário por aqui</h4>
          <p>Faça o seu login e seja a primeira pessoa a comentar</p>
        </div>
      ) : (
        comments?.map(result => (
          <div className={styles.comment} key={result.comments}>
            <p className={styles.date}>{new Date(result[0]).toLocaleDateString('pt-BR')}</p>
            <p>{result[1].comment}</p>
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: `<img src='${result[1].avatar || "https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png"}' alt='Avatar' />`
                }}
              />

              <p>{result[1].user || "Sem nome"}</p>
            </div>
            {result[1].uid === user?.uid ? (
              <BiTrashAlt
                className={styles.delete}
                size={35}
                onClick={() => {modalToggle("delete-modal"), setCommentId(result[0])}}
              />
            ) : ""}
          </div>
        ))
      )
      }


      <div className={styles.deleteModal} id="delete-modal">
        <div className={styles.modal_content}>
          <div className={styles.close_icon}>
            <FaWindowClose onClick={() => modalToggle("delete-modal")} />
          </div>

          <div className={styles.delete_user}>
            <h4>Essa função não é reversível</h4>
            <p>Deseja continuar?</p>
            <div className={styles.buttons}>
              <button className={styles.confirm} onClick={() => { deleteComment(commentId), modalToggle("delete-modal") }}>Sim</button>
              <button onClick={() => modalToggle("delete-modal")}>Não</button>
            </div>
          </div>

        </div>
      </div>

    </div >
  )
}
export default Comments