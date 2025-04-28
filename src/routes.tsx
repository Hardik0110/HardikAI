import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { Toaster } from "@/components/ui/toaster"
import IntroductionPage from "@/pages/IntroductionPage"
import LoginPage from "@/pages/LoginPage"
import DashboardPage from "@/pages/DashboardPage"
import OptimizePage from "@/pages/Optimize/OptimizePage"
import AnalyzePage from "@/pages/Analyze/AnalyzePage"
import ConvertPage from "@/pages/Convert/ConvertPage"
import DailyStandupPage from "@/pages/Standup/DailyStandupPage"
import { DashboardLayout } from "./components/DashboardLayout"

function Router() {
  const location = useLocation()

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<IntroductionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/optimize" element={<OptimizePage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/convert" element={<ConvertPage />} />
            <Route path="/standup" element={<DailyStandupPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
      <Toaster />
    </>
  )
}

export default Router
