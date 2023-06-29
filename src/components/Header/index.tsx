import { HeaderContainer } from './styles'
import { NavLink } from 'react-router-dom'
import { Timer, Scroll } from 'phosphor-react'

import logoPomodoro from '../../assets/pomodoro-logo.svg'

export function Header() {
  return (
    <HeaderContainer>
      <img src={logoPomodoro} alt='' />
      <nav>
        <NavLink to='/' title='Timer'>
          <Timer size={24} />
        </NavLink>
        <NavLink to='/history' title='Histórico'>
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}
