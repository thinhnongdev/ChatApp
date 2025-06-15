import { useState } from "react";
import toast from "react-hot-toast";
import { createRoomApi, joinRoomApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {

    const [detail, setDetail] = useState({
        roomCode: '',
        username: ''

    });
    const { roomCode, username, connected, setRoomCode, setUsername, setConnected } = useChatContext();
    const navigate = useNavigate();

    function handldeInputChange(event) {
        setDetail({
            ...detail,
            [event.target.name]: event.target.value
        })
    }

    //validate form before joining or creating a room
    function validateForm() {
        if (detail.username.trim() === '' || detail.roomCode.trim() === '') {
            toast.error('Please fill in all fields');
            return false;
        }
        return true;
    }
    async function createRoomChat() {
        // Logic to create a new room
        if (validateForm()) {
            try {
                const reponse = await createRoomApi(detail.roomCode);
                toast.success("Room created successfully");
                console.log("Room created:", reponse);
                setUsername(detail.username);
                setRoomCode(detail.roomCode);
                setConnected(true);
                navigate(`/chat`);
            } catch (error) {
                console.error("Error creating room:", error);
                if (error.status === 400) {
                    toast.error("Room code already exists. Please try a different code.");
                    return;
                }
                toast.error("Failed to create room. Please try again.");

            }
        }
    }
    async function joinChat() {
        if (validateForm()) {
            try {
                const response = await joinRoomApi(detail.roomCode);
                setUsername(detail.username);
                setRoomCode(detail.roomCode);
                setConnected(true);
                navigate(`/chat`);
                toast.success("Joined room successfully");
                return;
            } catch (error) {
                if (error.status === 400) {
                    toast.error("Room code does not exist. Please try a different code.");
                    return;
                }
                console.error("Error joining room:", error);
            }
        }
    }

    console.log(detail);

    return (
        <div className="min-h-screen flex items-center">
            <div className="p-8 w-full flex flex-col gap-5 max-w-xl rounded dark:bg-gray-800 bg-white shadow dark:border-gray-700 border">
                <h2 className="text-4xl font-semibold text-center">Join Room / Create Room</h2>
                {/* name */}
                <div className="">
                    <label htmlFor="name" className="block font-medium mb-2 text-left"> Your name</label>
                    <input onChange={handldeInputChange} value={detail.username} name="username" placeholder="Enter your name" type="text" id="name" className="w-full dark:bg-gray-600 px-4 py-2  dark:border-gray-300 rounded-full focus:outline-none focus:ring-2  " />
                </div>
                {/* roomCode */}
                <div className="">
                    <label htmlFor="roomCode" className="block font-medium mb-2 text-left"> Room Code/ New Room Code</label>
                    <input type="text" id="roomCode" name="roomCode" value={detail.roomCode} onChange={handldeInputChange} placeholder="Enter the code" className="w-full dark:bg-gray-600 px-4 py-2  dark:border-gray-300 rounded-full focus:outline-none focus:ring-2  " />
                </div>
                {/* buttons */}
                <div className="flex justify-center gap-30 mt-4">
                    <button style={{ backgroundColor: '#0ea5e9', borderColor: 'none' }} onClick={joinChat}>
                        Join Room
                    </button>
                    <button style={{ backgroundColor: 'brown', borderColor: 'none' }} onClick={createRoomChat}>
                        Create Room
                    </button>
                </div>

            </div>
        </div>
    )
}
export default JoinCreateChat;