import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { DashboardNav } from "@/components/DashboardNav"
import { Breadcrumbs } from "@/components/BreadCrumbs"
import { motion } from "framer-motion"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen flex-col ">
      <header className="shrink-0 sticky top-0 z-10 border-b  backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <motion.span
              className="text-2xl font-bold text-gradient"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Hardik's AI
            </motion.span>
          </Link>
          <nav className="flex items-center gap-4">
            <DashboardNav />
            <Link to="/">
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="shrink-0 container py-1 border-b">
        <Breadcrumbs />
      </div>

      <motion.main
        className="flex-1  bg-muted/40"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container px-4 pt-2 pb-4 flex flex-col items-center">
          
          {children}
        </div>
      </motion.main>
    </div>
  )
}