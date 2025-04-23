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
}

export function CodeOptimizeButton({ onClick, isLoading, icon, label, description, index = 0 }: OptimizeButtonProps) {
  const IconComponent: LucideIcon =
    icon === "Sparkles" ? Sparkles : icon === "FileText" ? FileText : icon === "CheckCircle" ? CheckCircle : Bug 

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
        className="flex h-auto w-full flex-col items-start gap-1 p-4 text-left border-cyan/20 hover:border-cyan hover:shadow-sm hover:shadow-cyan/10 transition-all duration-300"
        disabled={isLoading}
        onClick={onClick}
      >
        <div className="flex w-full items-center gap-2">
          <IconComponent className={`h-5 w-5 shrink-0 ${index % 2 === 0 ? "text-cyan" : "text-pink"}`} />
          <span className="font-medium">{label}</span>
        </div>
        <span className="text-xs text-muted-foreground">{description}</span>
      </Button>
    </motion.div>
  )
}
