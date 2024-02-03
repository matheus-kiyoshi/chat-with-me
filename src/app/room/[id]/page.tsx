'use client'
import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SocketContext } from "@/contexts/SocketContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

type AnswerSDP = {
  sender: string
  description: RTCSessionDescriptionInit
}

type IceCandidates = {
  candidate: RTCIceCandidate
  sender: string
}

type DataStream = {
  id: string
  stream: MediaStream
}

export default function Room({ params }: { params: { id: string } }) {
  const { socket } = useContext(SocketContext)
  const localStream = useRef<HTMLVideoElement>(null)
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({})
  const [remoteStreams, setRemoteStreams] = useState<DataStream[]>([])
  const [videoMediaStream, setVideoMediaStream] = useState<MediaStream | null>(null)
  const router = useRouter()

  useEffect(() => {
    socket?.on('connect', async () => {
      console.log('Connected to server')
      socket?.emit('subscribe', {
        roomId: params.id,
        socketId: socket.id,
      })
      await initLocalCamera();
    })

    socket?.on('new user', (data) => {
      console.log('Novo usuário conectado', data)
      createPeerConnection(data.socketId, false)
      socket.emit('newUserStart', {
        to: data.socketId,
        sender: socket.id,
      })
    })

    socket?.on('newUserStart', (data) => {
      console.log('Novo usuário conectado na sala', data)
      createPeerConnection(data.sender, true)
    })

    socket?.on('sdp', (data) => handleAnswer(data))
    
    socket?.on('ice candidates', data => handleIceCandidates(data))
  }, [socket])

  const handleIceCandidates = async (data: IceCandidates) => {
    const peerConnection = peerConnections.current[data.sender]
    if (data.candidate) {
      await peerConnection.addIceCandidate(
        new RTCIceCandidate(data.candidate)
      )
    }
  }

  const handleAnswer = async (data: AnswerSDP) => {
    const peerConnection = peerConnections.current[data.sender]
    if (data.description.type === 'offer') {
      await peerConnection.setRemoteDescription(data.description)

      const answer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(answer)

      socket?.emit('sdp', {
        to: data.sender,
        sender: socket?.id,
        description: peerConnection.localDescription,
      })
    } else if (data.description.type === 'answer') {
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.description)
      )
    }
  }

  const createPeerConnection = async (socketId: string, createOffer: boolean) => {
    const config = {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    }

    const peer = new RTCPeerConnection(config)
    peerConnections.current[socketId] = peer
    const peerConnection = peerConnections.current[socketId]

    if (videoMediaStream) {
      videoMediaStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, videoMediaStream)
      })
    } else {
      const video = await initRemoteCamera()
      video.getTracks().forEach((track) => {
        peerConnection.addTrack(track, video)
      })
    }

    if (createOffer) {
      const peerConnection = peerConnections.current[socketId]

      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
    
      socket?.emit('sdp', {
        to: socketId,
        sender: socket.id,
        description: peerConnection.localDescription,
      })
    }

    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0]

      const dataStream: DataStream = {
        id: socketId,
        stream: remoteStream
      }

      setRemoteStreams(
        (prevState: DataStream[]) => {
          if (!prevState.some(stream => stream.id === socketId)) {
            return [ ...prevState, dataStream ]
          }
          
          return prevState
        } 
      )
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('ice candidates', {
          to: socketId,
          sender: socket?.id,
          candidate: event.candidate
        })
      }
    }

    peerConnection.onsignalingstatechange = (event) => {
      switch (peerConnection.signalingState) {
        case 'closed':
          setRemoteStreams(
            (prevState) => prevState.filter((stream) => stream.id !== socketId)
          )
          
          break
      }
    }

    peerConnection.onconnectionstatechange = (event) => {
      switch (peerConnection.connectionState) {
        case 'disconnected':
          setRemoteStreams((prevState) => 
            prevState.filter((stream) => stream.id !== socketId)
          )
        
        case 'failed':
          setRemoteStreams((prevState) => 
            prevState.filter((stream) => stream.id !== socketId)
          )

        case 'closed':
          setRemoteStreams((prevState) => 
            prevState.filter((stream) => stream.id !== socketId)
          )
          
          break 
      }
    }
  }

  const logout = () => {
    videoMediaStream?.getTracks().forEach((track) => {
      track.stop()
    })

    Object.values(peerConnections.current).forEach((peerConnection) => {
      peerConnection.close()
    })

    socket?.disconnect()
    router.push('/')
  }

  const initLocalCamera = async () => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    })
    
    setVideoMediaStream(video)
    if (localStream.current) {
      localStream.current.srcObject = video
    }
  }

  const initRemoteCamera = async () => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    })
    
    return video
  }

  return (
    <main className="h-screen">
      <Header />
      <div className="flex h-[80%]">
        <div className="w-[80%] m-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-950 w-full h-full p-2 rounded-md relative">
              <video ref={localStream} className="h-full w-full mirror-mode" autoPlay playsInline />
              <span className="absolute bottom-3">Nome</span>
            </div>
           
            {remoteStreams.map((stream, index) => {
              return (
                <div className="bg-gray-950 w-full h-full p-2 rounded-md relative" key={index}>
                  <video 
                    ref={video => {
                      if (video && video.srcObject !== stream.stream) 
                        video.srcObject = stream.stream
                    }} 
                    className="h-full w-full" 
                    autoPlay 
                    playsInline />
                  <span className="absolute bottom-3">Nome</span>
                </div>
              )
            })}
          </div>
        </div>
        <Chat roomId={params.id} />
      </div>
      <Footer 
        videoMediaStream={videoMediaStream!} 
        peerConnections={peerConnections} 
        localStream={localStream}
        logout={logout}
      />
    </main>
  )
}