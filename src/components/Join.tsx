'use client'

import { useRef } from "react";
import Button from "./Button";
import { Input } from "./Input";

export default function Join() {
  const name = useRef<HTMLInputElement>(null)
  const id = useRef<HTMLInputElement>(null)

  const handleJoinRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (
      name.current && 
      name.current?.value !== '' &&
      id.current &&
      id.current?.value !== ''
    ) {
      sessionStorage.setItem('username', name.current.value)
      const roomId = id.current.value
      window.location.href = `/room/${roomId}`
    }
  }

  return (
    <>
      <form 
        onSubmit={(e) => handleJoinRoom(e)}
        className="space-y-8"
      >
        <Input placeholder="Nome" type="text" ref={name} />
        <Input placeholder="Id da reunião" type="text" ref={id} />
        
        <Button title="Entrar" type="submit" />
      </form>
    </>
  )
}