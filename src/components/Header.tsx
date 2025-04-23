import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Code, FileCode, Home, LineChart, Speech } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const navItems = [
  { path: "/dashboard",    label: "Dashboard",    icon: Home,      color: "#08D9D6" },
  { path: "/optimize",     label: "Optimize",     icon: Code,      color: "#08D9D6" },
  { path: "/analyze",      label: "Analyze",      icon: LineChart, color: "#DC2626" },
  { path: "/convert",      label: "Convert",      icon: FileCode,  color: "#9333EA" },
  { path: "/standup",      label: "DailyStandup", icon: Speech,    color: "#F59E0B" },
]

export function DashboardNav() {
  const { pathname } = useLocation()
  const activeColor = navItems.find(item => item.path === pathname)?.color || "#000"

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
          className="cursor-pointer w-full rounded-lg border-2 p-2 text-center text-base font-medium focus:outline-none focus:ring-2"
          style={{ borderColor: activeColor, color: activeColor }}
        >
          {navItems.map(({ path, label, color }) => (
            <option key={path} value={path} style={{ color: color }}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <nav className="hidden md:flex items-center gap-2">
        {navItems.map(({ path, label, icon: Icon, color }, idx) => {
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
                    isActive
                      ? `bg-[${color}] text-black`
                      : `hover:bg-[${color}]/20 hover:text-[${color}]`
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
