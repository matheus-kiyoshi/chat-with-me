type ButtonProps = {
  title: string;
  type: "submit" | "button" | "reset";
}

export default function Button({ title, type }: ButtonProps) {
  return (
    <button className="bg-primary w-full text-black font-medium rounded-md py-2" type={type} >
      <span>{title}</span>
    </button>
  )
}