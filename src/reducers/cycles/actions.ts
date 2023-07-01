export enum CycleActionTypes {
  ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
  FINISH_ACTIVE_CYCLE = 'FINISH_ACTIVE_CYCLE',
  STOP_ACTIVE_CYCLE = 'STOP_ACTIVE_CYCLE'
}

export type CycleAction =
  | GenericAction<CycleActionTypes.ADD_NEW_CYCLE, { newCycle: Cycle }>
  | GenericAction<CycleActionTypes.FINISH_ACTIVE_CYCLE>
  | GenericAction<CycleActionTypes.STOP_ACTIVE_CYCLE>

export function addNewCycleAction(newCycle: Cycle): CycleAction {
  return { type: CycleActionTypes.ADD_NEW_CYCLE, payload: { newCycle } }
}

export function finishActiveCycleAction(): CycleAction {
  return { type: CycleActionTypes.FINISH_ACTIVE_CYCLE }
}

export function stopActiveCycleAction(): CycleAction {
  return { type: CycleActionTypes.STOP_ACTIVE_CYCLE }
}
