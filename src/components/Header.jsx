import logo from "../assets/logo.png";

export default function Header() {
    return (
        <header className="header">
            <img src={logo} alt="MR Embalagens" />
            <h1>MR Embalagens</h1>
        </header>
    );
}