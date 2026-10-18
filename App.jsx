import { useState, useEffect } from 'react';
import './App.css';

// URL base de nuestra API (lee .env en producción o usa localhost:5000 en desarrollo)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  // 1. Estados de los proyectos y carga
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 2. Estado para el Modo Administrador
  const [esAdmin, setEsAdmin] = useState(false);

  // 3. Estado para el formulario de Nuevo Proyecto
  const [nuevoProyecto, setNuevoProyecto] = useState({
    titulo: '',
    tecnologias: '',
    imagenUrl: '',
    urlDemo: '',
    descripcion: ''
  });

  // ==========================================
  // PASO 1: OBTENER PROYECTOS DEL BACKEND (GET)
  // ==========================================
  const obtenerProyectos = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch(`${API_URL}/proyectos`);
      const datos = await respuesta.json();
      setProyectos(datos);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerProyectos();
  }, []);

  // ==========================================
  // PASO 2: ACTIVAR MODO ADMIN CON PIN (POST)
  // ==========================================
  const manejarToggleAdmin = async () => {
    if (esAdmin) {
      setEsAdmin(false);
      return;
    }

    const pinIngresado = prompt('🔐 Ingresa el PIN de Administrador (Por defecto: admin123):');
    if (!pinIngresado) return;

    try {
      const respuesta = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinIngresado })
      });

      if (respuesta.ok) {
        setEsAdmin(true);
        alert('✅ Modo Administrador desbloqueado');
      } else {
        alert('❌ PIN incorrecto');
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
    }
  };

  // ==========================================
  // PASO 3: CREAR UN NUEVO PROYECTO (POST)
  // ==========================================
  const crearProyecto = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch(`${API_URL}/proyectos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProyecto)
      });

      if (respuesta.ok) {
        const proyectoCreado = await respuesta.json();
        // Agregamos el nuevo proyecto al inicio de la lista en vivo
        setProyectos([proyectoCreado, ...proyectos]);
        // Limpiamos el formulario
        setNuevoProyecto({
          titulo: '',
          tecnologias: '',
          imagenUrl: '',
          urlDemo: '',
          descripcion: ''
        });
      }
    } catch (error) {
      console.error('Error al guardar el proyecto:', error);
    }
  };

  // ==========================================
  // PASO 4: ELIMINAR UN PROYECTO (DELETE)
  // ==========================================
  const eliminarProyecto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este proyecto de la base de datos?')) return;

    try {
      const respuesta = await fetch(`${API_URL}/proyectos/${id}`, {
        method: 'DELETE'
      });

      if (respuesta.ok) {
        setProyectos(proyectos.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  return (
    <div>
      {/* BARRA DE NAVEGACIÓN */}
      <nav className="navbar">
        <span className="logo">🚀 MiPortafolio.dev</span>
        <button
          onClick={manejarToggleAdmin}
          className={`btn-admin-toggle ${esAdmin ? 'activo' : ''}`}
        >
          {esAdmin ? '🔓 Modo Admin Activo (Salir)' : '🔐 Modo Admin'}
        </button>
      </nav>

      {/* CABECERA / HERO */}
      <header className="hero">
        <h1>Hola, soy Desarrollador Full-Stack 👋</h1>
        <p>
          Construyo aplicaciones web modernas conectando React, Node.js/Express y MongoDB.
        </p>
      </header>

      {/* PANEL DE ADMINISTRACIÓN (Solo visible si esAdmin es true) */}
      {esAdmin && (
        <section className="admin-panel">
          <h3>⚙️ Panel de Administración: Publicar Nuevo Proyecto</h3>
          <form onSubmit={crearProyecto} className="form-grid">
            <input
              type="text"
              placeholder="Título del proyecto *"
              value={nuevoProyecto.titulo}
              onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, titulo: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Tecnologías (ej. React, Express, MongoDB)"
              value={nuevoProyecto.tecnologias}
              onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, tecnologias: e.target.value })}
            />
            <input
              type="url"
              placeholder="URL de la imagen (opcional)"
              value={nuevoProyecto.imagenUrl}
              onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, imagenUrl: e.target.value })}
            />
            <input
              type="url"
              placeholder="URL de Demo o GitHub"
              value={nuevoProyecto.urlDemo}
              onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, urlDemo: e.target.value })}
            />
            <textarea
              placeholder="Descripción breve del proyecto *"
              value={nuevoProyecto.descripcion}
              onChange={(e) => setNuevoProyecto({ ...nuevoProyecto, descripcion: e.target.value })}
              required
            />
            <button type="submit" className="btn-guardar">
              + Guardar Proyecto en MongoDB
            </button>
          </form>
        </section>
      )}

      {/* GALERÍA DE PROYECTOS */}
      <main className="contenedor-proyectos">
        <h2>Mis Proyectos Recientes ({proyectos.length})</h2>

        {cargando ? (
          <p className="estado-mensaje">Cargando proyectos desde MongoDB...</p>
        ) : proyectos.length === 0 ? (
          <p className="estado-mensaje">No hay proyectos aún. ¡Activa el Modo Admin para crear uno!</p>
        ) : (
          <div className="grid-proyectos">
            {proyectos.map((proyecto) => (
              <article key={proyecto._id} className="tarjeta-proyecto">
                <img src={proyecto.imagenUrl} alt={proyecto.titulo} />
                <div className="tarjeta-cuerpo">
                  <span className="badge-tech">{proyecto.tecnologias}</span>
                  <h3>{proyecto.titulo}</h3>
                  <p>{proyecto.descripcion}</p>

                  <div className="tarjeta-acciones">
                    <a
                      href={proyecto.urlDemo}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-demo"
                    >
                      Ver Proyecto ↗
                    </a>

                    {esAdmin && (
                      <button
                        onClick={() => eliminarProyecto(proyecto._id)}
                        className="btn-eliminar"
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
