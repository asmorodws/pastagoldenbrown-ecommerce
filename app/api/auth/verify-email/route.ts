import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        { error: "Token tidak valid" },
        { status: 400 }
      )
    }

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Token tidak ditemukan" },
        { status: 404 }
      )
    }

    if (verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Token sudah kadaluarsa" },
        { status: 400 }
      )
    }

    // Update user email verified
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    })

    // Delete verification token
    await prisma.verificationToken.delete({
      where: { token },
    })

    return NextResponse.json({
      message: "Email berhasil diverifikasi! Silakan login.",
    })
  } catch (error) {
    console.error("Verify email error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat verifikasi email" },
      { status: 500 }
    )
  }
}
