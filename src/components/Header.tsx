import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { BotMessageSquare, Code, FileCode, Home, LineChart, Speech } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const navItems = [
  { 
    path: "/dashboard", 
    label: "Dashboard", 
    icon: Home, 
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-500/20 hover:text-blue-500" 
  },
  { 
    path: "/optimize", 
    label: "Optimize", 
    icon: Code, 
    color: "bg-[#10B981]",
    hoverColor: "hover:bg-[#10B981]/20 hover:text-[#10B981]"
  },
  // { 
  //   path: "/analyze", 
  //   label: "Analyze", 
  //   icon: LineChart, 
  //   color: "bg-red-600",
  //   hoverColor: "hover:bg-red-600/20 hover:text-red-600"
  // },
  { 
    path: "/convert", 
    label: "Convert", 
    icon: FileCode, 
    color: "bg-purple-600",
    hoverColor: "hover:bg-purple-600/20 hover:text-purple-600"
  },
  // { 
  //   path: "/standup", 
  //   label: "DailyStandup", 
  //   icon: Speech, 
  //   color: "bg-amber-500",
  //   hoverColor: "hover:bg-amber-500/20 hover:text-amber-500"
  // },
  { 
    path: "/prompt", 
    label: "Prompt", 
    icon: BotMessageSquare, 
    color: "bg-sky-600",
    hoverColor: "hover:bg-sky-500/20 hover:text-sky-500"
  },
]

export function DashboardNav() {
  const { pathname } = useLocation()
  const activeItem = navItems.find(item => item.path === pathname)

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    window.location.href = e.target.value
  }

  return (
    <>
      {/* Mobile dropdown */}
      <div className="block md:hidden px-4">
        <select
          value={pathname}
          onChange={handleSelect}
          className={cn(
            "cursor-pointer w-full rounded-lg border-2 p-2 text-center text-base font-medium focus:outline-none focus:ring-2",
            activeItem?.color.replace('bg-', 'border-').replace('border-opacity-20', '')
          )}
        >
          {navItems.map(({ path, label }) => (
            <option key={path} value={path}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center gap-2">
        {navItems.map(({ path, label, icon: Icon, color, hoverColor }, idx) => {
          const isActive = pathname === path
          return (
            <Link key={path} to={path}>
              <motion.div
                className="group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.1 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1 transition-colors",
                    isActive ? color : hoverColor
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Button>
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
