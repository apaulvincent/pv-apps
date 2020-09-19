import Head from 'next/head'
import styles from '../styles/Poker.module.scss'

import { useRouter } from 'next/router'

import Link from 'next/link'

export default function Home() {

  const router = useRouter()

  return (
    <div className={styles.container}>
      <Head>
        <title>PV Apps</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        
        <h1>
          Welcome
        </h1>

        <br/>

        <Link href="/poker">Poker</Link>
        <Link href="/im-good">I'm Good</Link>
    
      </main>

      <footer className={styles.footer}>
          <span>
          <strong>PV-APPS</strong>
          </span>
      </footer>

    </div>
  )
}
