import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface BreadcrumbsProps {
  className?: string
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const location = useLocation()
  const pathname = location.pathname

  // Skip rendering breadcrumbs on the home page
  if (pathname === "/") return null

  // Generate breadcrumb items based on the current path
  const pathSegments = pathname.split("/").filter(Boolean)

  // Create breadcrumb items with proper labels
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`

    // Format the segment for display (capitalize first letter)
    const label = segment.charAt(0).toUpperCase() + segment.slice(1)

    return { href, label }
  })

  // Add home as the first item
  const items = [{ href: "/", label: "Home" }, ...breadcrumbItems]

  return (
    <nav aria-label="Breadcrumbs" className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground text-white" />}

            {index === items.length - 1 ? (
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to={item.href} className="text-muted-foreground hover:text-primary transition-colors">
                  {index === 0 ? <Home className="h-4 w-4 text-white" /> : item.label}
                </Link>
              </motion.div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
