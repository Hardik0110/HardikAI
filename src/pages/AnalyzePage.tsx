import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { LineChart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeStock } from "@/lib/api";
import type { StockAnalysisInput, AnalysisResult } from "@/lib/types";
import { stockAnalysisSchema, type StockAnalysisFormData } from '@/lib/validations';

const ACCENT = "#ffffff"

type OptionalNumberInputProps = { control: any; name: string; label: string; placeholder?: string };
const OptionalNumberInput = ({ control, name, label, placeholder = "Optional" }: OptionalNumberInputProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            className="border-b"
            type="number"
            placeholder={placeholder}
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value === "" ? null : parseFloat(e.target.value))}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

type RequiredNumberInputProps = { control: any; name: string; label: string; placeholder?: string };
const RequiredNumberInput = ({ control, name, label, placeholder }: RequiredNumberInputProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            className="border-b"
            type="number"
            placeholder={placeholder}
            value={field.value}
            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

type TextInputProps = { control: any; name: string; label: string; placeholder?: string; isTextarea?: boolean };
const TextInput = ({ control, name, label, placeholder, isTextarea = false }: TextInputProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          {isTextarea ? (
            <Textarea className="border-b" placeholder={placeholder} {...field} />
          ) : (
            <Input className="border-b" placeholder={placeholder} {...field} />
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

type AnalysisPopupProps = { analysisResult: AnalysisResult; onClose: () => void };
const AnalysisPopup = ({ analysisResult, onClose }: AnalysisPopupProps) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-black/60 rounded-lg shadow-xl p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        <X className="h-5 w-5" />
      </button>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-pink" />
          <h3 className="text-lg font-medium text-gradient">Analysis Results</h3>
        </div>
        {[
          { title: "Technical Trends", content: analysisResult.technicalTrends },
          { title: "Volume Patterns", content: analysisResult.volumePatterns },
          { title: "Support/Resistance Levels", content: analysisResult.supportResistance },
          { title: "Short-term Outlook", content: analysisResult.shortTermOutlook },
          { title: "Stop Loss", content: analysisResult.stopLoss.toFixed(2) },
        ].map(({ title, content }) => (
          <div key={title} className="rounded-md bg-gray-500 p-4 border border-pink/10">
            <h4 className="font-medium mb-2">{title}</h4>
            <p className="text-sm">{content}</p>
          </div>
        ))}
        <Button onClick={onClose} className="w-full">Close</Button>
      </div>
    </motion.div>
  </motion.div>
);

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
        currentPrice: data.currentPrice,
        volume: data.volume,
        news: data.news || undefined,
        peRatio: data.peRatio ?? undefined,
        eps: data.eps ?? undefined,
        marketCap: data.marketCap ?? undefined,
        dividend: data.dividend ?? undefined,
        beta: data.beta ?? undefined,
      };
      const result = await analyzeStock(cleanData);
      setAnalysisResult(result);
      toast({ title: "Analysis complete", description: "Stock analysis has been successfully generated" });
    } catch (error) {
      console.error("Analysis error:", error);
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

        <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
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

        <AnimatePresence>{analysisResult && <AnalysisPopup analysisResult={analysisResult} onClose={() => setAnalysisResult(null)} />}</AnimatePresence>
      </div>
    </DashboardLayout>
  );
}