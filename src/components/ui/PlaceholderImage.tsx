import { Home, Coffee, Bed, Bath, ChefHat, Building2 } from "lucide-react"

export type PlaceholderType = "room" | "bathroom" | "common" | "kitchen" | "building" | "food";

export function PlaceholderImage({ type, label, date }: { type: PlaceholderType, label?: string, date?: string }) {
  const getIcon = () => {
    switch(type) {
      case "room": return <Bed className="w-12 h-12 text-[#0F5C5C]/30" />;
      case "bathroom": return <Bath className="w-12 h-12 text-[#0F5C5C]/30" />;
      case "common": return <Coffee className="w-12 h-12 text-[#0F5C5C]/30" />;
      case "kitchen": return <ChefHat className="w-12 h-12 text-[#0F5C5C]/30" />;
      case "building": return <Building2 className="w-12 h-12 text-[#0F5C5C]/30" />;
      case "food": return <Coffee className="w-12 h-12 text-[#F2A33A]/30" />;
      default: return <Home className="w-12 h-12 text-[#0F5C5C]/30" />;
    }
  }

  const getGradient = () => {
    return type === "food" 
      ? "from-amber-100 to-orange-50"
      : "from-teal-50 to-slate-100"
  }

  return (
    <div className={`relative w-full h-full bg-gradient-to-br ${getGradient()} flex items-center justify-center overflow-hidden group`}>
      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex flex-col items-center gap-2">
        {getIcon()}
        <span className="text-sm font-medium text-gray-500 bg-white/70 px-2 py-1 rounded-md backdrop-blur-sm shadow-sm">
          {label || "Sample Photo"}
        </span>
      </div>

      {date && (
        <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-1 rounded backdrop-blur-md">
          Photo taken: {date} (sample)
        </span>
      )}
    </div>
  )
}
