import { Link, Outlet } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { DashboardNav } from "@/components/Header"
import { Breadcrumbs } from "@/components/BreadCrumbs"
import { motion } from "framer-motion"
import { LightPullThemeSwitcher } from "@/components/ui/light-pull-theme-switcher"

export function DashboardLayout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden relative">
      <div className="absolute inset-0 bg-white dark:bg-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(253, 223, 71, 0.25),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(253,224,71,0.05),transparent_70%)]" />
      </div>

      <header className="shrink-0 sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.span
              className="text-2xl font-bold text-gradient"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            > 
              AI Code Optimizer
            </motion.span>
          </Link>
          <nav className="flex items-center gap-4">
            <DashboardNav />
            <Link to="/login">
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
        className="flex-1 overflow-y-scroll scrollbar-hide relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <div className="absolute right-2 flex flex-col items-center">
            <LightPullThemeSwitcher />
            <span className="mt-2 text-xs text-extrabold">
              Pull to switch theme
            </span>
          </div>
        </div>

        <div className="container px-4 pt-6 pb-4 flex flex-col items-center">
          <Outlet />
        </div>
      </motion.main>
    </div>
  )
}