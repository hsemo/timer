import { ReactElement } from "react";

interface ButtonProps {
  className: string;
  onClickHandlr: () => void;
  children: ReactElement;
}
function Button({ className, onClickHandlr, children }: ButtonProps) {
  className = className || "";

  return (
    <button
      className={
        "p-2 bg-green-500 hover:bg-green-600 focus:outline-none hover:text-black focus:text-black" +
        className
      }
      onClick={onClickHandlr}
    >
      {children}
    </button>
  );
}

export default Button;
