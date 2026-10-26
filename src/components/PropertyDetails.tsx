import { CheckCircle2, Clock, ShieldAlert, HeartPulse } from "lucide-react"

export function AmenityList({ amenities }: { amenities: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map(a => (
        <div key={a} className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-700 flex items-center">
          <CheckCircle2 className="w-4 h-4 text-[#0F5C5C] mr-2" />
          {a}
        </div>
      ))}
    </div>
  )
}

export function RulesList({ rules }: { rules: unknown }) {

  if (!rules) return <div className="text-gray-500 text-sm">Rules not provided in demo data.</div>
  
  const r = rules as { curfew?: string; visitors?: string };
  return (
    <ul className="space-y-3">
      <li className="flex gap-3 items-start">
        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <span className="font-semibold block text-sm">Gate Timings / Curfew</span>
          <span className="text-sm text-gray-600">{r.curfew || "None"}</span>
        </div>
      </li>
      <li className="flex gap-3 items-start">
        <ShieldAlert className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <span className="font-semibold block text-sm">Visitors Policy</span>
          <span className="text-sm text-gray-600">{r.visitors || "Not specified"}</span>
        </div>
      </li>
      {/* Add more rules as needed based on data */}
    </ul>
  )
}

export function SafetyPanel({ safety }: { safety: unknown }) {
  if (!safety) return <div className="text-gray-500 text-sm">Safety details not provided in demo data.</div>
  
  const s = safety as { cctv?: boolean, guard?: boolean, fireSafety?: boolean, nearestHospital?: string };
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {s.cctv && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <CheckCircle2 className="w-4 h-4 text-[#1E8E5A]" /> CCTV Coverage
        </div>
      )}
      {s.guard && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <CheckCircle2 className="w-4 h-4 text-[#1E8E5A]" /> Security Guard
        </div>
      )}
      {s.fireSafety && (
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <CheckCircle2 className="w-4 h-4 text-[#1E8E5A]" /> Fire Safety
        </div>
      )}
      <div className="sm:col-span-2 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-3">
        <HeartPulse className="w-5 h-5 text-red-500 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Nearest Medical Help (Sample)</span>
          <span className="text-sm font-medium">{s.nearestHospital || "City Hospital (~2km)"}</span>
        </div>
      </div>
    </div>
  )
}

export function TravelEstimateTable({ map }: { map?: { [key: string]: number } }) {
  if (!map) return <div className="text-gray-500 text-sm">Travel estimates not available in demo.</div>
  
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
          <tr>
            <th className="p-3">Destination (Sample)</th>
            <th className="p-3">Distance</th>
            <th className="p-3">Demo Estimate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Object.entries(map).map(([place, dist]) => (
            <tr key={place}>
              <td className="p-3 font-medium">{place}</td>
              <td className="p-3 text-gray-600">{dist} km</td>
              <td className="p-3 text-gray-500 text-xs">
                {dist < 2 ? `Walk: ~${Math.round(dist * 12)} mins` : `Auto: ~₹${Math.round(30 + dist * 18)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-2 bg-amber-50 text-amber-800 text-[10px] text-center font-medium border-t border-amber-100">
        Demo estimates based on static distance formula, not live traffic.
      </div>
    </div>
  )
}
