import Chat from "@/components/Chat";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Room({ params }: { params: { id: string } }) {
  return (
    <main className="h-screen">
      <Header />
      <div className="flex h-[80%]">
        <div className="w-[80%] m-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-950 w-full h-full p-2 rounded-md relative">
              <video className="h-full w-full">

              </video>
              <span className="absolute bottom-3">Nome</span>
            </div>
            <div className="bg-gray-950 w-full h-full p-2 rounded-md relative">
              <video className="h-full w-full">

              </video>
              <span className="absolute bottom-3">Nome</span>
            </div>
            <div className="bg-gray-950 w-full h-full p-2 rounded-md relative">
              <video className="h-full w-full">

              </video>
              <span className="absolute bottom-3">Nome</span>
            </div>
            <div className="bg-gray-950 w-full h-full p-2 rounded-md relative">
              <video className="h-full w-full">

              </video>
              <span className="absolute bottom-3">Nome</span>
            </div>
          </div>
        </div>
        <Chat />
      </div>
      <Footer />
    </main>
  )
}