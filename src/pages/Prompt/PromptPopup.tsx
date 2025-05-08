import { motion } from "framer-motion"
import { X, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { usePromptStore } from "@/lib/stores/usePromptStore"
import { PromptPopupProps } from "@/lib/types";

const PromptPopup: React.FC<PromptPopupProps> = () => {
  const { toast } = useToast()
  const { generatedPrompt, setGeneratedPrompt } = usePromptStore()

  const handleCopy = async () => {
    if (!generatedPrompt) return
    await navigator.clipboard.writeText(generatedPrompt)
    toast({
      title: "Copied",
      description: "Prompt copied to clipboard",
    })
  }

  if (!generatedPrompt) return null

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-sky-950/90 rounded-lg shadow-xl p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <button
          onClick={() => setGeneratedPrompt(null)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-sky-400">Generated Prompt</h3>

          <div className="bg-sky-900/50 rounded-md p-4 border border-sky-400/20">
            <p className="text-gray-200 whitespace-pre-wrap">{generatedPrompt}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="text-sky-400 border-sky-400 hover:bg-sky-400/20"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button
              variant="default"
              className="bg-sky-600 hover:bg-sky-700"
              onClick={() => setGeneratedPrompt(null)}
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PromptPopup
