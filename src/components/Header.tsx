import { FaGithub } from "react-icons/fa";
import Container from "./Container";

export default function Header() {
  return (
    <div className="bg-gray-1000 px-4">
      <Container>
        <div className="flex items-center justify-between py-6">
          <h1 className="text-4xl font-semibold">
            Chat With Me!
          </h1>
          <h1>
            <FaGithub className="w-12 h-12 cursor-pointer" />
          </h1>
        </div>
      </Container>
    </div>
  )
}