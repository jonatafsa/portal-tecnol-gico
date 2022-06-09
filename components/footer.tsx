import { AiFillInstagram, AiFillYoutube } from 'react-icons/ai'
import { FaFacebookSquare, FaRssSquare, FaTwitch } from 'react-icons/fa'
import styles from '../styles/components/footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="min-box-container">
        <a href="#" className="logo"> <span>JS</span> - Portal de no<span>tícia</span></a>

        <div className={styles.socialMedia}>
          <AiFillInstagram className={styles.btn} />
          <FaFacebookSquare className={styles.btn} />
          <FaRssSquare className={styles.btn} />
          <FaTwitch className={styles.btn} />
          <AiFillYoutube className={styles.btn} />
        </div>
      </div>

      <div className="min-box-container">
        <ul>
          <li>QUEM SOMOS</li>
          <li>EQUIPE</li>
          <li>PUBLICIDADE</li>
          <li>FALE CONOSCO</li>
          <li>CONDIÇÕES DE USO</li>
          <li>POLÍTICA DE PRIVACIDADE</li>
        </ul>
      </div>

      <div className={styles.end}>
        COPYRIGHT © 2022 js-portal.com.br. 
        TODOS OS DIREITOS RESERVADOS. 
        JS-PORTAL É UMA MARCA REGISTRADA DA JS PORTAL LTDA.
      </div>
    </footer>
  )
}