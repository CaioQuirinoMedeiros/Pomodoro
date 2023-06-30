import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  Separator,
  StartCountdownButton,
  AmountInMinutesInput,
  TaskInput
} from './styles'

const pomodoroFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  amountInMinutes: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos')
})

type PomodoroFormData = zod.infer<typeof pomodoroFormValidationSchema>

export function Home() {
  const { register, handleSubmit, formState, reset } =
    useForm<PomodoroFormData>({
      defaultValues: { task: '', amountInMinutes: 0 },
      resolver: zodResolver(pomodoroFormValidationSchema)
    })

  function onSubmitValid(formData: PomodoroFormData) {
    console.log({ formData })
    reset()
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(onSubmitValid)}>
        <FormContainer>
          <label htmlFor='task'>Vou trabalhar em</label>
          <TaskInput
            id='task'
            list='task-suggestions'
            placeholder='Dê um nome para o seu projeto'
            {...register('task', { required: true })}
          />
          <datalist id='task-suggestions'>
            <option value='Projeto 1' />
            <option value='Projeto 2' />
          </datalist>

          <label htmlFor='amountInMinutes'>durante</label>
          <AmountInMinutesInput
            type='number'
            id='amountInMinutes'
            step={5}
            max={60}
            min={5}
            {...register('amountInMinutes', {
              valueAsNumber: true,
              required: true
            })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type='submit' disabled={!formState.isValid}>
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
