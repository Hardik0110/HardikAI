import { Button } from "@/components/ui/button"
import { type LucideIcon, Sparkles, FileText, CheckCircle, Bug } from "lucide-react"
import { motion } from "framer-motion"

type OptimizeButtonProps = {
  onClick: () => void
  isLoading: boolean
  icon: "Sparkles" | "FileText" | "CheckCircle" | "Bug" | "Component"
  label: string
  description: string
  index?: number
  variant?: "optimize" | "convert"  
}

const variants = {
  optimize: {
    hoverBg: "hover:bg-cyan/10 dark:hover:bg-cyan/20",
    border: "border-cyan/20 dark:border-cyan/30",
    hoverBorder: "hover:border-cyan dark:hover:border-cyan/70",
    shadow: "hover:shadow-cyan/10 dark:hover:shadow-cyan/20",
    iconColors: ["text-cyan-500", "text-cyan-400"],
    textColors: "text-cyan-700 dark:text-cyan-300"
  },
  convert: {
    hoverBg: "hover:bg-purple-500/10 dark:hover:bg-purple-500/20",
    border: "border-purple-500/20 dark:border-purple-500/30",
    hoverBorder: "hover:border-purple-500 dark:hover:border-purple-400",
    shadow: "hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20",
    iconColors: ["text-purple-500", "text-purple-400"],
    textColors: "text-purple-700 dark:text-purple-300"
  }
} as const

export function CodeOptimizeButton({ 
  onClick, 
  isLoading, 
  icon, 
  label, 
  description, 
  index = 0,
  variant = "optimize" 
}: OptimizeButtonProps) {
  const IconComponent: LucideIcon =
    icon === "Sparkles" ? Sparkles : icon === "FileText" ? FileText : icon === "CheckCircle" ? CheckCircle : Bug 

  const theme = variants[variant]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Button
        variant="outline"
        className={`flex h-auto w-full flex-col items-start gap-1 p-4 text-left 
          ${theme.border} ${theme.hoverBorder} hover:shadow-sm ${theme.shadow} 
          transition-all duration-300 ${theme.hoverBg}`}
        disabled={isLoading}
        onClick={onClick}
      >
        <div className="flex w-full items-center gap-2">
          <IconComponent className={`h-5 w-5 shrink-0 ${
            index % 2 === 0 ? theme.iconColors[0] : theme.iconColors[1]
          }`} />
          <span className={`font-medium ${theme.textColors}`}>{label}</span>
        </div>
        <span className={`text-xs ${theme.textColors} opacity-80`}>{description}</span>
      </Button>
    </motion.div>
  )
}
