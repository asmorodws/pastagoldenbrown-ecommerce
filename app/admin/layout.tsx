import { auth } from "@/auth"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { Toaster } from "react-hot-toast"
import Providers from "@/components/Providers"

export const metadata = {
  title: "Admin Panel - E-Shop",
  description: "Admin dashboard untuk mengelola toko online",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Redirect if not admin
  if (!session || session.user.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <Providers>
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <AdminHeader />
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </Providers>
  )
}
