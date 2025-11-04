import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  text?: string
  fullScreen?: boolean
}

export default function Loading({ size = "md", text, fullScreen = false }: LoadingProps) {
  const sizes = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4",
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={cn(
          "animate-spin rounded-full border-slate-200 border-t-slate-700",
          sizes[size]
        )}
      />
      {text && <p className="text-slate-600 text-sm">{text}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        {content}
      </div>
    )
  }

  return content
}
