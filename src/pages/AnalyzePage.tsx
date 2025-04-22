import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { LineChart, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { analyzeStock } from "@/lib/api"
import type { StockAnalysisInput, AnalysisResult } from "@/lib/types"

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  currentPrice: z.number().positive("Price must be positive"),
  volume: z.number().positive("Volume must be positive"),
  news: z.string().optional().default(""),
  peRatio: z.number().positive().optional().nullable(),
  eps: z.number().optional().nullable(),
  marketCap: z.number().positive().optional().nullable(),
  dividend: z.number().min(0).optional().nullable(),
  beta: z.number().optional().nullable(),
})

export default function AnalyzePage() {
  const { toast } = useToast()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      currentPrice: 0,
      volume: 0,
      news: "",
      peRatio: null,
      eps: null,
      marketCap: null,
      dividend: null,
      beta: null,
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsAnalyzing(true)
    try {
      const cleanData: StockAnalysisInput = {
        companyName: data.companyName,
        currentPrice: data.currentPrice,
        volume: data.volume,
        news: data.news || undefined,
        peRatio: data.peRatio ?? undefined,
        eps: data.eps ?? undefined,
        marketCap: data.marketCap ?? undefined,
        dividend: data.dividend ?? undefined,
        beta: data.beta ?? undefined,
      };

      const result = await analyzeStock(cleanData)
      setAnalysisResult(result)
      toast({
        title: "Analysis complete",
        description: "Stock analysis has been successfully generated",
      })
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const closePopup = () => {
    setAnalysisResult(null)
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
          Stock Analysis
        </motion.h1>

        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <Card className="border-cyan/20 shadow-md">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input 
                            className="border-white"
                            placeholder="e.g. Apple Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="currentPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Price (Rupees)</FormLabel>
                          <FormControl>
                            <Input 
                              className="border-white"
                              type="number" 
                              value={field.value}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="volume"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volume</FormLabel>
                          <FormControl>
                            <Input 
                              className="border-white"
                              type="number" 
                              value={field.value}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="peRatio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>P/E Ratio</FormLabel>
                          <FormControl>
                            <Input 
                              className="border-white"
                              type="number" 
                              placeholder="Optional"
                              value={field.value ?? ""} 
                              onChange={(e) => {
                                const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>EPS</FormLabel>
                          <FormControl>
                            <Input 
                              className="border-white"
                              type="number" 
                              placeholder="Optional"
                              value={field.value ?? ""} 
                              onChange={(e) => {
                                const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="marketCap"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Market Cap (inCrore)</FormLabel>
                          <FormControl>
                            <Input 
                              className="border-white"
                              type="number" 
                              placeholder="Optional"
                              value={field.value ?? ""} 
                              onChange={(e) => {
                                const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dividend"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dividend (%)</FormLabel>
                          <FormControl>
                            <Input 
                              className="border-white"
                              type="number" 
                              placeholder="Optional"
                              value={field.value ?? ""} 
                              onChange={(e) => {
                                const value = e.target.value === "" ? null : parseFloat(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="news"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recent News (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                          className="border-white"
                          placeholder="Enter any relevant news..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isAnalyzing} className="w-full">
                    {isAnalyzing ? "Analyzing..." : "Analyze Stock"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {analysisResult && (
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
                  <div className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-pink" />
                    <h3 className="text-lg font-medium text-gradient">Analysis Results</h3>
                  </div>

                  <div className="rounded-md bg-gray-50 p-4 border border-pink/10">
                    <h4 className="font-medium mb-2">Technical Trends</h4>
                    <p className="text-sm">{analysisResult.technicalTrends}</p>
                  </div>

                  <div className="rounded-md bg-gray-50 p-4 border border-pink/10">
                    <h4 className="font-medium mb-2">Volume Patterns</h4>
                    <p className="text-sm">{analysisResult.volumePatterns}</p>
                  </div>

                  <div className="rounded-md bg-gray-50 p-4 border border-pink/10">
                    <h4 className="font-medium mb-2">Support/Resistance Levels</h4>
                    <p className="text-sm">{analysisResult.supportResistance}</p>
                  </div>

                  <div className="rounded-md bg-gray-50 p-4 border border-pink/10">
                    <h4 className="font-medium mb-2">Short-term Outlook</h4>
                    <p className="text-sm">{analysisResult.shortTermOutlook}</p>
                  </div>

                  <div className="rounded-md bg-gray-50 p-4 border border-pink/10">
                    <h4 className="font-medium mb-2">Stop Loss</h4>
                    <p className="text-sm">{analysisResult.stopLoss.toFixed(2)}</p>
                  </div>

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