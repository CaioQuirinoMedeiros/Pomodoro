import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { FormContainer, DurationInMinutesInput, TaskInput } from './styles'
import { useCyclesContext } from '../../../../contexts/CycleContext'

export function NewCycleForm() {
  const { activeCycle } = useCyclesContext()
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor='task'>Vou trabalhar em</label>
      <TaskInput
        id='task'
        list='task-suggestions'
        placeholder='Dê um nome para o seu projeto'
        {...register('task', { required: true, disabled: !!activeCycle })}
      />
      <datalist id='task-suggestions'>
        <option value='Projeto 1' />
        <option value='Projeto 2' />
      </datalist>

      <label htmlFor='durationInMinutes'>durante</label>
      <DurationInMinutesInput
        type='number'
        id='durationInMinutes'
        step={5}
        max={60}
        min={5}
        {...register('durationInMinutes', {
          valueAsNumber: true,
          required: true,
          disabled: !!activeCycle
        })}
      />
      <span>minutos.</span>
    </FormContainer>
  )
}
