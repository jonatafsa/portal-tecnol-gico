import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/users.module.css'

import google from '../../assets/google.svg'

import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { useRouter } from "next/router"

const Login: NextPage = () => {

  const Router = useRouter()
  const { loginWithEmail, loginWithGoogle } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  if (typeof window !== "undefined") {

    const token = Cookies.get('token')

    if (token) {
      Router.replace("/account/user")
      return null
    }
  }

  const toggleLoginWithEmail = (e: FormEvent) => {
    e.preventDefault()

    if (email === "") {
      toast.error('O E-mail é obrigatório')
      return
    }
    if (password === "" || password.length < 5) {
      toast.error('Essa senha é muito curta')
      return
    }

    loginWithEmail(email, password)

    return
  }

  if (typeof window !== 'undefined') {
    document.body.classList.add("dark")
  }

  return (
    <div className={styles.container}>

      <div className={styles.haveAccount}>
        <div onClick={() => Router.back()} className={styles.back}> Voltar</div>

        <div>
          <p>Não tem uma conta?</p>
          <Link href="./register">
            <a>Cadastre-se</a>
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <h2>Entre na sua conta</h2>

        <button onClick={loginWithGoogle} className="btnGoogle">
          <Image width="30" height="30" src={google} alt="" />
          Entrar com o Google
        </button>

        <hr className={styles.divider} />

        <form>
          <label htmlFor="mail">Email</label>
          <input
            type="text"
            placeholder="example@mail.com.br"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />

          <div className={styles.formFooter}>
            <p>Esqueceu a senha ? <a href="./account/reset-password">Clique aqui para recuperar</a></p>

            <button onClick={toggleLoginWithEmail}>Entrar</button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default Login