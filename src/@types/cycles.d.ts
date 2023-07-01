declare interface Cycle {
  id: string
  task: string
  durationInMinutes: number
  startDate: Date
  endDate: Date
  interruptedDate?: Date
  isFinished: boolean
}