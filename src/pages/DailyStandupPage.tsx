import { useState } from 'react'
import { useForm, FormProvider, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { generateStandup } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { TaskSection } from '@/components/TaskSection'
import { StandupResult } from '@/lib/types'
import { X, ClipboardList } from 'lucide-react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { standupFormSchema, type StandupFormData } from '@/lib/validations'

function StandupPopup({ result, onClose }: { result: StandupResult; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-black/80 rounded-lg shadow-xl p-8 max-w-3xl w-full m-4 max-h-[85vh] overflow-y-auto relative border border-yellow-400/20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-400 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-yellow-400" />
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
              Daily Standup Report
            </h3>
          </div>

          <div className="space-y-6">
            <section className="rounded-lg bg-black/40 p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-colors">
              <h4 className="font-medium mb-4 text-lg text-yellow-400">Yesterday's Progress</h4>
              {result.yesterdayProgress.tasks.map((task, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                  <p className="text-base mb-2 text-yellow-100">
                    {task.name} <span className="font-medium text-yellow-400">({task.duration})</span>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    {task.subTasks.map((st, i2) => (
                      <li key={i2} className="text-sm text-gray-300 leading-relaxed">
                        {st.description} <span className="text-yellow-400/80 italic">({st.duration})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section className="rounded-lg bg-black/40 p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-colors">
              <h4 className="font-medium mb-4 text-lg text-yellow-400">Learnings & Insights</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {result.learningsAndInsights.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-300 leading-relaxed">
                    {item.description} <span className="text-yellow-400/80 italic">({item.duration})</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg bg-black/40 p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-colors">
              <h4 className="font-medium mb-4 text-lg text-yellow-400">Blockers</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {result.blockers.map((blk, idx) => (
                  <li key={idx} className="text-sm text-gray-300 leading-relaxed">{blk}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg bg-black/40 p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-colors">
              <h4 className="font-medium mb-4 text-lg text-yellow-400">Today's Plan</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                {result.todaysPlan.map((plan, idx) => (
                  <li key={idx} className="text-sm text-gray-300 leading-relaxed">{plan}</li>
                ))}
              </ul>
            </section>
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
  )
}

export default function DailyStandupPage() {
  const { toast } = useToast()
  const [standupResult, setStandupResult] = useState<StandupResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<StandupFormData>({
    resolver: zodResolver(standupFormSchema),
    defaultValues: { 
      tasks: [{ 
        name: '', 
        subTasks: [''], 
        hours: 0, 
        minutes: 0, 
        blockers: '' 
      }] 
    }
  })
  
  const { fields, append } = useFieldArray({ 
    name: 'tasks', 
    control: form.control 
  })

  const onSubmit = async (data: StandupFormData) => {
    setIsLoading(true)
    try {
      const cleaned = data.tasks.map(t => ({ 
        ...t, 
        blockers: t.blockers.trim() || 'No major blockers' 
      }))
      const result = await generateStandup({ tasks: cleaned })
      setStandupResult(result)
      toast({ 
        title: 'Standup generated', 
        description: 'Your daily standup is ready!' 
      })
    } catch (e) {
      toast({ 
        title: 'Error', 
        description: 'Failed to generate standup', 
        variant: 'destructive' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <motion.div className="container mx-auto py-8 px-4">
        <motion.h1
          className="mb-8 rounded-md text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Daily Standup Generator
        </motion.h1>

        <FormProvider {...form}>
          <Card className="max-w-2xl  mx-auto border-yellow-400/20 shadow-lg bg-black/40">
            <CardContent className="p-8 space-y-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {fields.map((f, idx) => <TaskSection key={f.id} index={idx} />)}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-yellow-400/50 hover:border-yellow-400 text-yellow-400 hover:text-yellow-300"
                  onClick={() => append({ name: '', subTasks: [''], hours: 0, minutes: 0, blockers: '' })}
                >
                  Add Another Task
                </Button>

                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium disabled:bg-yellow-500/50"
                >
                  {isLoading ? 'Generating Report...' : 'Generate Standup Report'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </FormProvider>

        <AnimatePresence>
          {standupResult && (
            <StandupPopup result={standupResult} onClose={() => setStandupResult(null)} />
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  )
}