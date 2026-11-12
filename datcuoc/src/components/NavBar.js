import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

const NavBar = () => (
  <nav className="navbar">
    <NavLink to="/" end className={linkClass}>Trang chủ</NavLink>
    <NavLink to="/questions" className={linkClass}>Ngân hàng câu hỏi</NavLink>
    <NavLink to="/history" className={linkClass}>Lịch sử</NavLink>
  </nav>
);

export default NavBar;
