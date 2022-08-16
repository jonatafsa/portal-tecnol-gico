import { createContext, FC, useContext, useEffect, useState } from 'react'
import {
  User,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth'
import { get, getDatabase, ref, set } from 'firebase/database'
import Cookies from 'js-cookie'
import app from '../lib/Firebase'

import Router from 'next/router'
import { toast } from 'react-toastify'

interface newUser {
  email: string,
  password: string,
  name: string,
  surname: string,
  state: string,
  city: string,
  uid: string
}

interface IAuth {
  user: User | null
  loginWithGoogle: () => void
  createAccountWithEmail: (user: newUser) => void,
  loginWithEmail: (email: string, password: string) => void
  requestNewPassword: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<IAuth>({
  user: null,
  loginWithGoogle: () => { },
  createAccountWithEmail: (user: newUser) => { },
  loginWithEmail: (email: string, password: string) => { },
  requestNewPassword: (email: string) => { },
  logout: () => { }
})

const auth = getAuth(app)

const AuthProvider: any = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)

        Cookies.set('token', user.refreshToken)
        Cookies.set('avatar', String(user.photoURL))

      } else {
        setUser(null)
      }
    })

    return unsubscribe
  }, [])

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider())
      .then(response => {

        const name: any = response.user.displayName?.split(" ")

        const db = getDatabase()
        get(ref(db, 'users/' + response.user.uid))
          .then(snapshot => {
            if (snapshot.exists()) {
              Router.replace('/')
            } else {
              const db = getDatabase()
              set(ref(db, 'users/' + response.user.uid), {
                name: name[0],
                surname: name[1] || "",
                phone: response.user.phoneNumber,
                email: response.user.email,
                uid: response.user.uid
              })
            }
          })

        Router.replace('/account/user')
      })
      .catch(error => {
        console.log(error)
      })
  }

  const createAccountWithEmail = async (user: newUser) => {
    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then(response => {
        console.log(response)

        updateProfile(auth.currentUser!, {
          displayName: user.name,
          photoURL: 'https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png'
        })

        const db = getDatabase()
        set(ref(db, 'users/' + response.user.uid), {
          name: user.name,
          surname: user.surname,
          state: user.state,
          city: user.city,
          email: user.email,
          uid: response.user.uid
        })

        sendEmailVerification(auth.currentUser!)

        Cookies.set('token', response.user.refreshToken)
        Cookies.set('avatar', String(response.user.photoURL))

        Router.replace('/account/user')
      })
      .catch((error) => {
        const errorCode = error.code

        if (errorCode === 'auth/email-already-in-use') {
          toast.error('Este E-mail já está sendo usado')
        }

        if (error.code === 'auth/invalid-email') {
          toast.error('Digite o E-mail corretamente')
        }
      })
  }

  const loginWithEmail = async (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Router.replace('/')
      })
      .catch(error => {
        console.log(error)

        if (error.code === 'auth/wrong-password') {
          toast.error('A senha digitada está incorreta')
        }

        if (error.code === 'auth/user-not-found') {
          toast.error('Usuário não encontrado')
        }

        if (error.code === 'auth/invalid-email') {
          toast.error('Digite um E-mail válido')
        }
      })
  }

  const requestNewPassword = async (email: string) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Router.replace('/account/confirm-reset')
      })
      .catch(error => {
        console.log(error)

        if (error.code === 'auth/user-not-found') {
          toast.error('Email de usuário não encontrado')
        }

        if (error.code === 'auth/invalid-email') {
          toast.error('Digite um E-mail válido')
        }
      })
  }

  const logout = async () => {
    await signOut(auth)
      .then(() => {
        toast.success('Você saiu com êxito do sistema!')
        console.log(user)

        Cookies.remove('token')
        Cookies.remove('avatar')

        Router.replace('/')
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <AuthContext.Provider value={{
      user,
      loginWithGoogle,
      createAccountWithEmail,
      loginWithEmail,
      requestNewPassword,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }