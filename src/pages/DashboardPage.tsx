import { Link } from "react-router-dom"
import { CodeIcon, LineChart, FileCode, Speech } from "lucide-react" 
import { motion } from "framer-motion"
import { PixelCanvas } from "@/components/ui/pixel-canvas"
import { DashboardLayout } from "@/components/DashboardLayout"
import { CardVariants } from "@/lib/types"

const cardVariants: CardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
}

const backgroundImages = [
  { src: "../src/assets/optimize.png", position: "left-16 -top-12" },
  { src: "../src/assets/analyze.png", position: "right-16 -top-10" },
  { src: "../src/assets/dailystandup.png", position: "right-20 -bottom-10", maxWidth: "31vw" },
  { src: "../src/assets/convert.png", position: "left-16 -bottom-20", maxWidth: "31vw" }
]

const cardConfig = [
  { 
    path: "/optimize", 
    borderColor: "border-[#08D9D6]", 
    colors: ["#D1FAE5", "#10B981", "#08D9D6"],
    icon: CodeIcon,
    iconColor: "text-[#08D9D6]",
    hoverColor: "group-hover:text-cyan-300"
  },
  { 
    path: "/analyze", 
    borderColor: "border-red-500", 
    colors: ["#FEE2E2", "#F87171", "#DC2626"],
    icon: LineChart,
    iconColor: "text-red-500",
    hoverColor: "group-hover:text-red-400"
  },
  { 
    path: "/convert", 
    borderColor: "border-purple-500", 
    colors: ["#F3E8FF", "#C084FC", "#9333EA"],
    icon: FileCode,
    iconColor: "text-purple-500",
    hoverColor: "group-hover:text-purple-400"
  },
  { 
    path: "/standup", 
    borderColor: "border-yellow-500", 
    colors: ["#FFFBEB", "#FCD34D", "#F59E0B"],
    icon: Speech,
    iconColor: "text-yellow-500",
    hoverColor: "group-hover:text-yellow-400"
  }
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="relative container mx-auto px-4">
        <div className="relative flex items-center justify-center mt-6">
          {backgroundImages.map((img, index) => (
            <motion.img
              key={index}
              src={img.src}
              alt=""
              className={`fixed ${img.position} w-[600px] h-[600px] opacity-70 lg:block hidden pointer-events-none`}
              style={{ maxWidth: img.maxWidth || '30vw' }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 0.7, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}

          <div className="grid gap-8 md:grid-cols-2 justify-items-center">
            {cardConfig.map((card, index) => (
              <motion.div 
                key={index}
                custom={index} 
                variants={cardVariants} 
                initial="hidden" 
                animate="visible"
              >
                <Link to={card.path} className="transition-transform hover:scale-[1.02]">
                  <button className={`group relative w-[24rem] h-[18rem] rounded-2xl overflow-hidden border ${card.borderColor}`}>
                    <PixelCanvas
                      gap={10}
                      speed={25}
                      colors={card.colors}
                      variant="icon"
                    />
                    <div className="relative z-10 flex items-center justify-center h-full">
                      <card.icon className={`w-20 h-20 ${card.iconColor} ${card.hoverColor}`} />
                    </div>
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}