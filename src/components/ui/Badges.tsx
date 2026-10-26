import { Badge } from "./Badge"
import { ShieldCheck, Info } from "lucide-react"

export function VerificationBadge({ status, date, label = false }: { status: string, date?: string, label?: boolean }) {
  if (status === "Verified") {
    return (
      <Badge variant="success" className="shadow-sm">
        <ShieldCheck className="w-3 h-3 mr-1" />
        {label ? `Verified on ${date}` : "Verified"}
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="text-gray-500">
      {status}
    </Badge>
  )
}

export function SponsoredTag() {
  return (
    <div className="relative group inline-flex">
      <Badge variant="outline" className="border-gray-300 text-slate-600 bg-white shadow-sm font-medium">
        Sponsored · paid promotion
        <Info className="w-3 h-3 ml-1 text-gray-400" />
      </Badge>
      <div className="absolute top-full left-0 mt-1 hidden group-hover:block w-64 p-3 bg-[#1B2A2F] text-white text-xs rounded-xl shadow-xl z-50">
        <strong>Why am I seeing this?</strong><br/>
        Owners pay to promote. Payment does not affect verification, ratings or ranking in organic results.
      </div>
    </div>
  )
}
