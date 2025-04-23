import { useFormContext, useFieldArray } from 'react-hook-form'
import { Minus, Plus, Trash2 } from 'lucide-react'

interface TaskSectionProps {
  index: number
}

export function TaskSection({ index }: TaskSectionProps) {
  const { control, register, watch, setValue } = useFormContext()
  const { fields: subTasks } = useFieldArray({ control, name: `tasks.${index}.subTasks` })

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Task {index + 1}</h3>
        {index > 0 && (
          <button type="button" onClick={() => {
            const tasks = watch('tasks')
            const updated = [...tasks]
            updated.splice(index, 1)
            setValue('tasks', updated)
          }}>
            <Minus />
          </button>
        )}
      </div>

      <label className="block">
        <span>Task Name</span>
        <input {...register(`tasks.${index}.name`)} className="w-full" />
      </label>

      <div>
        <div className="flex justify-between items-center">
          <span>Subtasks</span>
          <button type="button" onClick={() => {
            const current = watch(`tasks.${index}.subTasks`)
            setValue(`tasks.${index}.subTasks`, [...current, ''])
          }}><Plus /></button>
        </div>
        {subTasks.map((_, sIdx) => (
          <div key={sIdx} className="flex gap-2">
            <input
              {...register(`tasks.${index}.subTasks.${sIdx}`)}
              className="flex-1"
            />
            <button type="button" onClick={() => {
              const curr = [...watch(`tasks.${index}.subTasks`)]
              curr.splice(sIdx, 1)
              setValue(`tasks.${index}.subTasks`, curr)
            }}><Trash2 /></button>
          </div>
        ))}
      </div>

      <label className="block">
        <span>Blockers</span>
        <input {...register(`tasks.${index}.blockers`)} className="w-full" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span>Hours</span>
          <input
            type="number"
            {...register(`tasks.${index}.hours`, { valueAsNumber: true })}
            className="w-full"
          />
        </label>
        <label className="block">
          <span>Minutes</span>
          <input
            type="number"
            {...register(`tasks.${index}.minutes`, { valueAsNumber: true })}
            className="w-full"
          />
        </label>
      </div>
    </div>
  )
}