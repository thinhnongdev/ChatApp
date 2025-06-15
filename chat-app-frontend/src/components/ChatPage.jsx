import React, { use, useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { MdAttachFile } from 'react-icons/md';
import useChatContext from '../context/ChatContext';
import { useNavigate } from 'react-router';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { baseURL } from '../config/AxiosHelper';
import { getMessagesApi } from '../services/RoomService';
import { getTimeAgo } from '../config/helper';

const ChatPage = () => {
    const navigate = useNavigate();
    const { roomCode, username, connected, setConnected, setRoomCode, setUsername } = useChatContext();

    useEffect(() => {
        if (!connected) {
            console.error("You are not connected to a chat room.");
            navigate('/');
            return;
        }
    }, [roomCode, username, connected]);



    const [messages, setMessages] = useState([
        // { sender: 'Thịnh Tiến', content: 'Hello, how are you?' },
        // { sender: 'Thịnh Tiến', content: 'I am fine, thank you!' },
        // { sender: 'Văn Điền', content: 'What about you?' },
        // { sender: 'Thịnh Tiến', content: 'I am doing great!' },
        // { sender: 'Thịnh Tiến', content: 'I am doing great!' },
        // { sender: 'Thịnh Tiến', content: 'I am doing great!' },
        // { sender: 'Thịnh Tiến', content: 'I am doing great!' },
        // { sender: 'Thịnh Tiến', content: 'I am doing great!' },
        // { sender: 'Thịnh Tiến', content: 'I am doing great!' },
        // { sender: 'Văn Điền', content: 'What about you?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const inputRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStopmClient] = useState(null);

    useEffect(() => {
        async function loadMessages() {
            try {
                const response = await getMessagesApi(roomCode);
                setMessages(response);
            } catch (error) {
                console.error("Error loading messages:", error);
            }
        }
        loadMessages();
    }, [])
    useEffect(() => {
        const connectWebSocket = () => {
            const sock = new SockJS(`${baseURL}/chat`)
            const client = Stomp.over(sock);
            client.connect({}, () => {
                setStopmClient(client);

                client.subscribe(`/topic/room/${roomCode}`, (message) => {
                    console.log("Received message:", message);
                    const newMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                })
                console.log("Connected to chat room:", roomCode);
            })
        }
        if (connected) {
            connectWebSocket();
        }
    }, [roomCode]);

    const sendMessage = async () => {
        if (stompClient && connected && roomCode && inputMessage.trim() !== '') {
            console.log("Sending message:", inputMessage);
        }
        const message = {
            content: inputMessage,
            sender: username,
            roomCode: roomCode
        };
        stompClient.send(`/app/sendMessage/${roomCode}`,
            {}
            , JSON.stringify(message));
        setInputMessage('');

    }

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scroll({
                top: chatBoxRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }

    }, [messages]);
    function handleLeave() {
        stompClient.disconnect();
        setConnected(false);
        setRoomCode('');
        setUsername('');
        navigate('/');
    }
    return (
        <div>
            <header className="fixed top-0 left-0 w-full border-b-1 border-gray-600 p-4 shadow-md dark:bg-gray-800 bg-white">
                <div className='flex justify-between items-center'>
                    <div>
                        Username: <label htmlFor="">{username}</label>
                    </div>
                    <div>
                        RoomCode: <label htmlFor="">{roomCode}</label>
                    </div>
                    <div>
                        <button style={{ backgroundColor: "red" }} onClick={handleLeave}>Leave Room</button>
                    </div>
                </div>
            </header>

            {/* content message */}
            <main ref={chatBoxRef} className=' py-20  w-5xl dark:bg-slate-600 h-screen overflow-auto'>
                {messages.map((message, index) => (
                    <div key={index} className={`p-1 flex flex-col justify-center  ${message.sender === username ? "items-end" : "items-start"}`}>
                        <div key={index} className={`flex flex-row gap-2 my-2 max-w-xs rounded p-2 ${message.sender === username ? "bg-green-500 text-white" : "bg-sky-400 text-black"}`}>
                            <img className='h-10 w-10' src={"https://avatar.iran.liara.run/public/41"} alt="" />
                            <div className='flex flex-col items-start'>
                                <p className='text-sm font-bold'>{message.sender}</p>
                                <p>{message.content}</p>
                                <p className='text-sm text-gray-200'>{getTimeAgo(message.timeStamp)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            {/* input message  */}
            <div className='fixed bottom-2 left-0 w-full h-12 '>
                <div className='h-full dark:bg-gray-700 w-1/2  mx-auto flex items-center pr-2 rounded-full'>

                    <input value={inputMessage} onChange={(e) => { setInputMessage(e.target.value) }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                            }
                        }}
                        type="text" className='dark:bg-gray-800 w-full px-4 py-2  focus:outline-0 h-12 rounded-full' placeholder='Type your message here...' />

                    <button
                        style={{ backgroundColor: 'purple', height: '40px', width: '20px', justifyItems: 'center', borderRadius: '50%', marginLeft: '8px', outline: 'none', justifyContent: 'center' }} ><MdAttachFile /></button>

                    <button onClick={sendMessage}

                        style={{ backgroundColor: 'green', height: '40px', width: '50px', justifyItems: 'center', marginLeft: '5px', outline: 'none', borderRadius: '40%' }} ><IoSend /></button>
                </div>
            </div>

        </div>
    );
}
export default ChatPage;