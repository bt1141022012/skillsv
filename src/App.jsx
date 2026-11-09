import { useState } from 'react'
import './App.css'

const courses = [
  {
    category: 'Marketing y Ventas',
    title: 'Marketing Digital para Emprendedores',
    description:
      'Explora herramientas para comunicar mejor tu emprendimiento y dar coherencia a su presencia digital.',
    price: 'US$25.00',
  },
  {
    category: 'Diseño y Creatividad',
    title: 'Taller Práctico de Diseño Gráfico con Canva y Photoshop',
    description:
      'Acércate a principios de diseño para crear comunicaciones visuales más claras y consistentes.',
    price: 'US$20.00',
  },
  {
    category: 'Tecnología y Programación',
    title: 'Diplomado en Desarrollo Web Básico (HTML, CSS y JS)',
    description:
      'Descubre cómo se estructuran, presentan y enriquecen las interacciones de una página web sencilla.',
    price: 'US$45.00',
    url: 'https://bt1141022012.systeme.io/school/course/appmovilreact',
  },
  {
    category: 'Ofimática y Herramientas Digitales',
    title: 'Curso Básico de Office',
    description:
      'Fortalece habilidades de organización y trabajo con herramientas de oficina para tareas cotidianas.',
    price: 'US$20.00',
  },
  {
    category: 'Negocios y Gestión',
    title: 'Taller de Finanzas Personales y Contabilidad Básica',
    description:
      'Conoce conceptos iniciales para registrar y comprender mejor los movimientos de tus recursos.',
    price: 'US$18.00',
  },
  {
    category: 'Multimedia',
    title: 'Curso de Edición de Video y Creación de Contenido',
    description:
      'Explora una forma más ordenada de pensar, preparar y editar piezas audiovisuales básicas.',
    price: 'US$22.00',
  },
]

const benefits = [
  {
    title: 'Formación online',
    description:
      'Una propuesta de aprendizaje digital que puedes explorar desde donde estés.',
  },
  {
    title: 'Habilidades prácticas',
    description:
      'Temas pensados para aplicar nuevas herramientas en proyectos, estudios y trabajo.',
  },
  {
    title: 'Precios accesibles',
    description:
      'Consulta precios estimados y confirma las condiciones antes de inscribirte.',
  },
]

const steps = [
  {
    title: '1. Elige tu curso',
    description: 'Explora el catálogo y revisa el contenido propuesto.',
  },
  {
    title: '2. Consulta disponibilidad y condiciones',
    description: 'Verifica los detalles del programa antes de avanzar.',
  },
  {
    title: '3. Confirma tu inscripción',
    description:
      'Sigue las indicaciones de inscripción una vez confirmadas las condiciones.',
  },
]

const questions = [
  {
    question: '¿La formación es digital?',
    answer:
      'Skill SV es un centro virtual de capacitación digital. Consulta la modalidad específica de cada programa antes de inscribirte.',
  },
  {
    question: '¿Hay talleres en vivo?',
    answer:
      'Los talleres en vivo dependen del programa. Consulta las condiciones de la próxima convocatoria.',
  },
  {
    question: '¿Se entrega un certificado?',
    answer:
      'Certificado digital de participación según condiciones del programa. Confirma sus condiciones antes de inscribirte.',
  },
  {
    question: '¿Los precios están en dólares?',
    answer:
      'Los precios publicados son estimados y están expresados en dólares estadounidenses. Confirma el importe final antes de inscribirte.',
  },
  {
    question: '¿Dónde consulto fechas, duración y requisitos?',
    answer:
      'Consulta las fechas, la duración y los requisitos específicos antes de inscribirte; pueden variar según el programa.',
  },
]

const navigation = [
  ['Inicio', '#inicio'],
  ['Nosotros', '#nosotros'],
  ['Cursos', '#cursos'],
  ['Cómo funciona', '#como-funciona'],
  ['Preguntas frecuentes', '#preguntas'],
  ['Contacto', '#contacto'],
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="site-header">
        <div className="nav-container">
          <a className="logo" href="#inicio" onClick={closeMenu}>
            Skill SV
          </a>
          <button
            aria-controls="main-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className={`nav-toggle${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
          <nav
            aria-label="Navegación principal"
            className={`site-nav${menuOpen ? ' is-open' : ''}`}
            id="main-navigation"
          >
            <ul>
              {navigation.map(([label, href]) => (
                <li key={href}>
                  <a href={href} onClick={closeMenu}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section aria-labelledby="hero-title" className="hero" id="inicio">
          <div className="hero-content">
            <span className="kicker">Capacitación Digital · Skill SV</span>
            <h1 id="hero-title">Aprende hoy. Abre nuevas oportunidades.</h1>
            <p>
              Desarrolla habilidades digitales para tus estudios, tu
              emprendimiento y tu vida profesional.
            </p>
            <a className="btn" href="#cursos">
              Explorar cursos
            </a>
          </div>
          <div className="hero-image">
            <img
              alt="Estudiante participando en una capacitación en línea"
              fetchPriority="high"
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85"
            />
          </div>
        </section>

        <section aria-labelledby="about-title" className="about" id="nosotros">
          <span className="kicker">Sobre nosotros</span>
          <h2 id="about-title">Aprender para seguir avanzando.</h2>
          <p>
            Skill SV tiene la misión de acercar capacitación digital práctica y
            accesible. Somos un proyecto de Sonsonate, El Salvador, con alcance
            nacional e internacional. Queremos ofrecer temas relevantes para
            universitarios, emprendedores, independientes y jóvenes de 18 a 35
            años, con información clara para tomar decisiones de aprendizaje.
          </p>
          <a className="btn btn-light" href="#cursos">
            Explorar cursos
          </a>
        </section>

        <section aria-labelledby="benefits-title" className="container">
          <div className="section-header">
            <span className="kicker">Por qué aprender aquí</span>
            <h2 id="benefits-title">Aprender con un propósito claro.</h2>
          </div>
          <div className="benefits-grid">
            {benefits.map((benefit) => (
              <article className="benefit-card" key={benefit.title}>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="courses-title"
          className="container courses-section"
          id="cursos"
        >
          <div className="section-header">
            <span className="kicker">Explora tu próximo paso</span>
            <h2 id="courses-title">Catálogo de cursos</h2>
            <p>
              Encuentra un tema que conecte con lo que quieres aprender. Precios
              sujetos a confirmación.
            </p>
          </div>
          <div className="catalog-grid">
            {courses.map((course) => (
              <article className="course-card" key={course.title}>
                <div>
                  <span className="course-tag">{course.category}</span>
                  <h3>{course.title}</h3>
                  <p className="course-pitch">{course.description}</p>
                </div>
                <div className="course-footer">
                  <div>
                    <span className="price-label">Precio estimado</span>
                    <span className="price">{course.price}</span>
                  </div>
                  <a
                    className="details-link"
                    href={course.url || '#contacto'}
                    rel={course.url ? 'noreferrer' : undefined}
                    target={course.url ? '_blank' : undefined}
                  >
                    Ver detalle <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="steps-title"
          className="container how-section"
          id="como-funciona"
        >
          <div className="section-header">
            <span className="kicker">Inscripción</span>
            <h2 id="steps-title">Cómo funciona</h2>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="faq-title"
          className="container faq-section"
          id="preguntas"
        >
          <div className="section-header">
            <span className="kicker">Resolvemos tus dudas</span>
            <h2 id="faq-title">Preguntas frecuentes</h2>
          </div>
          <div className="faq-list">
            {questions.map((item) => (
              <article className="faq-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="contact-title"
          className="contact"
          id="contacto"
        >
          <h2 id="contact-title">Da el siguiente paso en tu aprendizaje</h2>
          <p>
            Consulta la disponibilidad y las condiciones antes de decidir. Los
            canales de contacto están pendientes de completar.
          </p>
          <a
            className="btn"
            href="https://wa.me/50361177455"
            rel="noreferrer"
            target="_blank"
          >
            Consultar inscripción
          </a>

          <div className="contact-info">
            <div className="contact-item">
              <h3>Ubicación</h3>
              <p>Sonsonate, El Salvador</p>
            </div>
            <div className="contact-item">
              <h3>Correo</h3>
              <p>
                <a href="mailto:ventas@skillsv.com">ventas@skillsv.com</a>
              </p>
            </div>
            <div className="contact-item">
              <h3>WhatsApp</h3>
              <p>
                <a href="https://wa.me/50361177455">6117-7455</a>
              </p>
            </div>
            <div className="contact-item">
              <h3>Facebook</h3>
              <p>Skill SV</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <h2>Skill SV</h2>
        <p>Conocimiento que abre oportunidades</p>
        <p>
          La información de cursos, precios y condiciones está sujeta a
          confirmación antes de inscribirse.
        </p>
      </footer>
    </>
  )
}

export default App
