import { Link } from "react-router-dom"
import { CodeIcon, LineChart, FileCode } from "lucide-react" // Add FileCode icon
import { motion } from "framer-motion"
import { PixelCanvas } from "@/components/ui/pixel-canvas"
import { DashboardLayout } from "@/components/dashboard-layout"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.5 },
  }),
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <h2 className="text-xl sm:text-2xl font-medium mb-2 mt-6">
        <span className="text-cyan">
          Choose an<span className="text-pink "> Option Below</span>
        </span>
      </h2>
      <div className="flex items-center justify-center mt-6">
        <div className="grid gap-8 md:grid-cols-3 justify-items-center"> {/* Changed to grid-cols-3 */}
          
          <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
            <Link to="/optimize" className="transition-transform hover:scale-[1.02]">
              <button className="group relative w-[24rem] h-[24rem] rounded-2xl overflow-hidden border border-[#08D9D6]"> {/* Adjusted size */}
                <PixelCanvas
                  gap={10}
                  speed={25}
                  colors={["#D1FAE5", "#10B981", "#08D9D6"]}
                  variant="icon"
                />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <CodeIcon className="w-20 h-20 text-[#08D9D6] group-hover:text-cyan-300" />
                </div>
              </button>
            </Link>
          </motion.div>

          <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
            <Link to="/analyze" className="transition-transform hover:scale-[1.02]">
              <button className="group relative w-[24rem] h-[24rem] rounded-2xl overflow-hidden border border-red-500"> {/* Adjusted size */}
                <PixelCanvas
                  gap={10}
                  speed={25}
                  colors={["#FEE2E2", "#F87171", "#DC2626"]}
                  variant="icon"
                />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <LineChart className="w-20 h-20 text-red-500 group-hover:text-red-400" />
                </div>
              </button>
            </Link>
          </motion.div>

          {/* New Convert option */}
          <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
            <Link to="/convert" className="transition-transform hover:scale-[1.02]">
              <button className="group relative w-[24rem] h-[24rem] rounded-2xl overflow-hidden border border-purple-500">
                <PixelCanvas
                  gap={10}
                  speed={25}
                  colors={["#F3E8FF", "#C084FC", "#9333EA"]} 
                  variant="icon"
                />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <FileCode className="w-20 h-20 text-purple-500 group-hover:text-purple-400" />
                </div>
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}