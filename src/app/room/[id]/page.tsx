'use client'
import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SocketContext } from "@/contexts/SocketContext";
import { useContext, useEffect, useRef } from "react";

export default function Room({ params }: { params: { id: string } }) {
  const { socket } = useContext(SocketContext)
  const localStream = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    socket?.on('connect', async () => {
      console.log('Connected to server')
      socket?.emit('subscribe', {
        roomId: params.id,
        socketId: socket.id,
      })
      await initCamera();
    })
  }, [socket])

  const initCamera = async () => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    })
    
    if (localStream.current) {
      localStream.current.srcObject = video
    }
  }

  return (
    <main className="h-screen">
      <Header />
      <div className="flex h-[80%]">
        <div className="w-[80%] m-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-950 w-full h-full p-2 rounded-md relative">
              <video ref={localStream} className="h-full w-full" autoPlay playsInline />
              <span className="absolute bottom-3">Nome</span>
            </div>
            <div className="bg-gray-950 w-full h-full p-2 rounded-md relative">
              <video ref={localStream} className="h-full w-full" autoPlay playsInline />
              <span className="absolute bottom-3">Nome</span>
            </div>
            <div className="bg-gray-950 w-full h-full p-2 rounded-md relative">
              <video ref={localStream} className="h-full w-full" autoPlay playsInline />
              <span className="absolute bottom-3">Nome</span>
            </div>
            <div className="bg-gray-950 w-full h-full p-2 rounded-md relative">
              <video ref={localStream} className="h-full w-full" autoPlay playsInline />
              <span className="absolute bottom-3">Nome</span>
            </div>
          </div>
        </div>
        <Chat roomId={params.id} />
      </div>
      <Footer />
    </main>
  )
}