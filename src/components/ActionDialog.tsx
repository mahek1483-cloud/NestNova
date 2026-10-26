"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/Button"
import { X } from "lucide-react"
import { submitEnquiry, submitVisitRequest, submitBooking } from "@/lib/api/requests"

export type RequestType = "Enquiry" | "Visit" | "Booking";

interface ActionDialogProps {
  propertyId: string;
  propertyName: string;
  propertyLocality?: string;
  ownerId?: string;
  isOpen: boolean;
  onClose: () => void;
  defaultType?: RequestType;
}

export function ActionDialog({
  propertyId,
  propertyName,
  propertyLocality = "Gokak",
  ownerId,
  isOpen,
  onClose,
  defaultType = "Enquiry",
}: ActionDialogProps) {
  const router = useRouter()
  const [type, setType] = useState<RequestType>(defaultType)
  const [step, setStep] = useState(1)
  const [details, setDetails] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)

    try {
      if (type === "Enquiry") {
        await submitEnquiry({
          propertyId,
          propertyName,
          propertyLocality,
          ownerId,
          message: details || "Enquiring about availability and facilities.",
        })
      } else if (type === "Visit") {
        await submitVisitRequest({
          propertyId,
          propertyName,
          propertyLocality,
          ownerId,
          scheduledAt: details || new Date().toISOString(),
          notes: "Scheduled via Action Dialog",
        })
      } else if (type === "Booking") {
        await submitBooking({
          propertyId,
          propertyName,
          propertyLocality,
          roomType: "Standard Room",
          monthlyRent: 4500,
          depositAmount: 2000,
          startDate: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10),
        })
      }
    } catch {
      // offline fallback
    } finally {
      setStep(3)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        
        {step === 1 && (
          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-xl font-bold mb-4 font-sans">Contact Owner</h2>
            <div className="flex gap-2 mb-6">
              {(["Enquiry", "Visit", "Booking"] as RequestType[]).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 text-sm rounded-lg font-medium transition-colors ${type === t ? 'bg-[#0F5C5C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {type === 'Visit' && (
              <div className="mb-4 space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Preferred Date & Time</label>
                <input type="datetime-local" className="w-full p-3 border border-gray-200 rounded-xl" required onChange={e => setDetails(e.target.value)} />
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="rounded" /> I will visit with my parent(s)
                </label>
              </div>
            )}

            {type === 'Booking' && (
              <div className="mb-4 bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm text-amber-800">
                <strong>Demo Booking Only.</strong> You will &ldquo;pay&rdquo; a demo token of ₹2,000. No actual payment will be taken.
              </div>
            )}

            {type === 'Enquiry' && (
              <div className="mb-4 space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Your Message</label>
                <textarea 
                  className="w-full p-3 border border-gray-200 rounded-xl h-24" 
                  placeholder="Ask about sharing, rules, etc."
                  required
                  onChange={e => setDetails(e.target.value)}
                ></textarea>
              </div>
            )}

            <Button type="submit" className="w-full">
              {type === 'Visit' ? 'Schedule Visit' : type === 'Booking' ? 'Pay Demo Token' : 'Send Enquiry'}
            </Button>
          </form>
        )}

        {step === 2 && (
          <div className="p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-[#0F5C5C]/20 border-t-[#0F5C5C] rounded-full animate-spin mb-4"></div>
            <p className="font-medium text-gray-600">Processing {type.toLowerCase()}...</p>
          </div>
        )}

        {step === 3 && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-[#1E8E5A]/10 text-[#1E8E5A] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2 font-sans">Request Submitted!</h2>
            <p className="text-gray-500 mb-6 text-sm">Your {type.toLowerCase()} has been sent to the owner as a demo request.</p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => router.push('/student/enquiries')}>View in My Requests</Button>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

