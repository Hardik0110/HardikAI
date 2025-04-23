import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { Toaster } from "@/components/ui/toaster"
import IntroductionPage from "@/pages/IntroductionPage"
import LoginPage from "@/pages/LoginPage"
import DashboardPage from "@/pages/DashboardPage"
import OptimizePage from "@/pages/OptimizePage"
import AnalyzePage from "@/pages/AnalyzePage"
import ConvertPage from "@/pages/ConvertPage"
import DailyStandupPage from "@/pages/DailyStandupPage"

function App() {
  const location = useLocation()

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<IntroductionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/optimize" element={<OptimizePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/convert" element={<ConvertPage />} />
          <Route path="/dailystandup" element={<DailyStandupPage />} />
        </Routes>
      </AnimatePresence>
      <Toaster />
    </>
  )
}

export default App
