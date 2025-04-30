import { Link } from "react-router-dom"
import { CodeIcon, LineChart, FileCode, Speech } from "lucide-react" 
import { motion } from "framer-motion"
import { PixelCanvas } from "@/components/ui/pixel-canvas"
import { memo } from "react"

interface BackgroundImageProps {
  src: string;
  position: string;
  maxWidth?: string;
}

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

const BACKGROUND_IMAGES = [
  { src: "../assets/optimize.png", position: "left-16 -top-12", maxWidth: undefined },
  { src: "../assets/analyze.png", position: "right-16 -top-10", maxWidth: undefined },
  { src: "../assets/dailystandup.png", position: "right-20 -bottom-10", maxWidth: undefined },
  { src: "../assets/convert.png", position: "left-16 -bottom-20", maxWidth: undefined }
]

const CARD_CONFIG = [
  { 
    path: "/optimize", 
    borderColor: "border-[#08D9D6]", 
    colors: ["#D1FAE5", "#10B981", "#08D9D6"],
    icon: CodeIcon,
    iconColor: "text-[#08D9D6]",
    hoverColor: "group-hover:text-cyan-300",
    alt: "Code Optimization"
  },
  { 
    path: "/analyze", 
    borderColor: "border-red-500", 
    colors: ["#FEE2E2", "#F87171", "#DC2626"],
    icon: LineChart,
    iconColor: "text-red-500",
    hoverColor: "group-hover:text-red-400",
    alt: "Data Analysis"
  },
  { 
    path: "/convert", 
    borderColor: "border-purple-500", 
    colors: ["#F3E8FF", "#C084FC", "#9333EA"],
    icon: FileCode,
    iconColor: "text-purple-500",
    hoverColor: "group-hover:text-purple-400",
    alt: "File Conversion"
  },
  { 
    path: "/standup", 
    borderColor: "border-yellow-500", 
    colors: ["#FFFBEB", "#FCD34D", "#F59E0B"],
    icon: Speech,
    iconColor: "text-yellow-500",
    hoverColor: "group-hover:text-yellow-400",
    alt: "Daily Standup"
  }
]

const BackgroundImage = memo(({ src, position, maxWidth }: BackgroundImageProps) => (
  <motion.img
    src={src}
    alt=""
    className={`fixed ${position} w-[600px] h-[600px] opacity-70 lg:block hidden pointer-events-none`}
    style={{ maxWidth: maxWidth || '30vw' }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.7 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  />
))

BackgroundImage.displayName = 'BackgroundImage'



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
        {BACKGROUND_IMAGES.map((img, index) => (
          <BackgroundImage
            key={`bg-${index}`}
            src={img.src}
            position={img.position}
            maxWidth={img.maxWidth}
          />
        ))}

        <div className="grid gap-8 md:grid-cols-2 justify-items-center">
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