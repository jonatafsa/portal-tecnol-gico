import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/users.module.css'

import google from '../../assets/google.svg'

import Link from 'next/link'
import dataStates from '../../lib/states'
import { useAuth } from '../../context/AuthContext'
import { FormEvent, useState } from 'react'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'
import { useRouter } from "next/router"

import { BsCheckLg } from 'react-icons/bs'

const Login: NextPage = () => {

  const Router = useRouter()
  const { loginWithGoogle, createAccountWithEmail } = useAuth()

  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [state, setState] = useState(null)
  const [city, setCity] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accept, setAccept] = useState(false)

  if (typeof window !== "undefined") {

    const token = Cookies.get('token')

    if (token) {
      Router.replace("/account/user")
      return null
    }
  }

  const toggleRegisterUser = (e: FormEvent) => {
    e.preventDefault()

    if (name === '' || name.length < 3) {
      toast.error('Nome não pode ser vazio ou muito curto')
      return
    }
    if (surname === '' || surname.length < 5) {
      toast.error('Sobrenome não pode ser vazio ou muito curto')
      return
    }
    if (!state) {
      toast.error('Selecione seu estado e cidade')
      return
    }
    if (email === "") {
      toast.error('O E-mail é obrigatório')
      return
    }
    if (password === "" || password.length < 5) {
      toast.error('Essa senha é muito curta')
      return
    }

    const user = {
      email,
      password,
      name,
      surname,
      state,
      city,
      uid: ''
    }

    createAccountWithEmail(user)

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
          <p>Já tem uma conta?</p>
          <Link href="/login">
            <a>Entrar</a>
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <h2>Cadastre sua conta</h2>

        <button onClick={loginWithGoogle} className="btnGoogle">
          <Image width="30" height="30" src={google} alt="" />
          Entrar com o Google
        </button>

        <hr className={styles.divider} />

        <form>
          <div>
            <div className={styles.formElement}>
              <label htmlFor="name">Nome</label>
              <input type="text" placeholder="Jhon" onChange={(e: any) => setName(e.target.value)} />
            </div>

            <div className={styles.formElement}>
              <label htmlFor="sobrenome">Sobrenome</label>
              <input type="text" placeholder="Watsson" onChange={(e: any) => setSurname(e.target.value)} />
            </div>
          </div>

          <div>
            <div className={styles.formElement}>
              <label htmlFor="sobrenome">Estado</label>
              <select name="state" id="state" onChange={(e: any) => setState(e.target.value)}>
                <option value=""> </option>
                {dataStates.estados.map((state, index) => (
                  <option key={state.sigla} value={index} onClick={() => { console.log("Porra Fear") }}>{state.nome}</option>
                ))}
              </select>
            </div>

            <div className={styles.formElement}>
              <label htmlFor="city">Cidade</label>

              <select name="city" id="city" onChange={(e: any) => setCity(e.target.value)}>
                <option value=""> </option>
                {state ? (
                  <>
                    {dataStates.estados[state].cidades.map((selectCity, index) => (
                      <option key={index} value={selectCity}> {selectCity} </option>
                    ))}
                  </>
                ) : (
                  <option value=""> Selecione um estado </option>
                )}
              </select>
            </div>

          </div>

          <div className={styles.formElement2}>
            <label htmlFor="mail">Email</label>
            <input type="text" placeholder="Jhon@mail.com.br" onChange={(e: any) => setEmail(e.target.value)} />
          </div>

          <div className={styles.formElement2}>
            <label htmlFor="password">Senha</label>
            <input type="password" onChange={(e: any) => setPassword(e.target.value)} />
          </div>

          <div className={styles.formElementCheck}>
            <div>
              <input
                type="checkbox"
                className={styles.checkWithLabel}
                id="idinput"
                onChange={(e: any) => setAccept(e.target.checked)}
              />
              <label className={styles.labelForCheck} htmlFor="idinput">
                <BsCheckLg className={styles.checked} size={22} />
              </label>
            </div>
            <p>Criar uma conta significa que você concorda com nossos
              Termos de Serviço, Política de Privacidade e nossas
              Configurações de Notificação padrão.</p>
          </div>

          <button disabled={accept ? false : true} onClick={toggleRegisterUser}>Criar conta</button>
        </form>
      </div>

    </div>
  )
}

export default Login