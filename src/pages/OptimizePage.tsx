import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { CodeOptimizeButton } from "@/components/code-optimize-button"
import { motion } from "framer-motion"
import { optimizeCode } from "@/lib/api"
import { OptimizationType } from "@/lib/types"

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

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <motion.h1
          className="mb-6 text-3xl font-bold text-gradient"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Optimize Code
        </motion.h1>

        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Textarea
                placeholder="Paste your code here..."
                className="min-h-[400px] font-mono border-cyan/20 focus:border-cyan focus:ring-cyan"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </motion.div>

            {optimizedCode && (
              <motion.div
                className="rounded-md border border-pink/20 p-4 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-medium text-gradient">Optimized Code:</h2>
                  {usedModel && (
                    <span className="text-xs text-muted-foreground">Optimized with: {usedModel}</span>
                  )}
                </div>
                <pre className="whitespace-pre-wrap break-all rounded-md bg-dark/5 p-4 font-mono text-sm">
                  {optimizedCode}
                </pre>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="mt-2 border-pink/20 hover:border-pink hover:bg-pink/5"
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
              </motion.div>
            )}
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
      </div>
    </DashboardLayout>
  )
}