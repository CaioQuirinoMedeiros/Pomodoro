import * as React from 'react'
import { CountdownContainer, Separator } from './styles'
import { useCyclesContext } from '../../../../contexts/CycleContext'

export function Countdown() {
  const { activeCycle, remainingSeconds } = useCyclesContext()

  const currentMinutes = Math.floor(remainingSeconds / 60)
  const currentSeconds = remainingSeconds % 60

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
