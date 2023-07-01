import { formatDistanceToNow } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useCyclesContext } from '../../contexts/CycleContext'
import { HistoryContainer, HistoryList, Status } from './styles'

type CycleStatus = 'done' | 'stopped' | 'inProgress'

const statusLabelMap = {
  done: 'Concluído',
  stopped: 'Interrompido',
  inProgress: 'Em progresso'
} as const

export function History() {
  const { cycles } = useCyclesContext()

  const reversedCycles = [...cycles].reverse()

  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reversedCycles.map((cycle) => {
              const startDateFormatted = formatDistanceToNow(cycle.startDate, {
                locale: ptBR,
                addSuffix: true
              })
              const status: CycleStatus = cycle.interruptedDate
                ? 'stopped'
                : cycle.isFinished
                ? 'done'
                : 'inProgress'

              return (
                <tr key={cycle.id}>
                  <td>{cycle.task}</td>
                  <td>{`${cycle.durationInMinutes.toFixed(0)} minutos`}</td>
                  <td>{startDateFormatted}</td>
                  <td>
                    <Status $statusColor={status}>
                      {statusLabelMap[status]}
                    </Status>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
