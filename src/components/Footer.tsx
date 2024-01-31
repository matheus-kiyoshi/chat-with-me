'use client'

import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import { LuMonitor, LuMonitorOff } from "react-icons/lu";
import { ImPhoneHangUp } from "react-icons/im";
import Container from "./Container";
import { useState } from "react";

export default function Footer() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  const date = new Date()
  const hours = date.getHours().toString().padStart(2, '0') + ':'
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return (
    <div className="fixed bottom-0 bg-black py-2 w-full">
      <Container>
        <div className="grid grid-cols-3">
          <div className="flex items-center">
            <p className="text-xl">
              {hours + minutes}
            </p>
          </div>
          <div className="flex space-x-6 justify-center">
            {isMuted ? (
              <FaMicrophoneSlash 
                className="h-12 w-16 text-white p-2 cursor-pointer bg-red-500 rounded-md" 
                onClick={() => setIsMuted(false)} 
              />
            ) : (
              <FaMicrophone 
                className="h-12 w-16 text-white p-2 cursor-pointer bg-gray-950 rounded-md" 
                onClick={() => setIsMuted(true)} 
              />
            )}

            {isVideoOff ? (
              <FaVideoSlash 
                className="h-12 w-16 text-white p-2 cursor-pointer bg-red-500 rounded-md" 
                onClick={() => setIsVideoOff(false)} 
              />
            ) : (
              <FaVideo 
                className="h-12 w-16 text-white p-2 cursor-pointer bg-gray-950 rounded-md" 
                onClick={() => setIsVideoOff(true)} 
              />
            )}
            
            {isScreenSharing ? (
              <LuMonitorOff 
                className="h-12 w-16 text-white p-2 cursor-pointer bg-red-500 rounded-md" 
                onClick={() => setIsScreenSharing(false)} 
              />
            ) : (
              <LuMonitor 
                className="h-12 w-16 text-white p-2 cursor-pointer bg-gray-950 rounded-md" 
                onClick={() => setIsScreenSharing(true)} 
              />
            )}
            
            <ImPhoneHangUp 
              className="h-12 w-16 text-white p-2 cursor-pointer bg-primary rounded-md" 
            />
          </div>
        </div>
      </Container>
    </div>
  )
}