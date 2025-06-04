"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
}

export function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        onFileSelect(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragging ? "border-[#d8b4fe] bg-[#f5f0ff]" : "border-gray-200 hover:border-[#d8b4fe] hover:bg-[#f5f0ff]/30"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-[#f5f0ff] flex items-center justify-center">
          <Upload className="h-6 w-6 text-[#9333ea]" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-700">Drag and drop your image here</p>
          <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleButtonClick}
          className="mt-2 border-[#d8b4fe] text-[#9333ea] hover:bg-[#f5f0ff]"
        >
          Browse Files
        </Button>
      </div>
    </div>
  )
}
