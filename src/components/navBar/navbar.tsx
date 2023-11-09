import { Link } from 'react-router-dom'
import './style.css'


export default function NavBar() {
    return (
        <nav className="navContainer">
            <Link className='btnNavBar' to={'/'}>Home</Link>
            <Link className='btnNavBar' to={'/lancamentos'}>Lançamentos</Link>
            <Link className='btnNavBar' to={'/'}>Sair</Link>
        </nav>
    )
}