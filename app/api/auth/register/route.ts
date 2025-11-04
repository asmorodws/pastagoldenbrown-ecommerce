import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Create verification token
    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.verificationToken.create({
      data: {
        email,
        token,
        expires,
        userId: user.id,
      },
    })

    // Check if email is configured
    const isEmailConfigured = 
      process.env.EMAIL_SERVER_HOST && 
      process.env.EMAIL_SERVER_USER && 
      process.env.EMAIL_SERVER_PASSWORD

    if (!isEmailConfigured) {
      // Auto-verify in development mode when email is not configured
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
      
      console.log("⚠️  Development mode: Email auto-verified")
      return NextResponse.json({
        message: "Registrasi berhasil! Anda dapat langsung login.",
      })
    }

    // Send verification email in production
    try {
      await sendVerificationEmail(email, token)
      return NextResponse.json({
        message: "Registrasi berhasil! Silakan cek email Anda untuk verifikasi.",
      })
    } catch (emailError) {
      console.error("Email error:", emailError)
      // If email fails, auto-verify as fallback
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
      
      return NextResponse.json({
        message: "Registrasi berhasil! Email verifikasi gagal dikirim, tapi akun Anda sudah aktif.",
      })
    }
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    )
  }
}
