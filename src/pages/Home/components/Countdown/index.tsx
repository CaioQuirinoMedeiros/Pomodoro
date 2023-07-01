import * as React from 'react'
import { CountdownContainer, Separator } from './styles'
import { useCyclesContext } from '../../../../contexts/CycleContext'
import { useCycleTimer } from '../../../../hooks/useCycleTimer'

export function Countdown() {
  const { activeCycle, finishActiveCycle } = useCyclesContext()

  const timer = useCycleTimer(activeCycle, { onFinish: finishActiveCycle })

  const currentMinutes = Math.floor(timer.remainingSeconds / 60)
  const currentSeconds = timer.remainingSeconds % 60

  const [minuteFirstDigit, minuteSecondDigit] = currentMinutes
    .toString()
    .padStart(2, '0')
    .split('')
  const [secondFirstDigit, secondSecondDigit] = currentSeconds
    .toString()
    .padStart(2, '0')
    .split('')

  React.useEffect(() => {
    if (activeCycle) {
      document.title = `${minuteFirstDigit}${minuteSecondDigit}:${secondFirstDigit}${secondSecondDigit}`
    } else {
      document.title = 'Pomodoro'
    }
  }, [
    activeCycle,
    minuteFirstDigit,
    minuteSecondDigit,
    secondFirstDigit,
    secondSecondDigit
  ])

  return (
    <CountdownContainer>
      <span>{minuteFirstDigit}</span>
      <span>{minuteSecondDigit}</span>
      <Separator>:</Separator>
      <span>{secondFirstDigit}</span>
      <span>{secondSecondDigit}</span>
    </CountdownContainer>
  )
}
