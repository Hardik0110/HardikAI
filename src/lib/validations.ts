import * as z from 'zod'

// Daily Standup Validations
export const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  subTasks: z.array(z.string()),
  hours: z.number().min(0).max(24, 'Hours must be between 0 and 24'),
  minutes: z.number().min(0).max(59, 'Minutes must be between 0 and 59'),
  blockers: z.string().optional().default(''),
})

export const standupFormSchema = z.object({
  tasks: z.array(taskSchema).min(1, 'At least one task is required')
})

// Stock Analysis Validations
export const stockAnalysisSchema = z.object({
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

export const standupTextSchema = z.object({
    rawText: z.string().min(10, 'Please provide more details about your work')
  })
  
  export type StandupTextData = z.infer<typeof standupTextSchema>

// Types derived from schemas
export type TaskFormData = z.infer<typeof taskSchema>
export type StandupFormData = z.infer<typeof standupFormSchema>
export type StockAnalysisFormData = z.infer<typeof stockAnalysisSchema>