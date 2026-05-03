import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={logo} alt="MR Embalagens" />
                    <h1>MR Embalagens</h1>
                </Link>
                
                <nav>
                    <Link to="/admin" style={{ fontSize: '0.9rem', color: '#666' }}>Admin</Link>
                </nav>
            </div>
        </header>
    );
}