import { Link } from "react-router-dom"
import { CodeIcon, LineChart, FileCode, Speech, BotMessageSquare, Dog } from "lucide-react" 
import { motion } from "framer-motion"
import { PixelCanvas } from "@/components/ui/pixel-canvas"
import { memo } from "react"

interface DashboardCardProps {
  card: typeof CARD_CONFIG[0];
  index: number;
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
}

const CARD_CONFIG = [
  { 
    path: "/optimize",  
    name: "Optimize",
    nameColor: "#08D9D6",
    borderColor: "border-[#08D9D6]", 
    colors: ["#D1FAE5", "#10B981", "#08D9D6"],
    icon: CodeIcon,
    iconColor: "text-[#08D9D6]",
    hoverColor: "group-hover:text-cyan-300",
    alt: "Code Optimization"
  },
  { 
    path: "/analyze",
    name: "Analyze",
    nameColor: "#DC2626",
    borderColor: "border-red-500", 
    colors: ["#FEE2E2", "#F87171", "#DC2626"],
    icon: LineChart,
    iconColor: "text-red-500",
    hoverColor: "group-hover:text-red-400",
    alt: "Data Analysis"
  },
  { 
    path: "/convert",
    name: "Convert",
    nameColor: "#9333EA",
    borderColor: "border-purple-500", 
    colors: ["#F3E8FF", "#C084FC", "#9333EA"],
    icon: FileCode,
    iconColor: "text-purple-500",
    hoverColor: "group-hover:text-purple-400",
    alt: "File Conversion"
  },
  { 
    path: "/standup",
    name: "Standup",
    nameColor: "#F59E0B",
    borderColor: "border-yellow-500", 
    colors: ["#FFFBEB", "#FCD34D", "#F59E0B"],
    icon: Speech,
    iconColor: "text-yellow-500",
    hoverColor: "group-hover:text-yellow-400",
    alt: "Daily Standup"
  },
  { 
    path: "/prompt",
    name: "Prompt",
    borderColor: "border-sky-600", 
    colors: ["#7DD3FC", "#0284C7", "#075985"],
    icon: BotMessageSquare,
    iconColor: "text-sky-600",
    hoverColor: "group-hover:text-sky-400",
    alt: "Prompt Generator"
  },
  { 
    path: "/login",
    name: "Prompt",
    borderColor: "border-green-600", 
    colors: ["#6EE7B7", "#22C55E", "#15803D"],
    icon: Dog,
    iconColor: "text-green-600",
    hoverColor: "group-hover:text-green-400",
    alt: "Prompt Generator"
  }
];



const DashboardCard = memo(({ card, index }: DashboardCardProps) => {
  const { path, borderColor, colors, icon: Icon, iconColor, hoverColor, alt } = card
  
  return (
    <motion.div 
      custom={index} 
      variants={CARD_VARIANTS} 
      initial="hidden" 
      animate="visible"
    >
      <Link 
        to={path} 
        className="transition-transform hover:scale-[1.02] block"
        aria-label={alt}
      >
        <div className={`group relative w-[24rem] h-[18rem] rounded-2xl overflow-hidden border ${borderColor}`}>
          <PixelCanvas 
            gap={10}
            speed={25}
            colors={colors}
            variant="icon"
          />
          <div className="relative z-10 flex items-center justify-center h-full">
            <Icon className={`w-20 h-20 ${iconColor} ${hoverColor}`} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
})

DashboardCard.displayName = 'DashboardCard'

export default function DashboardPage() {
  return (
    <div className="relative container mx-auto px-4">
      <div className="relative flex items-center justify-center mt-6">

        <div className="grid gap-8 md:grid-cols-3 justify-items-center">
          {CARD_CONFIG.map((card, index) => (
            <DashboardCard 
              key={`card-${index}`}
              card={card}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}