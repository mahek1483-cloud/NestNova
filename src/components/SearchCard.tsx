"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Search } from "lucide-react"
import { Button } from "./ui/Button"
import { BudgetRange } from "./BudgetRange"

export function SearchCard() {
  const router = useRouter()
  const [tab, setTab] = useState<"college" | "work">("college")
  const [location, setLocation] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.set("location", location)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-3xl mx-auto border border-black/5">
      <div className="flex gap-4 mb-6 border-b border-black/5 pb-2">
        <button 
          onClick={() => setTab("college")}
          className={`font-semibold pb-2 border-b-2 transition-colors ${tab === "college" ? "border-[#0F5C5C] text-[#0F5C5C]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Near college
        </button>
        <button 
          onClick={() => setTab("work")}
          className={`font-semibold pb-2 border-b-2 transition-colors ${tab === "work" ? "border-[#0F5C5C] text-[#0F5C5C]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Near workplace
        </button>
      </div>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder={tab === "college" ? "e.g. PES University, IIT Madras" : "e.g. Manyata Tech Park, Hinjewadi"}
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]/50 focus:border-[#0F5C5C] transition-all"
          />
        </div>
        
        {/* Simple filters for demo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BudgetRange />
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Gender</label>
              <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]/50">
                <option>Any</option>
                <option>Boys</option>
                <option>Girls</option>
                <option>Co-living</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Sharing</label>
              <div className="flex gap-2 text-sm">
                {['Single', 'Double', 'Triple'].map(s => (
                  <label key={s} className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" className="rounded text-[#0F5C5C]" /> {s}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full text-lg mt-4" size="lg">
          <Search className="w-5 h-5 mr-2" />
          Search stays
        </Button>
      </form>
    </div>
  )
}
