import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/DashboardLayout"
import { useToast } from "@/hooks/use-toast"
import { CodeOptimizeButton } from "@/components/CodeOptimizeButton"
import { motion, AnimatePresence } from "framer-motion"
import { convertCode } from "@/lib/api"
import { ConversionType } from "@/lib/types"
import { X } from "lucide-react"

const ACCENT = "#9333EA"

export default function ConvertPage() {
  const { toast } = useToast()
  const [code, setCode] = useState("")
  const [convertedCode, setConvertedCode] = useState("")
  const [isConverting, setIsConverting] = useState(false)
  const [usedModel, setUsedModel] = useState<string | null>(null)

  const handleConvert = async (conversionType: ConversionType) => {
    if (!code.trim()) {
      toast({
        title: "No code provided",
        description: "Please enter some code to convert",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    try {
      console.log(`Starting conversion: ${conversionType}`);
      
      const response = await convertCode({
        code,
        conversionType
      })

      console.log('Conversion successful:', response);
      
      setConvertedCode(response.convertedCode)
      setUsedModel(response.usedModel)

      toast({
        title: "Code converted",
        description: `Converted using ${conversionType}`,
      })
    } catch (error) {
      console.error('Conversion error:', error);
      
      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  const closePopup = () => {
    setConvertedCode("")
    setUsedModel(null)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <motion.h1
          className="mb-6 text-3xl font-bold"
          style={{
            background: `linear-gradient(to right, ${ACCENT}, #C084FC)`,
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Convert Code
        </motion.h1>

        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Textarea
                placeholder="Paste your code here..."
                className="min-h-[600px] font-mono border-b"
                style={{ borderColor: ACCENT }}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </motion.div>
          </div>

          <div className="flex flex-col gap-3">
            {( [
                "javascript-to-typescript",
                "typescript-to-python",
                "python-to-javascript",
                "react-to-vue",
                "vue-to-react",
                "javascript-to-java",
              ] as ConversionType[] ).map((ct, i) => (
              <CodeOptimizeButton
                key={ct}
                onClick={() => handleConvert(ct)}
                isLoading={isConverting}
                icon="FileText"
                label={ct.replace(/-/g, " ").toUpperCase()}
                description={`Convert via ${ct}`}
                index={i}
              />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {convertedCode && (
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
                    <h2 className="text-lg font-medium text-gradient">Converted Code:</h2>
                    {usedModel && (
                      <span className="text-xs text-muted-foreground">Converted with: {usedModel}</span>
                    )}
                  </div>
                  <pre className="whitespace-pre-wrap break-all rounded-md bg-gray-50 p-4 font-mono text-sm border border-pink/10">
                    {convertedCode}
                  </pre>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="w-full border-red-400 hover:border-red hover:bg-red-400"
                      onClick={() => {
                        navigator.clipboard.writeText(convertedCode)
                        toast({
                          title: "Copied to clipboard",
                          description: "The converted code has been copied to your clipboard",
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