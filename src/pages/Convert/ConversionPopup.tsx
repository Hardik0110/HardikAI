import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useConvertStore } from "@/lib/stores/useConvertStore"; 

export function ConversionPopup() {
  const { toast } = useToast();

  const { convertedCode, usedModel, reset } = useConvertStore();

  const handleClose = () => {
    reset();
  };

  return (
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
          onClick={handleClose}
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
          <pre className="whitespace-pre-wrap break-all rounded-md dark:bg-black bg-white p-4 font-mono text-sm border border-pink/10 dark:text-gray-200 text-gray-800">
            {convertedCode}
          </pre>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="w-full border-red-400 hover:border-red hover:bg-purple-400"
              onClick={() => {
                navigator.clipboard.writeText(convertedCode);
                toast({
                  title: "Copied to clipboard",
                  description: "The converted code has been copied to your clipboard",
                });
              }}
            >
              Copy to Clipboard
            </Button>
          </motion.div>
          <Button onClick={handleClose} className="w-full bg-[#C084FC]">
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}