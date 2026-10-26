import { useState } from "react"
import { Badge } from "./ui/Badge"

export function BudgetRange() {
  const [min, setMin] = useState(3000)
  const [max, setMax] = useState(30000)
  const [activeChip, setActiveChip] = useState("Any")

  const chips = [
    { label: "Any", min: 3000, max: 30000 },
    { label: "Under ₹8k", min: 3000, max: 8000 },
    { label: "₹8k - ₹12k", min: 8000, max: 12000 },
    { label: "₹12k - ₹18k", min: 12000, max: 18000 },
    { label: "₹18k+", min: 18000, max: 30000 },
  ]

  const handleChipClick = (chip: typeof chips[0]) => {
    setActiveChip(chip.label)
    setMin(chip.min)
    setMax(chip.max)
  }

  return (
    <div className="space-y-4">
      <label className="block text-xs font-semibold text-gray-500">Budget Range (Monthly)</label>
      
      <div className="flex flex-wrap gap-2">
        {chips.map(chip => (
          <button
            key={chip.label}
            type="button"
            onClick={() => handleChipClick(chip)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors border ${activeChip === chip.label ? 'bg-[#0F5C5C] text-white border-[#0F5C5C]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="px-2">
        <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
          <span>₹{min.toLocaleString('en-IN')}</span>
          <span>₹{max.toLocaleString('en-IN')}</span>
        </div>
        
        {/* Mock dual slider track */}
        <div className="relative h-2 bg-gray-200 rounded-full w-full">
          <div 
            className="absolute h-full bg-[#0F5C5C] rounded-full"
            style={{ 
              left: `${((min - 3000) / 27000) * 100}%`, 
              right: `${100 - ((max - 3000) / 27000) * 100}%` 
            }}
          ></div>
          <div 
            className="absolute h-4 w-4 bg-white border-2 border-[#0F5C5C] rounded-full top-1/2 -translate-y-1/2 shadow"
            style={{ left: `calc(${((min - 3000) / 27000) * 100}% - 8px)` }}
          ></div>
          <div 
            className="absolute h-4 w-4 bg-white border-2 border-[#0F5C5C] rounded-full top-1/2 -translate-y-1/2 shadow"
            style={{ left: `calc(${((max - 3000) / 27000) * 100}% - 8px)` }}
          ></div>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center">Interactive slider disabled in demo mode</p>
      </div>
    </div>
  )
}
