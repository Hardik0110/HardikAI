import { motion } from "framer-motion"
import { X, LineChart, TrendingUp, ArrowUpDown, Shield, Binoculars } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStockAnalysisStore } from "@/lib/stores/useStockAnalysisStore"

export const AnalysisPopup = ({ onClose }: { onClose: () => void }) => {
  const { analysisResult } = useStockAnalysisStore()
  if (!analysisResult) return null

  const items = [
    { title: "Technical Analysis", content: analysisResult.technicalAnalysis, icon: <LineChart className="h-4 w-4 text-blue-400" /> },
    { title: "Market Trends", content: analysisResult.marketTrends, icon: <TrendingUp className="h-4 w-4 text-green-400" /> },
    { title: "Support & Resistance", content: analysisResult.supportResistance, icon: <ArrowUpDown className="h-4 w-4 text-yellow-400" /> },
    { title: "Stop Loss", content: analysisResult.stopLoss, icon: <Shield className="h-4 w-4 text-red-400" /> },
    { title: "Overall Outlook", content: analysisResult.outlook, icon: <Binoculars className="h-4 w-4 text-purple-400" /> },
  ]

  return (
    <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="bg-black/60 rounded-lg shadow-xl p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto relative" initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: .8, opacity: 0 }} transition={{ duration: .3 }}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"><X className="h-5 w-5"/></button>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-pink" />
            <h3 className="text-lg font-medium text-gradient">Stock Analysis Results</h3>
          </div>
          {items.map(({ title, content, icon }) => (
            <div key={title} className="rounded-md bg-gray-800/60 p-4 border border-pink/10 hover:border-pink/20 transition-colors">
              <div className="flex items-center gap-2 mb-2">{icon}<h4 className="font-medium text-gray-200">{title}</h4></div>
              <p className="text-sm text-gray-300 leading-relaxed">{content}</p>
            </div>
          ))}
          {analysisResult.usedModel && <p className="text-xs text-gray-500 text-center mt-4">Analysis by: {analysisResult.usedModel}</p>}
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
