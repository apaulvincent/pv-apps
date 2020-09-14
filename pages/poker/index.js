import { useState, useEffect } from 'react'

import Head from 'next/head'
import styles from '../../styles/Home.module.scss'

import Link from 'next/link'

import { v4 as uuidv4 } from 'uuid';


export default function Poker() {

    const [guid, setGuid] = useState(null);

    const newGuid = () => {
        setGuid(uuidv4())
    }

    return (
        <div className={styles.container}>
        <Head>
            <title>PV Poker</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
            
            <h1 className={styles.title}> Poker </h1>

            <br/>

            <button onClick={newGuid}>Create a Room</button>

            <br/>

            {
                guid ? 
                <Link href={`/poker/${guid}`} target="blank">Join</Link> : 
                null
            }
        
        </main>

        <footer className={styles.footer}>
            <span>
            Powered by <strong>PV</strong>
            </span>
        </footer>


        </div>
    )
}
