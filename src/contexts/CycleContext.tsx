import * as React from 'react'
import { useCycleTimer } from '../hooks/useCycleTimer'
import { addMilliseconds, addMinutes } from 'date-fns'

interface Cycle {
  id: string
  task: string
  durationInMinutes: number
  startDate: Date
  endDate: Date
  interruptedDate?: Date
  isFinished: boolean
}

type NewCycleParams = {
  task: string
  durationInMinutes: number
}

interface CyclesContextData {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  remainingSeconds: number
  stopActiveCycle(): void
  finishActiveCycle(): void
  createNewCycle(params: NewCycleParams): void
}

const CyclesContext = React.createContext({} as CyclesContextData)

export function CyclesContextProvider({ children }: React.PropsWithChildren) {
  const [cycles, setCycles] = React.useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = React.useState<string | null>(null)

  const activeCycle = cycles.find((cycle) => {
    return cycle.id === activeCycleId
  })

  const timer = useCycleTimer(activeCycle, { onFinish: finishActiveCycle })

  function createNewCycle({ task, durationInMinutes }: NewCycleParams) {
    const newCycle: Cycle = {
      id: Math.random().toString(16).slice(2) + new Date().getTime(),
      task: task,
      durationInMinutes: durationInMinutes,
      isFinished: false,
      startDate: new Date(),
      get endDate() {
        return addMilliseconds(
          this.startDate,
          this.durationInMinutes * 60 * 1000
        )
      }
    }

    setCycles((prevCycles) => [...prevCycles, newCycle])
    setActiveCycleId(newCycle.id)
  }

  function finishActiveCycle() {
    setCycles((prevCycles) =>
      prevCycles.map((prevCycle) => {
        if (prevCycle.id === activeCycleId) {
          return { ...prevCycle, isFinished: true }
        } else {
          return prevCycle
        }
      })
    )
    setActiveCycleId(null)
  }

  function stopActiveCycle() {
    setCycles((prevCycles) =>
      prevCycles.map((prevCycle) => {
        if (prevCycle.id === activeCycleId) {
          return { ...prevCycle, interruptedDate: new Date() }
        } else {
          return prevCycle
        }
      })
    )
    setActiveCycleId(null)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        remainingSeconds: timer.remainingSeconds,
        stopActiveCycle,
        finishActiveCycle,
        createNewCycle
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

export function useCyclesContext() {
  return React.useContext(CyclesContext)
}
