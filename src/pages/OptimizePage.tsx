import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { CodeOptimizeButton } from "@/components/code-optimize-button"
import { motion, AnimatePresence } from "framer-motion"
import { optimizeCode } from "@/lib/api"
import { OptimizationType } from "@/lib/types"
import { X } from "lucide-react"

export default function OptimizePage() {
  const { toast } = useToast()
  const [code, setCode] = useState("")
  const [optimizedCode, setOptimizedCode] = useState("")
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [usedModel, setUsedModel] = useState<string | null>(null)

  const handleOptimize = async (optimizationType: OptimizationType) => {
    if (!code.trim()) {
      toast({
        title: "No code provided",
        description: "Please enter some code to optimize",
        variant: "destructive",
      })
      return
    }

    setIsOptimizing(true)

    try {
      const response = await optimizeCode({
        code,
        optimizationType
      })

      setOptimizedCode(response.optimizedCode)
      setUsedModel(response.usedModel)

      toast({
        title: "Code optimized",
        description: `Applied ${optimizationType} optimizations`,
      })
    } catch (error) {
      toast({
        title: "Optimization failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const closePopup = () => {
    setOptimizedCode("")
    setUsedModel(null)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <motion.h1
          className="mb-6 text-3xl font-bold text-gradient"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Optimize Code By Entering Your Code Below 
        </motion.h1>

        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="space-y-4 ">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Textarea
                placeholder="Paste your code here..."
                className="min-h-[600px] font-bold border-cyan/20 focus:border-cyan focus:ring-cyan text-white"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </motion.div>
          </div>

          <div className="flex flex-col gap-3">
            <CodeOptimizeButton
              onClick={() => handleOptimize("hooks")}
              isLoading={isOptimizing}
              icon="Sparkles"
              label="Use Modern Hooks"
              description="Convert class components to functional components with hooks"
              index={0}
            />

            <CodeOptimizeButton
              onClick={() => handleOptimize("readability")}
              isLoading={isOptimizing}
              icon="FileText"
              label="Improve Readability"
              description="Format code and improve variable naming"
              index={1}
            />

            <CodeOptimizeButton
              onClick={() => handleOptimize("linting")}
              isLoading={isOptimizing}
              icon="CheckCircle"
              label="Fix Linting and Types"
              description="Add proper TypeScript types and fix linting issues"
              index={2}
            />

            <CodeOptimizeButton
              onClick={() => handleOptimize("bugs")}
              isLoading={isOptimizing}
              icon="Bug"
              label="Fix Bugs"
              description="Identify and fix common bugs and anti-patterns"
              index={3}
            />
          </div>
        </div>

        <AnimatePresence>
          {optimizedCode && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={closePopup}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-medium text-gradient">Optimized Code:</h2>
                    {usedModel && (
                      <span className="text-xs text-muted-foreground">Optimized with: {usedModel}</span>
                    )}
                  </div>
                  <pre className="whitespace-pre-wrap break-all rounded-md bg-gray-50 p-4 font-mono text-sm border border-pink/10">
                    {optimizedCode}
                  </pre>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="w-full border-red-400 hover:border-red hover:bg-red-400"
                      onClick={() => {
                        navigator.clipboard.writeText(optimizedCode)
                        toast({
                          title: "Copied to clipboard",
                          description: "The optimized code has been copied to your clipboard",
                        })
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                  </motion.div>
                  <Button onClick={closePopup} className="w-full">
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}