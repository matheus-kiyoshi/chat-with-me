import { SocketContext } from "@/contexts/SocketContext";
import { useContext, useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";

type ChatMessageType = {
  message: string
  username: string
  roomId: string
  time: string
}

export default function Chat({ roomId}: { roomId: string }) {
  const currentMessage = useRef<HTMLInputElement>(null)
  const { socket } = useContext(SocketContext)
  const [chat, setChat] = useState<ChatMessageType[]>([])

  useEffect(() => {
    socket?.on('chat', (data) => {
      console.log(data)
      setChat((prevState) => [...prevState, data])
    })
  }, [socket])

  function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (currentMessage.current && currentMessage.current?.value !== '') {
      const sendMessageToServer = {
        message: currentMessage.current.value,
        username: sessionStorage.getItem('username') || 'Null',
        roomId,
        time: new Date().toLocaleTimeString(),
      }

      socket?.emit('chat', sendMessageToServer)
      setChat((prevState) => [...prevState, sendMessageToServer])

      currentMessage.current.value = ''
    }
  }

  return (
    <div className="relative min-h-[70vh] bg-gray-900 px-4 pt-4 md:w-[15%] hidden md:flex rounded-md m-3 h-full">
      <div className="h-full w-full">
        {chat.map((chat, index) => {
          return (
            <div key={index} className="bg-gray-950 rounded p-2 mb-4">
              <div className="flex items-center text-pink-400 space-x-2">
                <span>{chat.username}</span>
                <span>{chat.time}</span>
              </div>
              <div className="mt-5 text-sm">
                <p>{chat.message}</p>
              </div>
            </div>
          )
        })}

        <form onSubmit={(e) => sendMessage(e)} className="absolute bottom-4 inset-x-3">
          <div className="flex relative ">
            <input
              ref={currentMessage}
              type="text"
              name=""
              id=""
              className="px-3 py-2 bg-gray-950 rounded-md w-full"
            />
            <button type="submit">
              <IoSend className="w-5 h-5 absolute right-2 top-2.5 cursor-pointer"/>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}