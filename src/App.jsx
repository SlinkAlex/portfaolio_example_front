// 📄 Ruta del archivo: src/App.jsx
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AdminForm from './components/AdminForm';
import ProjectCard from './components/ProjectCard';
import './App.css';

// URL base de nuestra API (lee .env en producción o usa localhost:5000 en desarrollo)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  // 1. Estados principales
  const [proyectos, setProyectos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);

  // =========================================================
  // 4.1 CARGAR LOS PROYECTOS AL ABRIR LA PÁGINA (GET)
  // =========================================================
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

  // =========================================================
  // 4.2 DESBLOQUEAR EL MODO ADMINISTRADOR (POST /admin/login)
  // =========================================================
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

  // =========================================================
  // 4.3 CREAR UN NUEVO PROYECTO (POST /proyectos)
  // =========================================================
  const crearProyecto = async (nuevoProyecto) => {
    try {
      const respuesta = await fetch(`${API_URL}/proyectos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProyecto)
      });

      if (respuesta.ok) {
        const proyectoCreado = await respuesta.json();
        setProyectos([proyectoCreado, ...proyectos]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al guardar el proyecto:', error);
      return false;
    }
  };

  // =========================================================
  // 4.4 ELIMINAR UN PROYECTO (DELETE /proyectos/:id)
  // =========================================================
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
      {/* 1. Componente Navbar */}
      <Navbar esAdmin={esAdmin} onToggleAdmin={manejarToggleAdmin} />

      {/* 2. Componente Hero */}
      <Hero />

      {/* 3. Componente AdminForm (Solo se muestra si esAdmin es true) */}
      {esAdmin && <AdminForm onCrearProyecto={crearProyecto} />}

      {/* 4. Galería de Tarjetas (ProjectCard) */}
      <main className="contenedor-proyectos">
        <h2>Mis Proyectos Recientes ({proyectos.length})</h2>

        {cargando ? (
          <p className="estado-mensaje">Cargando proyectos desde MongoDB...</p>
        ) : proyectos.length === 0 ? (
          <p className="estado-mensaje">No hay proyectos aún. ¡Activa el Modo Admin para crear uno!</p>
        ) : (
          <div className="grid-proyectos">
            {proyectos.map((proyecto) => (
              <ProjectCard
                key={proyecto._id}
                proyecto={proyecto}
                esAdmin={esAdmin}
                onEliminar={eliminarProyecto}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
