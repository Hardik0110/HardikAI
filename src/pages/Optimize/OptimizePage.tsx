import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CodeOptimizeButton } from "@/components/CodeOptimizeButton"
import { motion, AnimatePresence } from "framer-motion"
import { optimizeCode } from "@/lib/api"
import type { OptimizationType } from "@/lib/types"
import { X } from "lucide-react"
import CodeEditor from '@uiw/react-textarea-code-editor'
import { useOptimizeStore } from "@/lib/stores/useOptimizeStore"

const ACCENT = "#08D9D6"

export default function OptimizePage() {
  const { toast } = useToast()
  const {
    code,
    optimizedCode,
    isOptimizing,
    usedModel,
    setCode,
    setOptimizedCode,
    setIsOptimizing,
    setUsedModel,
  } = useOptimizeStore()

  const handleOptimize = async (optType: OptimizationType) => {
    if (!code.trim()) {
      toast({ title: "No code provided", description: "Please enter some code", variant: "destructive" })
      return
    }
    setIsOptimizing(true)
    try {
      const res = await optimizeCode({ code, optimizationType: optType })
      setOptimizedCode(res.optimizedCode)
      setUsedModel(res.usedModel)
      toast({ title: "Code optimized", description: `Applied ${optType}` })
    } catch (e: any) {
      toast({ title: "Optimization failed", description: e.message, variant: "destructive" })
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <motion.img
        src="../assets/AIrobot.png"
        alt=""
        className="absolute left-0 w-56 h-80 opacity-50 lg:block hidden transform -translate-x-1/4 translate-y-1/4"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.7, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.img
        src="../assets/Hero.png"
        alt=""
        className="absolute right-40 bottom-0 w-56 h-80 opacity-50 lg:block hidden transform -translate-x-1/4 translate-y-1/4"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.h1
        className="mb-6 text-3xl font-bold"
        style={{
          background: `linear-gradient(to right, ${ACCENT}, #10B981)`,
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Optimize Code By Entering Your Code Below
      </motion.h1>

      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        <CodeEditor
          language="js"
          placeholder="Paste your code here..."
          className="relative h-[600px] overflow-y-auto font-bold border-b rounded-md"
          data-color-mode="light"
          style={{
            fontSize: 16,
            backgroundColor: "rgba(12, 224, 135, 0.91)",
            fontFamily: 'ui-monospace, SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace',
            height: '600px',
            overflowY: 'auto',
          }}
          value={code}
          padding={18}
          onChange={(e) => setCode(e.target.value)}
        />

        <div className="flex flex-col gap-3">
          {(["hooks", "readability", "linting", "bugs"] as OptimizationType[]).map((opt, i) => (
            <CodeOptimizeButton
              key={opt}
              onClick={() => handleOptimize(opt)}
              isLoading={isOptimizing}
              icon={opt === "bugs" ? "Bug" : "FileText"}
              label={opt.charAt(0).toUpperCase() + opt.slice(1)}
              description={`Apply ${opt} optimizations`}
              index={i}
            />
          ))}
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
            <motion.div className="bg-black rounded-lg shadow-xl p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto relative">
              <button
                onClick={() => setOptimizedCode("")}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-medium" style={{ color: ACCENT }}>
                Optimized Code:
              </h2>
              {usedModel && (
                <span className="text-xs text-gray-400">
                  Optimized with: {usedModel}
                </span>
              )}
              <pre
                className="whitespace-pre-wrap break-all rounded-md bg-white p-4 font-mono text-sm border"
                style={{ borderColor: ACCENT }}
              >
                {optimizedCode}
              </pre>
              <Button
                variant="outline"
                className="w-full"
                style={{ borderColor: ACCENT, color: ACCENT }}
                onClick={() => {
                  navigator.clipboard.writeText(optimizedCode)
                  toast({ title: "Copied", description: "Copied to clipboard" })
                }}
              >
                Copy to Clipboard
              </Button>
              <Button onClick={() => setOptimizedCode("")} className="w-full">
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
