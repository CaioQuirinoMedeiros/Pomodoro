import { HistoryContainer, HistoryList, Status } from './styles'

export function History() {
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
            <tr>
              <td>Tarefa 1</td>
              <td>20 minutos</td>
              <td>Há cerca de 2 meses</td>
              <td>
                <Status statusColor="done">Concluído</Status>
              </td>
            </tr>
            <tr>
              <td>Tarefa 1</td>
              <td>20 minutos</td>
              <td>Há cerca de 2 meses</td>
              <td>
                <Status statusColor="inProgress">Concluído</Status>
              </td>
            </tr>
            <tr>
              <td>Tarefa 1</td>
              <td>20 minutos</td>
              <td>Há cerca de 2 meses</td>
              <td>
                <Status statusColor="stopped">Concluído</Status>
              </td>
            </tr>
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
