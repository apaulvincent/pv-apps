import { useState, useEffect } from 'react'
import io from 'socket.io-client'

import Head from 'next/head'
import styles from '../../styles/Home.module.scss'
import Link from 'next/link'

import {getCookie, setCookie, deleteCookie} from '../../utils/cookie'

import AddUser from '../../components/AddUser'

import { v4 as uuidv4 } from 'uuid';

const socket = io(process.env.IOPATH);

export default function Poker({isBrowser}) {

    let userInCookie = {
        "name": null,
        "id": null,
        "room": null
    } 

    if(isBrowser){
        userInCookie = getCookie('pv-poker-user')
        if(userInCookie){
            userInCookie = JSON.parse(userInCookie)
        }
    }
    
    const [username, setUsername] = useState(userInCookie.name);
    const [user, setUser] = useState(userInCookie);

    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        socket.on("connect", () => {
            // Do somthing on connect
        });

        socket.on("connected", user => { 

            if(isBrowser){
                setCookie('pv-poker-user', JSON.stringify(user))
            }

            setUser(user);

        });

        socket.on("users", users => {
            setUsers(users);
        });

        socket.on("show-rooms", rooms => {
            setRooms(rooms);
        });

        socket.on("rooms", rooms => {
            setRooms(rooms);
        });

        socket.on("message", message => {
            setMessages(messages => [...messages, message]);
        });
    
        socket.on("disconnected", id => {
            setUsers(users => {
                return users.filter(user => user.id !== id);
            });
        });


    }, []);

    const submit = e => {
        e.preventDefault();
        socket.emit("send", message);
        setMessage("");
    };
  
    const addUser = (user) => {
        setUsername(user);
    };


    const onCreateRoom = (e) => {

        let room = uuidv4()
        
        let data = {
            username: username,
            room: room,
        }

        socket.emit("create-room", data);

    }

    const onJoinRoom = (room) => (e) => {

        let data = {
            username: username,
            room: room,
        }

        socket.emit("join-room", data);

    }

    const onLeaveThenJoinRoom = (room) => (e) => {

        let data = {
            username: username,
            room: room,
        }

        if(user){
            socket.emit("leave", user.room);
        }
        
        socket.emit("join-room", data);

    }

    return (
        <div className={styles.container}>
        <Head>
            <title>PV Poker</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>

        <h1 className={styles.title}> POC </h1>
        
        <br/>

        {
            (username == null) ? 
              <AddUser onAddUser={addUser} />
            : null
        }   

        {
            (username && user == null) ? 
            <>
                <button onClick={onCreateRoom}>Create a Room</button>

                <br/>
                    <p>or</p>
                <br/>

                <div>
                    <h3>Join Rooms</h3>
                    <ul>
                    {rooms.map( room => (
                        <li key={room} onClick={onJoinRoom(room)}>{room}</li>
                    ))}
                    </ul>
                </div>
            </> : null
        }

        {
            (username && user) ? 
            <>
            <div className="row">
              <div className="col-md-12 mt-4 mb-4">
                <h1 className={styles.title}>
                  Hello {username}
                </h1>
              </div>
            </div>
            <div className="col-md-8">
                  <h6>Messages</h6>
                  <div id="messages">
                    {messages.map(({ user, date, text }, index) => (
                      <div key={index} className="row mb-2">

                        <div className="col-md-2">{user.name ? user.name : 'foo'}</div>
                        <div className="col-md-2">{text}</div>

                      </div>
                    ))}
                  </div>
            </div>
            <div>
                <input
                    type="text"
                    onChange={e => setMessage(e.currentTarget.value)}
                    value={message}
                />
                <button onClick={submit} className="btn btn-primary">
                    Send
                </button>
            </div>
            <div className="col-md-4">
                <h6>Users</h6>
                <ul>
                  {users.map(({ name, id }) => (
                    <li key={id}>{name}</li>
                  ))}
                </ul>
            </div>

            <div className="col-md-4">
                <h6>Active Rooms</h6>
                <ul>
                  {rooms.map( room => (
                    <li key={room} onClick={onLeaveThenJoinRoom(room)}>{room}</li>
                  ))}
                </ul>
            </div>
            </> : null
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


Poker.getInitialProps = ({ req }) => {
    
    const isServer = !!req
    const isBrowser = !req

    return { isBrowser: isBrowser }

}