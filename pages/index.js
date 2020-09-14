import Head from 'next/head'
import styles from '../styles/Home.module.scss'

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

      <main className={styles.main}>
        
        <h1 className={styles.title}>
          Welcome
        </h1>

        <br/>

        <Link href="/poker">Poker</Link>
    
      </main>

      <footer className={styles.footer}>
        <span>
          Powered by <strong>PV</strong>
        </span>
      </footer>


    </div>
  )
}
