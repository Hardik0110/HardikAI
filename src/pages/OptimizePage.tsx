import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { CodeOptimizeButton } from "@/components/code-optimize-button"
import { motion } from "framer-motion"

export default function OptimizePage() {
  const { toast } = useToast()
  const [code, setCode] = useState("")
  const [optimizedCode, setOptimizedCode] = useState("")
  const [isOptimizing, setIsOptimizing] = useState(false)

  const handleOptimize = (optimizationType: string) => {
    if (!code.trim()) {
      toast({
        title: "No code provided",
        description: "Please enter some code to optimize",
        variant: "destructive",
      })
      return
    }

    setIsOptimizing(true)

    setTimeout(() => {
      let result = code

      if (optimizationType === "hooks") {
        result = `// Optimized with Modern Hooks\n${code.replace(/class\s+Component/g, "function Component").replace(/this\.state/g, "useState")}`
      } else if (optimizationType === "readability") {
        result = `// Improved Readability\n${code.split(";").join(";\n")}`
      } else if (optimizationType === "linting") {
        result = `// Fixed Linting and Types\ntype Props = {};\n${code}`
      } else if (optimizationType === "bugs") {
        result = `// Fixed Bugs\n${code.replace(/console\.log/g, "// console.log")}`
      }

      setOptimizedCode(result)
      setIsOptimizing(false)

      toast({
        title: "Code optimized",
        description: `Applied ${optimizationType} optimizations`,
      })
    }, 1500)
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
                <h2 className="mb-2 text-lg font-medium text-gradient">Optimized Code:</h2>
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
