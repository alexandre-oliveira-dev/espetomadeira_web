import { Link } from 'react-router-dom';
import './style.css';
import Title from 'antd/es/typography/Title';

export default function NavBar() {
  return (
    <nav className="navContainer">
      <Title
        level={4}
        style={{ color: '#fff', margin: '10px 0 10px 0', textAlign: 'center' }}
      >
        Gerenciador de finanças
      </Title>
      <Link className="btnNavBar" to={'/'}>
        Início
      </Link>
      <Link className="btnNavBar" to={'/lancamentos'}>
        Lançamentos
      </Link>
      {/*             <Link className='btnNavBar' to={'/'}>Sair</Link>
       */}
    </nav>
  );
}
