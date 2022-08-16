import { useCallback, useEffect, useState } from 'react'
import styles from '../styles/components/navbar.module.css'
import { FaBars, FaFacebookSquare, FaRssSquare, FaTwitch } from 'react-icons/fa'
import { AiFillInstagram, AiFillYoutube, AiOutlineCloseCircle } from 'react-icons/ai'
import Link from 'next/link'
import { IoMdArrowDropdown } from 'react-icons/io'
import { get, getDatabase, ref } from 'firebase/database'

export default function Navbar() {

  const [pageYOffset, setPageYOffset] = useState(0)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    //firebase get database
    const db = getDatabase()
    const DbRef = ref(db, '/categories')

    get(DbRef).then(res => setCategories(res.val()))

    //Pega o offset do scroll
    window.addEventListener('scroll', () => {
      setPageYOffset(window.pageYOffset)
    })
  }, [])

  // useEventListener(undefined, 'scroll', () => {
  //   setPageYOffset(window.pageYOffset)
  // })

  if (pageYOffset > 0 && typeof document !== 'undefined') {
    const nav = document.querySelector("#nav")
    nav?.classList.add("scrolled")
    nav?.classList.remove("not-scrolled")
  }
  if (pageYOffset === 0 && typeof document !== 'undefined') {
    const nav = document.querySelector("#nav")
    nav?.classList.remove("scrolled")
    nav?.classList.add("not-scrolled")
  }

  function toggleMenu() {
    const menu = document.querySelector("#menu")
    const nav = document.querySelector(".nav")
    menu?.classList.toggle("toggleMenuOpen")
    nav?.classList.toggle("open")
  }

  const categoriesToggle = (e: any) => {
    const categories = document.querySelector(".categories")
    categories?.classList.toggle("categoriesToggle")
  }

  return (
    <div className={`${styles.container} not-scrolled nav`} id="nav">
      <div className={styles.bars}>
        <FaBars onClick={toggleMenu} className={styles.btn} />
        <Link href="/">
          <a className={styles.logo}> <span>JS</span> - Portal de no<span>tícia</span></a>
        </Link>
      </div>

      <div className={styles.socialMedia}>
        <AiFillInstagram className={styles.insta} />
        <FaFacebookSquare className={styles.face} />
        <FaRssSquare className={styles.rss} />
        <FaTwitch className={styles.twitch} />
        <AiFillYoutube className={styles.youtube} />
      </div>

      <div className="toggleMenu" id="menu">
        <AiOutlineCloseCircle onClick={toggleMenu} className="close" />

        <Link href="/"><a>Voltar ao início</a></Link>
        <span
          onClick={categoriesToggle}
        >Categorias <IoMdArrowDropdown size={25} />
        </span>

        <ul className="categories">
          {Object.values(categories).map((category: any, index) => (
            <Link href={`/categories?${category.category}`}>
            <li
              className={category.color}
              key={index}
            >
              {category.category}
            </li>
            </Link>
          ))}
        </ul>

      </div>

      <div className="modal" onClick={toggleMenu}>
        <div className="modalOverlay"></div>
      </div>
    </div>
  )
}

// export const useEventListener = (
//   target: EventTarget | undefined,
//   event: string,
//   listener: EventListenerOrEventListenerObject,
//   trigger = true
// ): void => {
//   useEffect(() => {
//     const t = target || window
//     t.addEventListener(event, listener);
//     trigger && t.dispatchEvent(new Event(event));
//     return () => t.removeEventListener(event, listener);
//   });
// };