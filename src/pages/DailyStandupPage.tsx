import { useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, ClipboardList, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateStandup } from "@/lib/api";
import type { StandupResult } from "@/lib/types";

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  subTasks: z.array(z.string()),
  hours: z.number().min(0).max(24),
  minutes: z.number().min(0).max(59),
  blockers: z.string().optional().default(""), // Add this line
});

const formSchema = z.object({
  tasks: z.array(taskSchema).min(1, "At least one task is required"),
});

const StandupPopup = ({ result, onClose }: { result: StandupResult; onClose: () => void }) => (
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

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-medium text-gradient">Daily Standup</h3>
        </div>

        <div className="space-y-4">
          <div className="rounded-md bg-gray-500/10 p-4 border border-yellow-500/10">
            <h4 className="font-medium mb-2 text-yellow-500">Yesterday's Progress</h4>
            {result.yesterdayProgress.tasks.map((task, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm mb-2">{task.name} ({task.duration})</p>
                <ul className="list-disc list-inside space-y-1">
                  {task.subTasks.map((subTask, idx) => (
                    <li key={idx} className="text-sm text-gray-300">{subTask.description} ({subTask.duration})</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-md bg-gray-500/10 p-4 border border-yellow-500/10">
            <h4 className="font-medium mb-2 text-yellow-500">Learnings & Insights</h4>
            <ul className="list-disc list-inside space-y-1">
              {result.learningsAndInsights.map((item, index) => (
                <li key={index} className="text-sm text-gray-300">
                  {item.description} ({item.duration})
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md bg-gray-500/10 p-4 border border-yellow-500/10">
            <h4 className="font-medium mb-2 text-yellow-500">Blockers</h4>
            <ul className="list-disc list-inside">
              {result.blockers.map((blocker, index) => (
                <li key={index} className="text-sm text-gray-300">{blocker}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-md bg-gray-500/10 p-4 border border-yellow-500/10">
            <h4 className="font-medium mb-2 text-yellow-500">Today's Plan</h4>
            <ul className="list-disc list-inside">
              {result.todaysPlan.map((plan, index) => (
                <li key={index} className="text-sm text-gray-300">{plan}</li>
              ))}
            </ul>
          </div>
        </div>

        <Button onClick={onClose} className="w-full">Close</Button>
      </div>
    </motion.div>
  </motion.div>
);

export default function DailyStandupPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [standupResult, setStandupResult] = useState<StandupResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tasks: [{
        name: "",
        subTasks: [""],
        hours: 0,
        minutes: 0,
        blockers: "", // Add this line
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tasks",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    try {
      // Process the data to handle empty blockers
      const processedData = {
        ...data,
        tasks: data.tasks.map(task => ({
          ...task,
          blockers: task.blockers?.trim() || "No major blockers"
        }))
      };

      const result = await generateStandup(processedData);
      setStandupResult(result);
      toast({ title: "Standup generated", description: "Your daily standup has been generated successfully" });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
          Daily Standup Generator
        </motion.h1>

        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-yellow-500/20 shadow-md">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4 p-4 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-yellow-500">Task {index + 1}</h3>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-400 hover:text-red-500"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name={`tasks.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Task Name</FormLabel>
                            <FormControl>
                              <Input className="border-white" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Add Subtasks Section */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FormLabel>Subtasks (Optional)</FormLabel>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const currentSubTasks = form.getValues(`tasks.${index}.subTasks`) || [];
                              form.setValue(`tasks.${index}.subTasks`, [...currentSubTasks, ""]);
                            }}
                            className="text-yellow-500 hover:text-yellow-400"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {form.watch(`tasks.${index}.subTasks`)?.map((_, subIndex) => (
                          <div key={subIndex} className="flex gap-2">
                            <FormField
                              control={form.control}
                              name={`tasks.${index}.subTasks.${subIndex}`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input 
                                      className="border-white" 
                                      placeholder={`Subtask ${subIndex + 1}`}
                                      {...field} 
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentSubTasks = [...form.getValues(`tasks.${index}.subTasks`)];
                                currentSubTasks.splice(subIndex, 1);
                                form.setValue(`tasks.${index}.subTasks`, currentSubTasks);
                              }}
                              className="text-red-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <FormField
                        control={form.control}
                        name={`tasks.${index}.blockers`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blockers (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                className="border-white"
                                placeholder="Any blockers for this task? Leave empty if none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`tasks.${index}.hours`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hours</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="24"
                                  className="border-white"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`tasks.${index}.minutes`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minutes</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  max="59"
                                  className="border-white"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => append({
                      name: "",
                      subTasks: [""],
                      hours: 0,
                      minutes: 0,
                      blockers: "", // Add this line
                    })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>

                  <Button type="submit" disabled={isGenerating} className="w-full">
                    {isGenerating ? "Generating..." : "Generate Standup"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {standupResult && (
            <StandupPopup result={standupResult} onClose={() => setStandupResult(null)} />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
