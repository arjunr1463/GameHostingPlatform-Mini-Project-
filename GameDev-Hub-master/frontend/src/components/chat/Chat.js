import React, { useState, useEffect, useContext, useRef } from 'react';
import io from 'socket.io-client';
import './Chat.css';
import ChatIcon from '@material-ui/icons/Chat';
import CancelIcon from '@material-ui/icons/Cancel';
import { UserContext } from '../Context/UserContext';

//wss://gamehalt.herokuapp.com
const socket = io('wss://gamehalt.herokuapp.com', {
    transports: ['websocket'],
    forceNew: false
})


function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setAllMessages] = useState([]);
    const [chatExp, setChatExp] = useState(false);
    const [currentUser, setCurrentUser] = useContext(UserContext);
    const element = useRef(null);


    useEffect(() => {
        socket.on('incoming-msg', (data) => {
            setAllMessages([...messages, data]);
            element.current.scrollTop = element.current.scrollHeight;
        })
        return () => {
            socket.off();
        }
    }, [messages]);


    return (

        (!chatExp) ? (
            <ChatIcon className="chatIcon" onClick={() => { setChatExp(!chatExp) }} />
        ) : (
                <div className="chat">
                    <div className="chatClose">
                        <CancelIcon className="chatCloseIcon" onClick={() => { setChatExp(!chatExp) }} />
                    </div>
                    <div ref={element} className="chatScreen">
                        {
                            messages.map(msg => (
                                (msg.username === currentUser) ? (
                                    <div className="mymsg">
                                        <div className="chatUsername">
                                            {
                                                msg.username == 'User' ? (
                                                    <h5>@{localStorage.getItem('user')}</h5>
                                                ) : (
                                                    <h5>@{msg.username}</h5>
                                                )
                                            }
                                        </div>
                                        <h3>{msg.message}</h3>
                                    </div>
                                ) : (
                                        <div className="othermsg">
                                            <div className="chatUsername">
                                                <h5>@{msg.username}</h5>
                                            </div>
                                            <h3>{msg.message}</h3>
                                        </div>
                                    )
                            ))
                        }
                    </div>
                    <div className="enterMsg">
                        <form className="enterMsgForm" onSubmit={(e) => {
                            e.preventDefault();
                            if (message) {
                                socket.emit('message', {
                                    message: message,
                                    username: currentUser
                                })
                                setMessage('');
                            }
                        }

                        }>
                            <input autoFocus placeholder='Type your message..' onChange={(e) => { setMessage(e.target.value) }} value={message} type="text" />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>
            )

    )
}

export default Chat;
