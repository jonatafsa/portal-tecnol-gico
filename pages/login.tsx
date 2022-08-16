import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { FormEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useAuth } from "../context/AuthContext"

import styles from '../styles/login.module.css'

export default function Login() {
  const Router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { loginWithEmail, loginWithGoogle } = useAuth()

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

  if (typeof window !== "undefined") {

    const token = Cookies.get('token')

    if (token) {
      Router.replace("/admin")
    } else {
      return (
        <div className={styles.container}>
          <form onSubmit={toggleLoginWithEmail} method="post">
            <h3 className="sub-heading">Entre com seu email e senha</h3>
            <input
              type="text"
              placeholder="E-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button type="submit" value="Entrar" className="btn" >Entrar</button>
          </form>
        </div>
      )
    }
  }
}