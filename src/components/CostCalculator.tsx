"use client"
import { useState } from "react"
import { Property } from "@/data/mockData"
import { getTravelEstimate, TransportMode } from "@/utils/travel"
import { IndianRupee, Info } from "lucide-react"

interface CostCalculatorProps {
  property: Property;
  distanceKm?: number;
}

export function CostCalculator({ property, distanceKm = 2.5 }: CostCalculatorProps) {
  const [sharing, setSharing] = useState<number>(2) // 1, 2, 3
  const [hasAC, setHasAC] = useState(false)
  const [foodPlan, setFoodPlan] = useState<string>("none")
  const [commuteMode, setCommuteMode] = useState<TransportMode>("bus")
  const [commuteDays, setCommuteDays] = useState(20)

  // Demo calculations
  const baseRent = sharing === 1 ? property.priceINR * 1.5 : property.priceINR;
  const maintenance = 500;
  const acCharge = hasAC ? 1500 : 0;
  const electricity = hasAC ? 1200 : 400; // estimate
  
  let foodCharge = 0;
  if (foodPlan === "2meals") foodCharge = 3000;
  if (foodPlan === "3meals") foodCharge = 4500;

  const travelEst = getTravelEstimate(distanceKm, commuteMode)
  const monthlyCommuteCost = travelEst.costInr * 2 * commuteDays // round trip * days

  const totalMonthly = baseRent + maintenance + acCharge + electricity + foodCharge + monthlyCommuteCost;
  const deposit = property.priceINR * 2; // demo deposit

  return (
    <div className="bg-white rounded-2xl border border-black/10 p-5 shadow-sm">
      <h3 className="font-bold text-lg font-sans flex items-center mb-4">
        <IndianRupee className="w-5 h-5 mr-1" />
        Transparent Cost Calculator
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Sharing Type</label>
          <div className="flex bg-gray-50 rounded-lg p-1">
            {[1, 2, 3].map(n => (
              <button 
                key={n}
                onClick={() => setSharing(n)}
                className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${sharing === n ? 'bg-white shadow border border-gray-200 font-bold text-[#0F5C5C]' : 'text-gray-500'}`}
              >
                {n === 1 ? 'Single' : `${n} Sharing`}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Room AC</label>
            <select className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg" value={hasAC ? 'yes' : 'no'} onChange={e => setHasAC(e.target.value === 'yes')}>
              <option value="no">Non-AC</option>
              <option value="yes">AC Room (+₹1500)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Food Plan</label>
            <select className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg" value={foodPlan} onChange={e => setFoodPlan(e.target.value)}>
              <option value="none">No Food</option>
              <option value="2meals">Breakfast + Dinner</option>
              <option value="3meals">All 3 Meals</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Commute Mode</label>
            <select className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg" value={commuteMode} onChange={e => setCommuteMode(e.target.value as TransportMode)}>
              <option value="bus">Bus</option>
              <option value="metro">Metro</option>
              <option value="auto">Auto</option>
              <option value="bike">Personal Bike</option>
              <option value="walk">Walk</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Commute Days/mo</label>
            <input type="number" min="0" max="31" value={commuteDays} onChange={e => setCommuteDays(Number(e.target.value))} className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2 text-sm relative">
        <div className="flex justify-between items-center"><span className="text-gray-600">Base Rent (as listed)</span><span className="font-medium">₹{baseRent}</span></div>
        <div className="flex justify-between items-center"><span className="text-gray-600">Maintenance</span><span className="font-medium">₹{maintenance}</span></div>
        {hasAC && <div className="flex justify-between items-center"><span className="text-gray-600">AC Charge</span><span className="font-medium">₹{acCharge}</span></div>}
        {foodCharge > 0 && <div className="flex justify-between items-center"><span className="text-gray-600">Food Plan</span><span className="font-medium">₹{foodCharge}</span></div>}
        <div className="flex justify-between items-center"><span className="text-gray-600 border-b border-dashed border-gray-400 cursor-help" title="Demo Estimate based on generic usage">Electricity (Estimate)</span><span className="font-medium text-gray-500">~₹{electricity}</span></div>
        <div className="flex justify-between items-center"><span className="text-gray-600 border-b border-dashed border-gray-400 cursor-help" title="Demo Estimate based on distance">Commute (Estimate)</span><span className="font-medium text-gray-500">~₹{monthlyCommuteCost}</span></div>
        
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between items-end mb-3">
            <span className="font-bold text-[#1B2A2F]">Estimated Monthly Total</span>
            <span className="font-bold text-2xl text-[#0F5C5C]">₹{totalMonthly}</span>
          </div>
          
          {/* Stacked Bar Visual */}
          <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden flex" aria-hidden="true">
            <div style={{ width: `${(baseRent / totalMonthly) * 100}%` }} className="bg-[#0F5C5C] h-full" title="Rent"></div>
            {foodCharge > 0 && <div style={{ width: `${(foodCharge / totalMonthly) * 100}%` }} className="bg-[#F2A33A] h-full" title="Food"></div>}
            {hasAC && <div style={{ width: `${(acCharge / totalMonthly) * 100}%` }} className="bg-sky-400 h-full" title="AC"></div>}
            <div style={{ width: `${(monthlyCommuteCost / totalMonthly) * 100}%` }} className="bg-slate-400 h-full" title="Commute"></div>
            <div style={{ width: `${((maintenance + electricity) / totalMonthly) * 100}%` }} className="bg-gray-400 h-full" title="Other"></div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
            <span>Rent</span>
            {foodCharge > 0 && <span>Food</span>}
            <span>Extras</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">One-time payments</p>
        <div className="flex justify-between items-center text-sm"><span className="text-gray-600">Refundable Deposit</span><span className="font-medium">₹{deposit}</span></div>
        <div className="flex justify-between items-center text-sm"><span className="text-gray-600">Token Amount (Demo)</span><span className="font-medium">₹2,000</span></div>
      </div>

      <button 
        onClick={() => {
          navigator.clipboard.writeText(`Cost Estimate for ${property.name}:\nTotal Monthly: ₹${totalMonthly}\nDeposit: ₹${deposit}`);
          alert('Copied to clipboard');
        }}
        className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Copy Summary
      </button>

      <p className="text-[10px] text-gray-400 mt-4 flex items-start gap-1 leading-tight">
        <Info className="w-3 h-3 shrink-0" />
        Estimates use sample averages. Confirm final charges with the owner before paying. Demo mode only.
      </p>
    </div>
  )
}
