import { addMinutes } from 'date-fns'
import * as zod from 'zod'

type ClassConstructor = {
  id: string
  task: string
  durationInMinutes: number
  startDate: Date
  interruptedDate?: Date
  isFinished: boolean
}

type NewCycleParams = {
  task: string
  durationInMinutes: number
}

const cycleSchema = zod.object({
  id: zod.string(),
  task: zod.string(),
  durationInMinutes: zod.number(),
  startDate: zod.coerce.date(),
  interruptedDate: zod.coerce.date().optional(),
  isFinished: zod.boolean()
})

export class Cycle {
  id: string
  task: string
  durationInMinutes: number
  startDate: Date
  interruptedDate?: Date
  isFinished: boolean

  constructor(params: ClassConstructor) {
    this.durationInMinutes = params.durationInMinutes
    this.id = params.id
    this.interruptedDate = params.interruptedDate
    this.isFinished = params.isFinished
    this.startDate = params.startDate
    this.task = params.task
  }

  static crateNew(params: NewCycleParams) {
    return new Cycle({
      id: Math.random().toString(16).slice(2) + new Date().getTime(),
      task: params.task,
      durationInMinutes: params.durationInMinutes,
      isFinished: false,
      startDate: new Date()
    })
  }

  static createFromSnapshot(data: any): Cycle | null {
    const cycleParseReturn = cycleSchema.safeParse(data)

    if (cycleParseReturn.success) {
      return new Cycle(cycleParseReturn.data)
    } else {
      return null
    }
  }

  static createManyFromSnapshot(data: any[]): Cycle[] {
    if (!Array.isArray(data)) return []
    return data
      .map((item) => {
        return Cycle.createFromSnapshot(item)
      })
      .filter((cycle) => !!cycle) as Cycle[]
  }

  get endDate() {
    return addMinutes(this.startDate, this.durationInMinutes)
  }
}
