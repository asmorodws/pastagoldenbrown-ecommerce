"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, XCircle } from "lucide-react"

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Token tidak valid")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage(data.message)
        } else {
          setStatus("error")
          setMessage(data.error)
        }
      } catch (error) {
        setStatus("error")
        setMessage("Terjadi kesalahan saat verifikasi email")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-4">Memverifikasi Email...</h2>
            <p className="text-slate-600">Mohon tunggu sebentar</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold mb-4 text-green-600">Berhasil!</h2>
            <p className="text-slate-600 mb-6">{message}</p>
            <Link
              href="/auth/login"
              className="bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600 transition inline-block"
            >
              Login Sekarang
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="text-red-500 mx-auto mb-4" size={64} />
            <h2 className="text-2xl font-bold mb-4 text-red-600">Gagal!</h2>
            <p className="text-slate-600 mb-6">{message}</p>
            <Link
              href="/auth/register"
              className="bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600 transition inline-block"
            >
              Daftar Ulang
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-600"></div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
