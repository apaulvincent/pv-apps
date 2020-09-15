import { useState, useEffect } from 'react'
import io from 'socket.io-client'

import Head from 'next/head'
import styles from '../../styles/Home.module.scss'

import { useRouter } from 'next/router'

import AddUser from '../../components/AddUser'

const ioport = process.env.PORT || 9000
const path = process.env.NODE_ENV !== 'production' ? `http://localhost:${ioport}` : "https://pv-poker.herokuapp.com"
const socket = io(path);

export default function Room() {

  const router = useRouter()

  const {room} = router.query

  const [username, setUsername] = useState(null);

  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {

      socket.on("connect", () => {
        // Do somthing on connect
      });

      socket.on("connected", user => { 
        // Do somthing after connect
        console.log('connected: ', user)
      });

      socket.on("users", users => {
        setUsers(users);
      });

      socket.on("rooms", rooms => {
        console.log(rooms)
        setRooms(rooms);
      });

      socket.on("message", message => {
        setMessages(messages => [...messages, message]);
          console.log(message)
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

      let data = {
          username: user,
          room: room,
      }

      socket.emit("username", data);

      setUsername(user);
      
  };



  return (
    <div className={styles.container}>
      <Head>
        <title>PV Poker</title>
      </Head>

      <main className={styles.main}>
          {
            
            (username == null) ? 
              <AddUser onAddUser={addUser} />
            :
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
                  {rooms.map( name => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
            </div>
            </>
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
