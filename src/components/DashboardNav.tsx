import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Code, FileCode, Home, LineChart, Speech } from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: Home,
  },
  {
    path: "/optimize",
    label: "Optimize",
    icon: Code,
  },
  {
    path: "/analyze",
    label: "Analyze",
    icon: LineChart,
  },
  {
    path: "/convert",
    label: "Convert",
    icon: FileCode,
  },
  {
    path: "/dailystandup",
    label: "DailyStandup",
    icon: Speech,
  }
]

export function DashboardNav() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <nav className="flex items-center gap-1">
      {navItems.map((item, index) => {
        const isActive = pathname === item.path
        return (
          <Link to={item.path} key={item.path}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "gap-1",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            </motion.div>
          </Link>
        )
      })}
    </nav>
  )
}
