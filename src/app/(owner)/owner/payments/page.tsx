"use client";

import React, { useState, useEffect } from "react";
import { OwnerLayout } from "@/components/owner/OwnerLayout";
import {
  CreditCard,
  ShieldCheck,
  Building,
  Receipt,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { getStudentPayments } from "@/lib/api/requests";
import { PaymentRecord } from "@/types";

export default function OwnerPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getStudentPayments().then((res) => {
      setPayments(res);
      setIsLoading(false);
    });
  }, []);

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] font-sans tracking-tight">
            Payments & Payouts
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Official records for student deposits and rent settlements for Gokak properties.
          </p>
        </div>

        {/* Security / Financial Disclosure */}
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Automated Settlement Protocol:</span>
            <span>
              All transactions are settled directly through verified banking webhooks. Authoritative amounts are computed solely on the secure backend.
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
                    <th className="p-4">Payment Reference</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payout Status</th>
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
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {p.status.toUpperCase()}
                        </span>
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
            <h3 className="text-lg font-bold text-gray-800 mb-1">No payment settlements yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              When students pay their booking deposits for your Gokak properties, the payout statements will appear here.
            </p>
          </div>
        )}
      </div>
    </OwnerLayout>
  );
}
