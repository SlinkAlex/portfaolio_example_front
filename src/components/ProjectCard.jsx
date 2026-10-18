// 📄 Ruta del archivo: src/components/ProjectCard.jsx

function ProjectCard({ proyecto, esAdmin, onEliminar }) {
  return (
    <article className="tarjeta-proyecto">
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

          {/* Renderizado Condicional: El botón Eliminar solo aparece en Modo Admin */}
          {esAdmin && (
            <button
              onClick={() => onEliminar(proyecto._id)}
              className="btn-eliminar"
            >
              🗑️ Eliminar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
