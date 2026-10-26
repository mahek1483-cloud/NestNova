import Link from "next/link"
import { FoodService } from "@/data/mockData"
import { Badge } from "./ui/Badge"
import { VerificationBadge, SponsoredTag } from "./ui/Badges"
import { MapPin, IndianRupee } from "lucide-react"
import { Button } from "./ui/Button"
import { PlaceholderImage } from "./ui/PlaceholderImage"

export function FoodCard({ food }: { food: FoodService }) {
  return (
    <div className="bg-white rounded-2xl border border-black/10 overflow-hidden hover:shadow-lg transition-shadow flex flex-col group">
      <div className="h-40 relative flex items-center justify-center overflow-hidden">
        <PlaceholderImage type="food" label="Sample Food" />
        
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-10">
          {food.promotion?.isSponsored && <SponsoredTag />}
          <VerificationBadge status={food.verification?.status} date="10 Sep 2026" label={false} />
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-xl mb-1 group-hover:text-[#0F5C5C] transition-colors">
          <Link href={`/food/${food.id}`}>
            <span className="absolute inset-0 z-0"></span>
            {food.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 mb-3 flex items-center">
          <MapPin className="w-3 h-3 mr-1" /> {food.location}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{food.cuisine || "Indian"}</Badge>
          {food.type === "Tiffin" && <Badge variant="outline">Delivery</Badge>}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between relative z-10">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Monthly plan from</p>
            <p className="font-bold text-lg text-[#0F5C5C] flex items-center">
              <IndianRupee className="w-4 h-4" />
              {food.monthlyPriceINR.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-500">/mo</span>
            </p>
          </div>
          <Button size="sm">View Menu</Button>
        </div>
      </div>
    </div>
  )
}
