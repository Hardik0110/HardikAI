import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { X, ClipboardList, Copy, CheckCircle } from 'lucide-react'
import type { StandupResult } from '@/lib/types'

interface StandupPopupProps {
  result: StandupResult
  onClose: () => void
}

export function StandupPopup({ result, onClose }: StandupPopupProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.formattedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  }

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-black/80 rounded-lg shadow-xl p-8 max-w-3xl w-full m-4 max-h-[85vh] overflow-y-auto relative border border-yellow-400/20"
        variants={popupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors"
          aria-label="Close popup"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-yellow-400" />
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                Daily Standup Report
              </h3>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-yellow-400/50 hover:border-yellow-400 text-yellow-400 hover:text-yellow-300 flex items-center gap-2 mr-5 mt-6"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Report
                </>
              )}
            </Button>
          </div>

          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
              {result.formattedText}
            </pre>
          </div>

          <Button 
            onClick={onClose} 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
          >
            Close Report
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}