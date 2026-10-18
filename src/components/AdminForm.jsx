// 📄 Ruta del archivo: src/components/AdminForm.jsx
import { useState } from 'react';

function AdminForm({ onCrearProyecto }) {
  const [formulario, setFormulario] = useState({
    titulo: '',
    tecnologias: '',
    imagenUrl: '',
    urlDemo: '',
    descripcion: ''
  });

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    const exito = await onCrearProyecto(formulario);
    if (exito) {
      // Limpiamos el formulario después de guardar en MongoDB
      setFormulario({
        titulo: '',
        tecnologias: '',
        imagenUrl: '',
        urlDemo: '',
        descripcion: ''
      });
    }
  };

  return (
    <section className="admin-panel">
      <h3>⚙️ Panel de Administración: Publicar Nuevo Proyecto</h3>
      <form onSubmit={manejarSubmit} className="form-grid">
        <input
          type="text"
          name="titulo"
          placeholder="Título del proyecto *"
          value={formulario.titulo}
          onChange={manejarCambio}
          required
        />
        <input
          type="text"
          name="tecnologias"
          placeholder="Tecnologías (ej. React, Express, MongoDB)"
          value={formulario.tecnologias}
          onChange={manejarCambio}
        />
        <input
          type="url"
          name="imagenUrl"
          placeholder="URL de la imagen (opcional)"
          value={formulario.imagenUrl}
          onChange={manejarCambio}
        />
        <input
          type="url"
          name="urlDemo"
          placeholder="URL de Demo o GitHub"
          value={formulario.urlDemo}
          onChange={manejarCambio}
        />
        <textarea
          name="descripcion"
          placeholder="Descripción breve del proyecto *"
          value={formulario.descripcion}
          onChange={manejarCambio}
          required
        />
        <button type="submit" className="btn-guardar">
          + Guardar Proyecto en MongoDB
        </button>
      </form>
    </section>
  );
}

export default AdminForm;
