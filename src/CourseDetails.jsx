import { useEffect } from 'react'
import { formatPrice } from './commerce.js'

function CourseDetails({ course, details, onAddToCart, onClose, status }) {
  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div
      className="cart-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby="course-detail-title"
        aria-modal="true"
        className="cart-dialog course-details-dialog"
        role="dialog"
      >
        <header className="cart-dialog-header">
          <div>
            <span className="kicker">{course.category}</span>
            <h2 id="course-detail-title">{course.title}</h2>
          </div>
          <button
            aria-label="Cerrar detalle del curso"
            className="cart-close"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {status === 'loading' && (
          <div aria-live="polite" className="course-detail-message">
            Cargando temario…
          </div>
        )}

        {status === 'error' && (
          <div className="course-detail-message" role="alert">
            No se pudo cargar el temario. Intenta abrir el detalle de nuevo.
          </div>
        )}

        {status === 'missing' && (
          <div className="course-detail-message" role="status">
            Aún no hay un temario disponible para este curso.
          </div>
        )}

        {status === 'ready' && details && (
          <>
            <div className="course-detail-content">
              <p className="course-detail-description">{course.description}</p>
              <div className="course-detail-meta">
                <div className="course-detail-hours">
                  <strong>{details.hours}</strong>
                  <span>horas estimadas</span>
                </div>
                <div className="course-detail-seats">
                  <strong>{details.availableSeats}</strong>
                  <span>cupos disponibles</span>
                </div>
              </div>
              <p className="course-detail-note">
                Cupos de demostración. Confirma la disponibilidad real antes de
                inscribirte.
              </p>
              <div className="course-modules">
                {details.modules.map((module, index) => (
                  <article className="course-module" key={module.title}>
                    <span className="course-module-number">
                      Módulo {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3>{module.title}</h3>
                    <ul>
                      {module.topics.map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
            <footer className="course-detail-footer">
              <div>
                <span className="price-label">Precio estimado</span>
                <strong>{formatPrice(course.price)}</strong>
              </div>
              <div className="course-detail-actions">
                {course.url && (
                  <a
                    className="details-link"
                    href={course.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Sitio del curso <span aria-hidden="true">↗</span>
                  </a>
                )}
                <button
                  className="btn"
                  onClick={() => {
                    onAddToCart()
                    onClose()
                  }}
                  type="button"
                >
                  Agregar al carrito
                </button>
              </div>
            </footer>
          </>
        )}
      </section>
    </div>
  )
}

export default CourseDetails