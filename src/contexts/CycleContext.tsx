import * as React from 'react'
import { useCycleTimer } from '../hooks/useCycleTimer'
import { CyclesState, cyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  finishActiveCycleAction,
  stopActiveCycleAction
} from '../reducers/cycles/actions'
import { Cycle } from '../models/cycle'

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

const cyclesStorageKey = '@pomodoro:cyclesState-v2'

function getInitialCyclesState(initialState: CyclesState): CyclesState {
  const storageCycleState = window.localStorage.getItem(cyclesStorageKey)

  if (storageCycleState) {
    const parsedStorageCycleState = JSON.parse(storageCycleState) as CyclesState
    return {
      cycles: Cycle.createManyFromSnapshot(parsedStorageCycleState.cycles),
      activeCycleId: parsedStorageCycleState.activeCycleId
    }
  } else {
    return initialState
  }
}

export function CyclesContextProvider({ children }: React.PropsWithChildren) {
  const [cyclesState, dispatch] = React.useReducer(
    cyclesReducer,
    { cycles: [], activeCycleId: null } as CyclesState,
    getInitialCyclesState
  )

  const activeCycle = cyclesState.cycles.find((cycle) => {
    return cycle.id === cyclesState.activeCycleId
  })

  const timer = useCycleTimer(activeCycle, { onFinish: finishActiveCycle })

  React.useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    window.localStorage.setItem(cyclesStorageKey, stateJSON)
  }, [cyclesState])

  function createNewCycle({ task, durationInMinutes }: NewCycleParams) {
    const newCycle = Cycle.crateNew({ task, durationInMinutes })

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
