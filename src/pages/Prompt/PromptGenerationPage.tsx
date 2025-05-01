import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import PromptPopup from "./PromptPopup";

const PromptGenerationPage = () => {
  const { toast } = useToast();
  const [promptType, setPromptType] = useState("Select Prompt Type");
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  const handleSelect = (type: string) => setPromptType(type);

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

      if (!response.ok) {
        throw new Error("Failed to generate prompt");
      }

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
    <motion.div
      className="max-w-xl mx-auto p-4 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold text-sky-600 text-center">Prompt Generator</h2>

      <Card className="max-w-2xl mx-auto border-sky-400/20 shadow-lg bg-sky-600 p-8 space-y-6">
        <Textarea 
          placeholder="Enter your idea or task here..." 
          className="min-h-[140px] w-full"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-sky-600 border-sky-600 hover:bg-sky-500 hover:text-white w-full sm:w-auto">
                {promptType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleSelect("Short")}>
                Short
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSelect("Detailed")}>
                Detailed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSelect("Precise")}>
                Precise
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            className="bg-sky-600 hover:bg-sky-700 text-white border-sky-600 w-full sm:w-auto"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Prompt"}
          </Button>
        </div>
      </Card>

      {generatedPrompt && (
        <PromptPopup
          prompt={generatedPrompt}
          onClose={() => setGeneratedPrompt(null)}
        />
      )}
    </motion.div>
  );
};

export default PromptGenerationPage;
