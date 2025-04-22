import { useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Upload, ImageIcon, LineChart } from "lucide-react"
import { motion } from "framer-motion"

export default function AnalyzePage() {
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)

      setAnalysisResult(null)
    }
  }

  const handleAnalyze = () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please upload a stock chart image to analyze",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false)

      // Mock analysis result - in a real app, this would come from an API
      setAnalysisResult(`
# Stock Analysis Report

## Technical Indicators
- **Moving Averages**: Bullish crossover detected (50-day MA crossing above 200-day MA)
- **RSI**: 62.4 (Neutral with bullish momentum)
- **MACD**: Positive and increasing (Bullish signal)
- **Volume**: Above average by 32% (Strong buying interest)

## Pattern Recognition
- **Chart Pattern**: Cup and Handle formation detected
- **Support Level**: $142.30
- **Resistance Level**: $158.75
- **Breakout Potential**: High (80% probability)

## Recommendation
STRONG BUY with a price target of $172.50 within 3 months.
Risk management: Set stop loss at $138.50.
      `)

      toast({
        title: "Analysis complete",
        description: "Stock chart has been successfully analyzed",
      })
    }, 2000)
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
          Analyze Stock
        </motion.h1>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-cyan/20 shadow-md">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.02, borderColor: "#08D9D6" }}
                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 transition-colors"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    {previewUrl ? (
                      <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        src={previewUrl}
                        alt="Stock chart preview"
                        className="h-full max-h-full object-contain"
                      />
                    ) : (
                      <>
                        <ImageIcon className="mb-2 h-10 w-10 text-cyan" />
                        <p className="text-center text-sm text-muted-foreground">
                          Click to upload or drag and drop
                          <br />
                          PNG, JPG or GIF (max. 10MB)
                        </p>
                      </>
                    )}
                  </motion.div>

                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                    <Button
                      onClick={handleAnalyze}
                      disabled={!selectedFile || isAnalyzing}
                      variant="gradient"
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        "Analyzing..."
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Analyze Stock Chart
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-pink/20 shadow-md h-full">
              <CardContent className="p-6 mt-20">
                {analysisResult ? (
                  <motion.div
                    className="prose prose-sm max-w-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-2 text-lg font-medium">
                      <LineChart className="h-5 w-5 text-pink" />
                      <span className="text-gradient">Analysis Results</span>
                    </div>
                    <div className="mt-4 rounded-md bg-dark/5 p-4 border border-pink/10">
                      <pre className="whitespace-pre-wrap text-sm">{analysisResult}</pre>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                    <LineChart className="mb-2 h-12 w-12 text-pink opacity-50" />
                    <h3 className="text-lg font-medium">No Analysis Yet</h3>
                    <p className="mt-2">Upload a stock chart image and click "Analyze" to get detailed insights</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}
