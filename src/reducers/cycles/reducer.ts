import { produce } from 'immer'

import { CycleAction, CycleActionTypes } from './actions'

export type CyclesState = {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: CycleAction) {
  switch (action.type) {
    case CycleActionTypes.ADD_NEW_CYCLE: {
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })
    }
    case CycleActionTypes.FINISH_ACTIVE_CYCLE: {
      const activeCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if (activeCycleIndex < 0) return state

      return produce(state, (draft) => {
        draft.cycles[activeCycleIndex].isFinished = true
        draft.activeCycleId = null
      })
    }
    case CycleActionTypes.STOP_ACTIVE_CYCLE: {
      const activeCycleIndex = state.cycles.findIndex((cycle) => {
        return cycle.id === state.activeCycleId
      })

      if (activeCycleIndex < 0) return state

      return produce(state, (draft) => {
        draft.cycles[activeCycleIndex].interruptedDate = new Date()
        draft.activeCycleId = null
      })
    }
    default:
      return state
  }
}
