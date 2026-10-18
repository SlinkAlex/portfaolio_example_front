// 📄 Ruta del archivo: src/components/Navbar.jsx

function Navbar({ esAdmin, onToggleAdmin }) {
  return (
    <nav className="navbar">
      <span className="logo">🚀 MiPortafolio.dev</span>
      <button
        onClick={onToggleAdmin}
        className={`btn-admin-toggle ${esAdmin ? 'activo' : ''}`}
      >
        {esAdmin ? '🔓 Modo Admin Activo (Salir)' : '🔐 Modo Admin'}
      </button>
    </nav>
  );
}

export default Navbar;
