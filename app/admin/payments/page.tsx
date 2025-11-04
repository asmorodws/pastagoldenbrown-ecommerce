"use client"

import { useState } from "react"
import { CreditCard, Smartphone, Landmark, CheckCircle, XCircle } from "lucide-react"
import toast from "react-hot-toast"

interface PaymentMethod {
  id: string
  name: string
  type: string
  icon: any
  enabled: boolean
  description: string
  fee: string
}

export default function AdminPaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      name: "Transfer Bank",
      type: "bank_transfer",
      icon: Landmark,
      enabled: true,
      description: "Transfer melalui BCA, Mandiri, BNI, BRI",
      fee: "Gratis"
    },
    {
      id: "2",
      name: "Kartu Kredit/Debit",
      type: "card",
      icon: CreditCard,
      enabled: true,
      description: "Visa, Mastercard, JCB",
      fee: "2.9% + Rp 2.000"
    },
    {
      id: "3",
      name: "E-Wallet",
      type: "ewallet",
      icon: Smartphone,
      enabled: true,
      description: "GoPay, OVO, DANA, ShopeePay",
      fee: "1.5%"
    },
    {
      id: "4",
      name: "QRIS",
      type: "qris",
      icon: Smartphone,
      enabled: false,
      description: "Scan QR Code untuk pembayaran",
      fee: "0.7%"
    },
  ])

  const togglePaymentMethod = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method =>
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    )
    toast.success("Status metode pembayaran berhasil diupdate")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Metode Pembayaran</h1>
        <p className="text-slate-600 mt-1">Kelola metode pembayaran yang tersedia untuk pelanggan</p>
      </div>

      {/* Info Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Pembayaran Manual</h3>
            <p className="text-sm text-slate-700">
              Semua pembayaran diproses secara manual. Pelanggan akan memilih metode pembayaran saat checkout,
              kemudian melakukan transfer manual dan menunggu konfirmasi dari admin.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          return (
            <div
              key={method.id}
              className={`bg-white rounded-lg border-2 transition-all ${
                method.enabled
                  ? "border-slate-300"
                  : "border-slate-200 opacity-60"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                        method.enabled
                          ? "bg-slate-700"
                          : "bg-slate-200"
                      }`}
                    >
                      <Icon className={`w-7 h-7 ${method.enabled ? "text-white" : "text-slate-400"}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{method.name}</h3>
                      <p className="text-sm text-slate-600">{method.description}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Biaya Admin</span>
                    <span className="font-semibold text-slate-900">{method.fee}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Status</span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        method.enabled
                          ? "bg-slate-100 text-slate-700"
                          : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      {method.enabled ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Aktif
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Nonaktif
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => togglePaymentMethod(method.id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    method.enabled
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }`}
                >
                  {method.enabled ? "Nonaktifkan" : "Aktifkan"}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
