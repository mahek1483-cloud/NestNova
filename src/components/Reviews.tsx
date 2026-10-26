import { Star, ThumbsUp, MessageSquare } from "lucide-react"
import { Badge } from "./ui/Badge"

export function ReviewLabel({ label }: { label: string }) {
  if (label === "Verified resident" || label === "Verified food customer") {
    return <Badge variant="success" className="bg-[#1E8E5A]/10 text-[#1E8E5A] border-none text-[10px] uppercase tracking-wider">{label}</Badge>
  }
  if (label === "Visited, not stayed") {
    return <Badge variant="outline" className="text-gray-500 border-gray-200 text-[10px] uppercase tracking-wider">{label}</Badge>
  }
  return <Badge variant="secondary" className="text-gray-500 bg-gray-100 text-[10px] uppercase tracking-wider">{label}</Badge>
}

export function RatingSummary({ rating, count }: { rating: number, count: number }) {
  return (
    <div className="flex gap-8 items-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
      <div className="text-center shrink-0">
        <div className="text-4xl font-bold text-[#0F5C5C] mb-1">{rating.toFixed(1)}</div>
        <div className="flex text-[#F2A33A] justify-center mb-1">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4" fill={i <= Math.round(rating) ? "currentColor" : "none"} />)}
        </div>
        <div className="text-xs text-gray-500">
          From {count} <span className="underline decoration-dashed cursor-help" title="In this demo, labels are sample data">verified</span> reviews
        </div>
      </div>
      
      <div className="flex-1 space-y-2 hidden sm:block">
        {[
          { label: "Cleanliness", score: 4.5 },
          { label: "Safety", score: 4.8 },
          { label: "Food quality", score: 3.5 },
          { label: "WiFi & Power", score: 4.0 },
        ].map(cat => (
          <div key={cat.label} className="flex items-center text-xs">
            <span className="w-24 text-gray-600">{cat.label}</span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden mx-2">
              <div className="h-full bg-[#0F5C5C]" style={{ width: `${(cat.score / 5) * 100}%` }}></div>
            </div>
            <span className="w-6 text-right font-medium text-gray-700">{cat.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReviewCard({ review }: { review: unknown }) {
  const r = review as { authorName?: string, label?: string, metadata?: string, date?: string, rating?: number, text?: string, ownerReply?: string };
  return (
    <div className="py-6 border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold">{r.authorName || "Student"}</span>
            <ReviewLabel label={r.label || "Verified resident"} />
          </div>
          <div className="text-xs text-gray-500">
            {r.metadata || "Stayed 8 months"} • {r.date || "2 weeks ago"}
          </div>
        </div>
        <div className="flex bg-[#FBF8F3] px-2 py-1 rounded text-sm font-bold text-[#0F5C5C] items-center gap-1 border border-amber-100">
          {r.rating} <Star className="w-3 h-3 text-[#F2A33A]" fill="currentColor" />
        </div>
      </div>
      
      <p className="text-gray-700 text-sm mb-4 leading-relaxed">{r.text}</p>
      
      {r.ownerReply && (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 ml-4 relative">
          <div className="absolute top-4 -left-2 w-4 h-4 bg-gray-50 border-l border-t border-gray-100 rotate-[-45deg]"></div>
          <div className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> Owner Reply
          </div>
          <p className="text-sm text-gray-700">{r.ownerReply}</p>
        </div>
      )}
      
      <div className="flex items-center gap-4 mt-4 text-xs font-medium text-gray-500">
        <button className="flex items-center gap-1 hover:text-[#0F5C5C]"><ThumbsUp className="w-3 h-3" /> Helpful (12)</button>
        <button className="hover:text-gray-700">Report</button>
      </div>
    </div>
  )
}
