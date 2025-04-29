"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface SignaturePadProps {
  onSignatureChange: (dataUrl: string | null) => void
  label?: string
  width?: number
  height?: number
}

export default function SignaturePad({
  onSignatureChange,
  label = "Signature",
  width = 200,
  height = 50,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [signaturePad, setSignaturePad] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Import SignaturePad dynamically since it's a client-side only library
    const loadSignaturePad = async () => {
      const SignaturePadModule = await import("signature_pad")
      const canvas = canvasRef.current

      if (canvas) {
        // Set canvas dimensions with device pixel ratio for better resolution
        const ratio = Math.max(1, window.devicePixelRatio || 1)
        canvas.width = width * ratio
        canvas.height = height * ratio
        canvas.getContext("2d")?.scale(ratio, ratio)

        // Style the canvas with CSS dimensions
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        // Configure the signature pad with options for better small-size experience
        const pad = new SignaturePadModule.default(canvas, {
          minWidth: 0.5,
          maxWidth: 1.5,
          penColor: "black",
          backgroundColor: "rgba(255, 255, 255, 0)",
          throttle: 16, // Increase responsiveness
          velocityFilterWeight: 0.6, // Make lines smoother
        })

        setSignaturePad(pad)

        // Set up event listeners for when signature changes
        pad.addEventListener("endStroke", () => {
          if (!pad.isEmpty()) {
            onSignatureChange(pad.toDataURL())
          }
        })
      }
    }

    loadSignaturePad()

    return () => {
      // Clean up event listeners
      if (signaturePad) {
        signaturePad.off()
      }
    }
  }, [onSignatureChange, width, height])

  const handleClear = () => {
    if (signaturePad) {
      signaturePad.clear()
      onSignatureChange(null)
    }
  }

  // Function to get accurate mouse position relative to canvas
  const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent | TouchEvent) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ("touches" in evt) {
      const touch = evt.touches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    } else {
      return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY,
      }
    }
  }

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label>{label}</Label>
      <div className="border rounded p-2 bg-white inline-block">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 rounded touch-none cursor-crosshair"
          style={{ width: `${width}px`, height: `${height}px` }}
        />
      </div>
      <Button type="button" variant="outline" onClick={handleClear} size="sm" className="mt-2">
        Clear
      </Button>
    </div>
  )
}
