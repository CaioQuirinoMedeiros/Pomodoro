import { differenceInMilliseconds, differenceInSeconds, isPast } from 'date-fns'
import * as React from 'react'

type Cycle = {
  id: string
  task: string
  durationInMinutes: number
  startDate: Date
  endDate: Date
}

type TimerOptions = {
  onFinish?(): void
}

type Timer = {
  cycleId: string | undefined
  isRunning: boolean
  isFinished: boolean
  remainingSeconds: number
  start(): void
  pause(): void
}

const millisecondsInterval = 50

function getCycleRemainingMs(cycle?: Cycle) {
  if (!cycle?.endDate) return 0
  return differenceInMilliseconds(cycle?.endDate, new Date())
}

export function useCycleTimer(
  cycle: Cycle | undefined,
  options?: TimerOptions
): Timer {
  const [remainingSeconds, setRemainingSeconds] = React.useState(
    getCycleRemainingMs(cycle) / 1000
  )
  const [isRunning, setIsRunning] = React.useState(false)

  const tokenInterval = React.useRef<ReturnType<typeof setTimeout>>()

  const start = React.useCallback(() => {
    if (!cycle) return
    clearInterval(tokenInterval.current)

    function updateRemainingSeconds() {
      if (!cycle) {
        clearInterval(tokenInterval.current)
        return
      }

      let nextSeconds = Math.ceil(getCycleRemainingMs(cycle) / 1000)
      nextSeconds = Math.max(nextSeconds, 0)
      setRemainingSeconds((prevSeconds) => {
        if (prevSeconds === nextSeconds) return prevSeconds
        return nextSeconds
      })

      if (nextSeconds <= 0) {
        setIsRunning(false)
        options?.onFinish && options?.onFinish()
        clearInterval(tokenInterval.current)
      }
    }

    tokenInterval.current = setInterval(
      updateRemainingSeconds,
      millisecondsInterval
    )
    setIsRunning(true)
  }, [cycle, options])

  const pause = React.useCallback(() => {
    clearInterval(tokenInterval.current)
    setIsRunning(false)
  }, [])

  React.useEffect(() => {
    clearInterval(tokenInterval.current)
    setRemainingSeconds(Math.ceil(getCycleRemainingMs(cycle) / 1000))

    if (cycle) {
      start()
    } else {
      setIsRunning(false)
    }
  }, [cycle, start])

  React.useEffect(() => {
    return () => {
      tokenInterval.current && clearTimeout(tokenInterval.current)
    }
  }, [])

  return {
    cycleId: cycle?.id,
    isFinished: cycle ? isPast(cycle.endDate) : false,
    isRunning,
    remainingSeconds,
    start,
    pause
  }
}
