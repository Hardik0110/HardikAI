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
import { LineChart } from "lucide-react"
import { motion } from "framer-motion"
import { analyzeStock } from "@/lib/api"
import type { StockAnalysisInput, AnalysisResult } from "@/lib/types"

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  currentPrice: z.number().positive("Price must be positive"),
  volume: z.number().positive("Volume must be positive"),
  chartImage: z.string().optional(),
  news: z.string().optional(),
  peRatio: z.number().positive().optional(),
  eps: z.number().optional(),
  marketCap: z.number().positive().optional(),
  dividend: z.number().min(0).optional(),
  beta: z.number().optional(),
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
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsAnalyzing(true)
    try {
      const result = await analyzeStock(data as StockAnalysisInput)
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

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
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
                            <Input placeholder="e.g. Apple Inc." {...field} />
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
                            <FormLabel>Current Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                              <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                              <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                              <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                            <Textarea placeholder="Enter any relevant news..." {...field} />
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-pink/20 shadow-md h-full">
              <CardContent className="p-6">
                {analysisResult ? (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-pink" />
                      <h3 className="text-lg font-medium text-gradient">Analysis Results</h3>
                    </div>

                    <div className="rounded-md bg-dark/5 p-4 border border-pink/10">
                      <h4 className="font-medium mb-2">Technical Trends</h4>
                      <p className="text-sm">{analysisResult.technicalTrends}</p>
                    </div>

                    <div className="rounded-md bg-dark/5 p-4 border border-pink/10">
                      <h4 className="font-medium mb-2">Volume Patterns</h4>
                      <p className="text-sm">{analysisResult.volumePatterns}</p>
                    </div>

                    <div className="rounded-md bg-dark/5 p-4 border border-pink/10">
                      <h4 className="font-medium mb-2">Support/Resistance Levels</h4>
                      <p className="text-sm">{analysisResult.supportResistance}</p>
                    </div>

                    <div className="rounded-md bg-dark/5 p-4 border border-pink/10">
                      <h4 className="font-medium mb-2">Short-term Outlook</h4>
                      <p className="text-sm">{analysisResult.shortTermOutlook}</p>
                    </div>

                    <div className="rounded-md bg-dark/5 p-4 border border-pink/10">
                      <h4 className="font-medium mb-2">Stop Loss</h4>
                      <p className="text-sm">${analysisResult.stopLoss.toFixed(2)}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                    <LineChart className="mb-2 h-12 w-12 text-pink opacity-50" />
                    <h3 className="text-lg font-medium">No Analysis Yet</h3>
                    <p className="mt-2">Fill in the stock details and click "Analyze" to get insights</p>
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