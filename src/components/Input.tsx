import { ForwardRefRenderFunction, forwardRef } from "react";

type InputProps = {
  placeholder: string;
  type: string;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { placeholder, type, ...props },
  ref,
) => {
  return (
    <div className="w-full">
      <input type={type} placeholder={placeholder} ref={ref} {...props} className="px-3 py-2 bg-gray-950 rounded-md w-full" />
    </div>
  )
}

export const Input = forwardRef(InputBase);