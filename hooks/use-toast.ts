"use client"

interface ToastProps {
  title: string
  description?: string
  variant?: "default" | "destructive"
}

export function toast({ title, description, variant = "default" }: ToastProps) {
  // Create a toast element
  const toastElement = document.createElement("div")
  toastElement.className = `fixed top-4 right-4 z-50 p-4 rounded-md shadow-md max-w-md ${
    variant === "destructive" ? "bg-red-500 text-white" : "bg-white text-gray-900 border border-gray-200"
  }`

  // Create title element
  const titleElement = document.createElement("h3")
  titleElement.className = "font-medium text-sm"
  titleElement.textContent = title
  toastElement.appendChild(titleElement)

  // Create description element if provided
  if (description) {
    const descElement = document.createElement("p")
    descElement.className = "text-xs mt-1"
    descElement.textContent = description
    toastElement.appendChild(descElement)
  }

  // Add to DOM
  document.body.appendChild(toastElement)

  // Remove after 3 seconds
  setTimeout(() => {
    toastElement.classList.add("opacity-0", "transition-opacity", "duration-300")
    setTimeout(() => {
      document.body.removeChild(toastElement)
    }, 300)
  }, 3000)
}
