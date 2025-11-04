"use client"

import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MultipleImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  className?: string
}

export default function MultipleImageUpload({
  images,
  onChange,
  maxImages = 5,
  className
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith("image/")
    )
    
    if (files.length > 0) {
      await uploadFiles(files)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await uploadFiles(Array.from(files))
    }
  }

  const uploadFiles = async (files: File[]) => {
    if (images.length + files.length > maxImages) {
      alert(`Maksimal ${maxImages} gambar`)
      return
    }

    setUploading(true)
    try {
      // Upload ke Cloudinary atau storage lain
      // Untuk demo, kita convert ke base64
      const uploadedUrls = await Promise.all(
        files.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              resolve(reader.result as string)
            }
            reader.readAsDataURL(file)
          })
        })
      )

      onChange([...images, ...uploadedUrls])
    } catch (error) {
      console.error("Upload error:", error)
      alert("Gagal upload gambar")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const setAsPrimary = (index: number) => {
    const newImages = [...images]
    const [primaryImage] = newImages.splice(index, 1)
    onChange([primaryImage, ...newImages])
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          dragActive
            ? "border-slate-700 bg-slate-50"
            : "border-slate-300 hover:border-slate-400",
          uploading && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading || images.length >= maxImages}
        />

        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-700 font-medium mb-1">
          {uploading ? "Uploading..." : "Upload Gambar Produk"}
        </p>
        <p className="text-sm text-slate-500">
          Drag & drop atau klik untuk pilih gambar
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Maksimal {maxImages} gambar ({images.length}/{maxImages})
        </p>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-slate-200 hover:border-slate-400 transition-colors"
            >
              <Image
                src={url}
                alt={`Product ${index + 1}`}
                fill
                className="object-cover"
              />
              
              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-slate-700 text-white text-xs px-2 py-1 rounded">
                  Utama
                </div>
              )}

              {/* Actions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {index !== 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setAsPrimary(index)
                    }}
                    className="bg-white text-slate-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-slate-100"
                  >
                    Jadikan Utama
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeImage(index)
                  }}
                  className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Belum ada gambar</p>
        </div>
      )}
    </div>
  )
}
