import * as React from 'react'
import { useCycleTimer } from '../hooks/useCycleTimer'
import { addMinutes } from 'date-fns'

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
  activeCycle: Cycle | undefined
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

  function createNewCycle({ task, durationInMinutes }: NewCycleParams) {
    const newCycle: Cycle = {
      id: Math.random().toString(16).slice(2) + new Date().getTime(),
      task: task,
      durationInMinutes: durationInMinutes,
      isFinished: false,
      startDate: new Date(),
      get endDate() {
        return addMinutes(this.startDate, this.durationInMinutes)
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
        activeCycle,
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
