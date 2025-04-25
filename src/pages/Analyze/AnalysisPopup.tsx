import { motion } from "framer-motion";
import { X, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "@/lib/types";

type AnalysisPopupProps = {
  analysisResult: AnalysisResult;
  onClose: () => void;
};

export const AnalysisPopup = ({ analysisResult, onClose }: AnalysisPopupProps) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-black/60 rounded-lg shadow-xl p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        <X className="h-5 w-5" />
      </button>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-pink" />
          <h3 className="text-lg font-medium text-gradient">Analysis Results</h3>
        </div>
        {[
          { title: "Technical Trends", content: analysisResult.technicalTrends },
          { title: "Volume Patterns", content: analysisResult.volumePatterns },
          { 
            title: "Support/Resistance Levels", 
            content: `Support: ${analysisResult.supportResistance.support} | Resistance: ${analysisResult.supportResistance.resistance}`
          },
          { title: "Short-term Outlook", content: analysisResult.shortTermOutlook },
          { title: "Stop Loss", content: analysisResult.stopLoss.toFixed(4) },
        ].map(({ title, content }) => (
          <div key={title} className="rounded-md bg-gray-500 p-4 border border-pink/10">
            <h4 className="font-medium mb-2">{title}</h4>
            <p className="text-sm">{content}</p>
          </div>
        ))}
        <Button onClick={onClose} className="w-full">Close</Button>
      </div>
    </motion.div>
  </motion.div>
);