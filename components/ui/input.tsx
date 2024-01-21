import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative ">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full  border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus:outline-none !border-b-2  border-b-gray-300 peer disabled:cursor-not-allowed disabled:opacity-50 ",
            className
          )}
          ref={ref}
          {...props}
        />
        <span className="absolute bottom-0 left-0 h-[2px]  w-full scale-0 peer-focus-visible:scale-100 bg-gray-600 duration-300"></span>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
