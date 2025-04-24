import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { generateStandup } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { StandupResult } from '@/lib/types'
import { X, ClipboardList, Copy, CheckCircle, FileText } from 'lucide-react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

// Extracted StandupPopup component
function StandupPopup({ result, onClose }: { result: StandupResult; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-black/80 rounded-lg shadow-xl p-8 max-w-3xl w-full m-4 max-h-[85vh] overflow-y-auto relative border border-yellow-400/20"
        variants={popupVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors"
          aria-label="Close popup"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-yellow-400" />
              <h3 className="text-2xl font-semibold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                Daily Standup Report
              </h3>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-yellow-400/50 hover:border-yellow-400 text-yellow-400 hover:text-yellow-300 flex items-center gap-2 mr-5 mt-6"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Report
                </>
              )}
            </Button>
          </div>

          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
              {result.formattedText}
            </pre>
          </div>

          <Button 
            onClick={onClose} 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
          >
            Close Report
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function BackgroundImages() {
  const imageConfig = [
    {
      src: "../src/assets/fox.png",
      className: "absolute left-0 bottom-0 w-80 h-120 opacity-50 lg:block hidden transform -translate-x-1/4 translate-y-1/4",
      initialX: -100
    },
    {
      src: "../src/assets/alien.png",
      className: "absolute right-0 bottom-0 w-70 h-100 opacity-50 lg:block hidden transform translate-x-1/4 translate-y-1/4",
      initialX: 100
    }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {imageConfig.map((img, index) => (
        <motion.img
          key={index}
          src={img.src}
          alt=""
          className={img.className}
          initial={{ opacity: 0, x: img.initialX }}
          animate={{ opacity: 0.9, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export default function DailyStandupPage() {
  const { toast } = useToast();
  const [standupResult, setStandupResult] = useState<StandupResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rawText, setRawText] = useState('');

  const onTextSubmit = async () => {
    if (!rawText.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your standup details',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateStandup(rawText);
      setStandupResult(result);
      toast({
        title: 'Standup generated',
        description: 'Your daily standup is ready!'
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Failed to generate standup',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div className="container relative mx-auto py-8 px-4">
        <BackgroundImages />

        <motion.h1
          className="mb-8 rounded-md text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Daily Standup Generator
        </motion.h1>

        <Card className="max-w-2xl mx-auto border-yellow-400/20 shadow-lg bg-black/40">
          <CardContent className="p-8 space-y-6">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="text">Quick Text Entry</TabsTrigger>
                <TabsTrigger value="detailed">Detailed Form Will be added soon!!</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-yellow-400">
                    <FileText className="h-5 w-5" />
                    <h3 className="font-medium">Simply describe your work</h3>
                  </div>
                  
                  <Textarea 
                    className="min-h-40 bg-black/40 text-white border-yellow-400/30 focus:border-yellow-400/60"
                    placeholder="Describe what you worked on yesterday, how long it took, any blockers, and what you plan to do today. Our AI will structure it for you."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                  />
                  
                  <Button 
                    onClick={onTextSubmit}
                    disabled={isLoading || !rawText.trim()} 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium disabled:bg-yellow-500/50"
                  >
                    {isLoading ? 'Generating Report...' : 'Generate Standup Report'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <AnimatePresence>
          {standupResult && (
            <StandupPopup result={standupResult} onClose={() => setStandupResult(null)} />
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}