import { useToast } from "@/hooks/use-toast";
import { CodeOptimizeButton } from "@/components/CodeOptimizeButton";
import { motion, AnimatePresence } from "framer-motion";
import { convertCode } from "@/lib/api";
import {  ConversionType } from "@/lib/types";
import CodeEditor from "@uiw/react-textarea-code-editor";
import rehypePrism from "rehype-prism-plus";
import { useConvertStore } from "@/lib/stores/useConvertStore"; 

const ACCENT = "#9333EA";

export default function ConvertPage() {
  const { toast } = useToast();

  const { code, convertedCode, isConverting, usedModel, setCode, setConvertedCode, setIsConverting, setUsedModel, reset } =
    useConvertStore();

  const handleConvert = async (conversionType: ConversionType) => {
    if (!code.trim()) { 
      toast({
        title: "No code provided",
        description: "Please enter some code to convert",
        variant: "destructive",
      });
      return;
    }

    setIsConverting(true);

    try {
      console.log("Converting code:", {
        conversionType,
        codeLength: code.length,
        code: code.substring(0, 200) + "...",
      });

      const response = await convertCode({
        code,
        conversionType,
      });

      console.log("Conversion API Response:", {
        conversionType,
        convertedCode: response.convertedCode,
        usedModel: response.usedModel,
        timestamp: new Date().toISOString(),
        success: true,
      });

      setConvertedCode(response.convertedCode);
      setUsedModel(response.usedModel);

      toast({
        title: "Code converted",
        description: `Converted using ${conversionType}`,
      });
    } catch (error) {
      console.error("Conversion error:", {
        conversionType,
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Conversion failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const closePopup = () => {
    reset(); 
  };

  return (
    <div className="container mx-auto">
      <motion.img
        src="../assets/ConvertRobot.png"
        alt=""
        className="absolute left-0 w-52 h-80 lg:block hidden transform -translate-x-1/4"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 0.9, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CodeEditor
              language="ts"
              placeholder="Paste your code here..."
              className="relative min-h-[600px] font-mono border-b rounded-md"
              rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}
              style={{
                borderColor: ACCENT,
                fontSize: 16,
                backgroundColor: "rgba(108, 1, 230, 0.35)",
                fontFamily:
                  "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
              }}
              value={code}
              padding={18}
              onChange={(e) => setCode(e.target.value)}
            />
          </motion.div>
        </div>

        <div className="flex flex-col gap-3">
          {(
            [
              "javascript-to-typescript",
              "typescript-to-python",
              "python-to-javascript",
              "react-to-vue",
              "vue-to-react",
              "javascript-to-java",
            ] as ConversionType[]
          ).map((ct, i) => (
            <CodeOptimizeButton
              key={ct}
              onClick={() => handleConvert(ct)}
              isLoading={isConverting}
              icon="FileText"
              label={ct.replace(/-/g, " ").toUpperCase()}
              description={`Convert via ${ct}`}
              index={i}
              variant="convert"
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {Boolean(convertedCode) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="fixed inset-0 bg-black/50 z-40">
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl z-50">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Converted Code</h3>
              <button onClick={closePopup} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <CodeEditor
              value={convertedCode}
              language="typescript"
              readOnly
              className="min-h-[300px] font-mono rounded-md"
              padding={15}
            />
            {usedModel && (
              <p className="text-sm text-gray-500">Converted using: {usedModel}</p>
            )}
          </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}