import * as React from 'react'
import { useCycleTimer } from '../hooks/useCycleTimer'
import { addMilliseconds } from 'date-fns'
import { CyclesState, cyclesReducer } from '../reducers/cycles/reducer'
import { addNewCycleAction, finishActiveCycleAction, stopActiveCycleAction } from '../reducers/cycles/actions'

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
  const [cyclesState, dispatch] = React.useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null
  } as CyclesState)

  const activeCycle = cyclesState.cycles.find((cycle) => {
    return cycle.id === cyclesState.activeCycleId
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

    dispatch(addNewCycleAction(newCycle))
  }

  function finishActiveCycle() {
    dispatch(finishActiveCycleAction())
  }

  function stopActiveCycle() {
    dispatch(stopActiveCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles: cyclesState.cycles,
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
