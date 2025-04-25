import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeStock } from "@/lib/api";
import type { StockAnalysisInput, AnalysisResult } from "@/lib/types";
import { stockAnalysisSchema, type StockAnalysisFormData } from '@/lib/validations';
import { OptionalNumberInput, RequiredNumberInput, TextInput } from "./AnalysisInput";
import { AnalysisPopup } from "./AnalysisPopup";

const ACCENT = "#ffffff"

export default function AnalyzePage() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const form = useForm<StockAnalysisFormData>({
    resolver: zodResolver(stockAnalysisSchema),
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
  });

  const onSubmit = async (data: StockAnalysisFormData) => {
    setIsAnalyzing(true);
    try {
      const cleanData: StockAnalysisInput = {
        companyName: data.companyName,
        currentPrice: data.currentPrice ?? undefined,
        volume: data.volume ?? undefined,
        news: data.news || undefined,
        peRatio: data.peRatio ?? undefined,
        eps: data.eps ?? undefined,
        marketCap: data.marketCap ?? undefined,
        dividend: data.dividend ?? undefined,
        beta: data.beta ?? undefined,
      };

      console.log('Sending analysis request with data:', cleanData);
      
      const result = await analyzeStock(cleanData);
      
      console.log('Analysis API Response:', {
        technicalTrends: result.technicalTrends,
        volumePatterns: result.volumePatterns,
        supportResistance: result.supportResistance,
        shortTermOutlook: result.shortTermOutlook,
        stopLoss: result.stopLoss
      });

      setAnalysisResult(result);
      toast({ title: "Analysis complete", description: "Stock analysis has been successfully generated" });
    } catch (error) {
      console.error("Analysis error:", {
        message: error instanceof Error ? error.message : "Unknown error",
        error
      });
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
      <div className="container mx-auto py-2">
        <div className="inset-0">
          <motion.img
            src="../src/assets/RedAlien.png"
            alt=""
            className="absolute left-20 top-1/2  w-120 h-120 lg:block hidden transform -translate-x-1/4 translate-y-1/4"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.img
            src="../src/assets/Sparrow.png"
            alt=""
            className="absolute right-40 top-1/2 w-240 h-240 lg:block hidden transform translate-x-1/4 translate-y-1/4"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        
        <motion.h1
          className="text-3xl font-bold text-red-500"
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
          <Card className="shadow-md" style={{ borderColor: ACCENT }}>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-5 bg-red-500 rounded-lg">
                  <TextInput control={form.control} name="companyName" label="Company Name" placeholder="e.g. Apple Inc." />
                  <div className="grid grid-cols-2 gap-4 ">
                    <RequiredNumberInput control={form.control} name="currentPrice" label="Current Price (Rupees)" />
                    <RequiredNumberInput control={form.control} name="volume" label="Volume" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <OptionalNumberInput control={form.control} name="peRatio" label="P/E Ratio" />
                    <OptionalNumberInput control={form.control} name="eps" label="EPS" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <OptionalNumberInput control={form.control} name="marketCap" label="Market Cap (inCrore)" />
                    <OptionalNumberInput control={form.control} name="dividend" label="Dividend (%)" />
                  </div>
                  <TextInput control={form.control} name="news" label="Recent News (Optional)" placeholder="Enter any relevant news..." isTextarea />
                  <Button type="submit" disabled={isAnalyzing} className="w-full bg-black text-red-500 hover:bg-red-300" >
                    {isAnalyzing ? "Analyzing..." : "Analyze Stock"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {analysisResult && (
            <AnalysisPopup 
              analysisResult={analysisResult} 
              onClose={() => setAnalysisResult(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}