import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { generateStandup } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { StandupResult } from '@/lib/types'
import { FileText } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { StandupPopup } from './StandupPopup'

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
      console.log('Generating standup with input:', {
        textLength: rawText.length,
        timestamp: new Date().toISOString(),
        preview: rawText.substring(0, 100) + '...' 
      });

      const result = await generateStandup(rawText);

      console.log('Standup API Response:', {
        formattedText: result.formattedText,
        usedModel: result.usedModel,
        timestamp: new Date().toISOString(),
        success: true
      });

      setStandupResult(result);
      toast({
        title: 'Standup generated',
        description: 'Your daily standup is ready!'
      });
    } catch (error) {
      console.error('Standup generation error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });

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
      <motion.div className="container relative mx-auto py-8 px-4">
        <BackgroundImages />

        <motion.h1
          className="mb-8 rounded-md text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Daily Standup Generator
        </motion.h1>

        <Card className="max-w-2xl mx-auto border-yellow-400/20 shadow-lg bg-black/40">
          <CardContent className="p-8 space-y-6">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-yellow-300">
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
            <StandupPopup 
              result={standupResult} 
              onClose={() => setStandupResult(null)} 
            />
          )}
        </AnimatePresence>
      </motion.div>
  );
}