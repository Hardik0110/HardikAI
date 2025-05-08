import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PromptPopup from "./PromptPopup";
import { Sparkles, Type, Send } from "lucide-react";
import { usePromptStore } from "@/lib/stores/usePromptStore";

const PromptGenerationPage = () => {
  const { toast } = useToast();
  const {
    promptType,
    userInput,
    isGenerating,
    generatedPrompt,
    setPromptType, 
    setUserInput,
    setIsGenerating,
    setGeneratedPrompt,
  } = usePromptStore();

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to generate a prompt",
        variant: "destructive",
      });
      return;
    }

    if (promptType === "Select Prompt Type") {
      toast({
        title: "Select prompt type",
        description: "Please select a prompt type",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("http://localhost:3001/v1/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: userInput,
          type: promptType.toLowerCase(),
        }),
      });

      if (!response.ok) throw new Error("Failed to generate prompt");

      const data = await response.json();
      setGeneratedPrompt(data.generatedPrompt);
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate prompt",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <motion.div
        className="max-w-3xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            <h2 className="text-4xl font-bold text-sky-700 inline-flex items-center gap-2">
              <Sparkles className="text-sky-500" size={32} />
              Prompt Generator
            </h2>
          </motion.div>
          <p className="text-sky-600 mt-2 max-w-lg mx-auto">
            Transform your ideas into perfectly crafted prompts
          </p>
        </div>

        <Card className="border-sky-200 shadow-lg overflow-hidden bg-white">
          <CardHeader className="bg-sky-600 text-white pb-4">
            <CardTitle className="text-xl font-medium flex items-center gap-2">
              <Type size={20} />
              Create Your Prompt
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-sky-700">Your Idea or Task</label>
                <Textarea
                  placeholder="Describe what you want to generate a prompt for..."
                  className="min-h-[140px] w-full border-sky-200 focus:border-sky-400 focus:ring-sky-400 transition-all resize-none"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-sky-300 text-sky-700 hover:bg-sky-50 w-full sm:w-auto"
                    >
                      {promptType}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border-sky-200">
                    {["Short", "Detailed", "Precise"].map((type) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => setPromptType(type)}
                        className="hover:bg-sky-50 hover:text-sky-700"
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  className="bg-sky-600 hover:bg-sky-700 text-white w-full sm:w-auto"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  <Send size={18} className="mr-2" />
                  {isGenerating ? "Generating..." : "Generate Prompt"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {generatedPrompt && (
          <PromptPopup 
            prompt={generatedPrompt} 
            onClose={() => setGeneratedPrompt(null)} 
          />
        )}
      </motion.div>
    </div>
  );
};

export default PromptGenerationPage;
