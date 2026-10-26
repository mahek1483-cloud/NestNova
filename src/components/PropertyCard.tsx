import Link from "next/link"
import { Property } from "@/data/mockData"
import { Badge } from "./ui/Badge"
import { VerificationBadge, SponsoredTag } from "./ui/Badges"
import { MapPin, Heart, CheckSquare, Square, IndianRupee } from "lucide-react"

interface PropertyCardProps {
  property: Property;
  isShortlisted?: boolean;
  onToggleShortlist?: (id: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (id: string) => void;
}

export function PropertyCard({ 
  property, 
  isShortlisted = false, 
  onToggleShortlist,
  isCompared = false,
  onToggleCompare
}: PropertyCardProps) {
  
  return (
    <div className="bg-white rounded-2xl border border-black/10 overflow-hidden hover:shadow-lg transition-shadow flex flex-col sm:flex-row relative group">
      
      {/* Image Section */}
      <div className="relative w-full sm:w-1/3 aspect-[4/3] sm:aspect-auto bg-gray-100 shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-amber-50 flex items-center justify-center">
          <span className="text-gray-400 font-medium">Sample Photo</span>
        </div>
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-10">
          {property.promotion?.isSponsored && (
            <SponsoredTag />
          )}
          <VerificationBadge status={property.verification?.status} date="12 Sep 2026" />
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button 
            onClick={(e) => { e.preventDefault(); onToggleShortlist?.(property.id); }}
            className={`p-2 rounded-full bg-white/90 backdrop-blur shadow-sm hover:scale-105 transition-transform ${isShortlisted ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Heart className="w-4 h-4" fill={isShortlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-bold text-lg leading-tight group-hover:text-[#0F5C5C] transition-colors">
              <Link href={`/property/${property.id}`}>
                <span className="absolute inset-0 z-0"></span>
                {property.name}
              </Link>
            </h3>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {property.location}, {property.city}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3 mb-4">
          <Badge variant="outline">{property.type}</Badge>
          <Badge variant="outline">{property.gender}</Badge>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between relative z-10">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Rent from</p>
            <p className="font-bold text-xl text-[#0F5C5C] flex items-center">
              <IndianRupee className="w-4 h-4" />
              {property.priceINR.toLocaleString('en-IN')}<span className="text-sm font-normal text-gray-500">/mo</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <input 
                type="checkbox" 
                className="hidden" 
                checked={isCompared}
                onChange={() => onToggleCompare?.(property.id)}
              />
              {isCompared ? <CheckSquare className="w-4 h-4 text-[#0F5C5C]" /> : <Square className="w-4 h-4" />}
              Compare
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
