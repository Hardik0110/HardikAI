import { useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { Upload, ImageIcon, LineChart, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import { analyzeChart, API_CONFIG } from "@/lib/api"

export default function AnalyzePage() {
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    setFileError(null);
    
    // Check file size
    if (file.size > API_CONFIG.maxImageSize) {
      setFileError(`File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is ${API_CONFIG.maxImageSize / 1024 / 1024}MB.`);
      return false;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setFileError('Invalid file type. Please upload a JPG, PNG, or GIF image.');
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!validateFile(file)) {
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !previewUrl) {
      toast({
        title: "No image selected",
        description: "Please upload a stock chart image to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeChart(previewUrl);
      setAnalysisResult(result.text);

      toast({
        title: "Analysis complete",
        description: "Stock chart has been successfully analyzed",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
                          PNG, JPG or GIF (max. 1MB)
                        </p>
                      </>
                    )}
                  </motion.div>

                  <input 
                    id="file-upload" 
                    type="file" 
                    accept="image/jpeg,image/png,image/gif" 
                    className="hidden" 
                    onChange={handleFileChange} 
                  />

                  {fileError && (
                    <div className="flex items-center gap-2 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{fileError}</span>
                    </div>
                  )}

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
                    <Button
                      onClick={handleAnalyze}
                      disabled={!selectedFile || isAnalyzing || !!fileError}
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