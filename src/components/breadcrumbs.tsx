import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface BreadcrumbsProps {
  className?: string
}

const routeColorMap = {
  optimize: "text-cyan-500 dark:text-cyan-400",
  analyze: "text-red-500 dark:text-red-400",
  convert: "text-purple-500 dark:text-purple-400",
  standup: "text-yellow-500 dark:text-yellow-400",
  default: "text-foreground"
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const location = useLocation()
  const pathname = location.pathname

  if (pathname === "/") return null

  const pathSegments = pathname.split("/").filter(Boolean)
  
  const baseRoute = pathSegments[0]
  const activeColor = routeColorMap[baseRoute as keyof typeof routeColorMap] || routeColorMap.default

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`
    const label = segment.charAt(0).toUpperCase() + segment.slice(1)

    return { href, label }
  })

  const items = [{ href: "/", label: "Home" }, ...breadcrumbItems]

  return (
    <nav 
      aria-label="Breadcrumbs" 
      className={cn(
        "flex items-center text-sm relative py-2 px-4 rounded-full",
        className
      )}
      style={{
        background: "linear-gradient(90deg, rgba(8,217,214,0.15) 0%, rgba(220,38,38,0.15) 33%, rgba(147,51,234,0.15) 66%, rgba(245,158,11,0.15) 100%)"
      }}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
            )}

            {index === items.length - 1 ? (
              <span className={cn("font-medium", activeColor)}>{item.label}</span>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={item.href}
                  className={cn(
                    "hover:text-primary transition-colors",
                    index === 0 ? "text-muted-foreground" : 
                      index === items.length - 1 ? activeColor : "text-muted-foreground"
                  )}
                >
                  {index === 0 ? (
                    <Home className={cn("h-4 w-4", baseRoute ? routeColorMap[baseRoute as keyof typeof routeColorMap] : "dark:text-cyan-400")} />
                  ) : (
                    item.label
                  )}
                </Link>
              </motion.div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}