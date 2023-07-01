import { HandPalm, Play } from 'phosphor-react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton
} from './styles'

import { Countdown } from './components/Countdown'
import { NewCycleForm } from './components/NewCycleForm'
import { useCyclesContext } from '../../contexts/CycleContext'

const pomodoroFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  durationInMinutes: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos')
})

type PomodoroFormData = zod.infer<typeof pomodoroFormValidationSchema>

export function Home() {
  const { activeCycle, createNewCycle, stopActiveCycle } = useCyclesContext()
  const newCycleForm = useForm<PomodoroFormData>({
    defaultValues: { task: '', durationInMinutes: 0 },
    resolver: zodResolver(pomodoroFormValidationSchema)
  })

  const { formState, reset, handleSubmit } = newCycleForm

  function onSubmitValid(formData: PomodoroFormData) {
    createNewCycle({
      task: formData.task,
      durationInMinutes: formData.durationInMinutes
    })
    reset()
  }

  function handleStopTimer() {
    stopActiveCycle()
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(onSubmitValid)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>

        <Countdown />

        {activeCycle ? (
          <StopCountdownButton type='button' onClick={handleStopTimer}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type='submit' disabled={!formState.isValid}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
