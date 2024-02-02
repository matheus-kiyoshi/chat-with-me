'use client'
import { useRef } from "react";
import Button from "./Button";
import { Input } from "./Input";

export default function Create() {
  const name = useRef<HTMLInputElement>(null)

  const handleCreateRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (name.current && name.current?.value !== '') {
      sessionStorage.setItem('username', name.current.value)
      const roomId = Math.random().toString(36).substring(2, 12)
      window.location.href = `/room/${roomId}`   
    }
  }

  return (
    <>
      <form 
        onSubmit={(e) => handleCreateRoom(e)}
        className="space-y-8"
      >
        <Input placeholder="Nome" type="text" ref={name} />
        
        <Button title="Entrar" type="submit" />
      </form>
    </>
  )
}