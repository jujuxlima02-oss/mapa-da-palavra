import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    const id = React.useId();
    return (
      <div className="w-full mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
        <input
          id={id}
          type={type}
          className={cn(
            "flex h-[48px] w-full rounded-md border border-[#d1d5db] bg-white px-3 text-[15px] text-slate-900 transition-all focus:border-blue-600 focus:outline-none focus:ring-0 focus:shadow-[0_0_0_2px_rgba(37,99,235,0.2)] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_2px_rgba(239,68,68,0.2)]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
           <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
