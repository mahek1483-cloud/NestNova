"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StudentLayout } from "@/components/student/StudentLayout";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  Receipt,
  AlertCircle,
  Building,
} from "lucide-react";
import { getStudentPayments } from "@/lib/api/requests";
import { PaymentRecord } from "@/types";
import { EmptyState } from "@/components/common/EmptyState";

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await getStudentPayments();
        setPayments(res);
      } catch {
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Payments & Receipts
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Official records for rent and security deposits paid for stays in Gokak.
          </p>
        </div>

        {/* Security / Privacy Banner */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Secure Transaction Guarantee:</span>
            <span>
              All payments are processed with end-to-end encryption. NestNova never stores sensitive card or UPI details on client devices. Payment status updates only after server-side webhook verification.
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="w-8 h-8 border-3 border-[#0F5C5C] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading payment transactions...</p>
          </div>
        ) : payments.length > 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase font-bold text-[10px]">
                    <th className="p-4">Transaction / Order ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-mono font-bold text-gray-900">{p.order_id}</td>
                      <td className="p-4 text-gray-500">
                        {new Date(p.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 font-extrabold text-[#0F5C5C]">
                        ₹{p.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            p.status === "paid"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : p.status === "pending"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-rose-50 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => alert(`Official receipt for order ${p.order_id} will be downloaded.`)}
                          className="text-[#0F5C5C] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 max-w-lg mx-auto my-8 shadow-xs">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 mx-auto mb-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No payment transactions yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
              When an owner in Gokak approves your room booking, your deposit payment link and invoice history will appear here.
            </p>
            <Link
              href="/student/bookings"
              className="px-5 py-2.5 bg-[#0F5C5C] text-white font-bold rounded-xl text-xs"
            >
              Check Booking Status
            </Link>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
