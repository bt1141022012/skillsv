import { useEffect, useState } from 'react'
import CartCheckout from './CartCheckout.jsx'
import { formatPrice, readSavedValue, saveValue } from './commerce.js'
import './App.css'

const courses = [
  {
    id: 'marketing-digital',
    category: 'Marketing y Ventas',
    title: 'Marketing Digital para Emprendedores',
    description:
      'Explora herramientas para comunicar mejor tu emprendimiento y dar coherencia a su presencia digital.',
    price: 25,
  },
  {
    id: 'diseno-grafico',
    category: 'Diseño y Creatividad',
    title: 'Taller Práctico de Diseño Gráfico con Canva y Photoshop',
    description:
      'Acércate a principios de diseño para crear comunicaciones visuales más claras y consistentes.',
    price: 20,
  },
  {
    id: 'desarrollo-web',
    category: 'Tecnología y Programación',
    title: 'Diplomado en Desarrollo Web Básico (HTML, CSS y JS)',
    description:
      'Descubre cómo se estructuran, presentan y enriquecen las interacciones de una página web sencilla.',
    price: 45,
    url: 'https://bt1141022012.systeme.io/school/course/appmovilreact',
  },
  {
    id: 'office-basico',
    category: 'Ofimática y Herramientas Digitales',
    title: 'Curso Básico de Office',
    description:
      'Fortalece habilidades de organización y trabajo con herramientas de oficina para tareas cotidianas.',
    price: 20,
  },
  {
    id: 'finanzas-personales',
    category: 'Negocios y Gestión',
    title: 'Taller de Finanzas Personales y Contabilidad Básica',
    description:
      'Conoce conceptos iniciales para registrar y comprender mejor los movimientos de tus recursos.',
    price: 18,
  },
  {
    id: 'edicion-video',
    category: 'Multimedia',
    title: 'Curso de Edición de Video y Creación de Contenido',
    description:
      'Explora una forma más ordenada de pensar, preparar y editar piezas audiovisuales básicas.',
    price: 22,
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
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState(() => {
    const savedCart = readSavedValue('skillsv:cart', [])
    return Array.isArray(savedCart) ? savedCart : []
  })
  const [lastOrder, setLastOrder] = useState(() =>
    readSavedValue('skillsv:last-order', null),
  )

  useEffect(() => {
    saveValue('skillsv:cart', cart)
  }, [cart])

  useEffect(() => {
    saveValue('skillsv:last-order', lastOrder)
  }, [lastOrder])

  const cartItems = cart
    .map((item) => ({
      course: courses.find((course) => course.id === item.courseId),
      quantity: item.quantity,
    }))
    .filter((item) => item.course && item.quantity > 0)
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.course.price * item.quantity,
    0,
  )

  function closeMenu() {
    setMenuOpen(false)
  }

  function addToCart(courseId) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.courseId === courseId)

      if (existingItem) {
        return currentCart.map((item) =>
          item.courseId === courseId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }

      return [...currentCart, { courseId, quantity: 1 }]
    })
  }

  function changeQuantity(courseId, amount) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.courseId === courseId
            ? { ...item, quantity: Math.max(1, item.quantity + amount) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  function removeFromCart(courseId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.courseId !== courseId),
    )
  }

  function completeCheckout({ customerName, customerEmail, paymentMethod }) {
    const order = {
      id: `SK-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customerName,
      customerEmail,
      paymentMethod,
      status: 'Pago simulado',
      items: cartItems.map(({ course, quantity }) => ({
        courseId: course.id,
        title: course.title,
        quantity,
        unitPrice: course.price,
        lineTotal: course.price * quantity,
      })),
      total: cartTotal,
    }

    setLastOrder(order)
    setCart([])
    return order
  }

  return (
    <>
      <header className="site-header">
        <div className="nav-container">
          <a className="logo" href="#inicio" onClick={closeMenu}>
            Skill SV
          </a>
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
          <div className="nav-actions">
            <button
              aria-label={`Abrir carrito, ${cartCount} ${cartCount === 1 ? 'curso' : 'cursos'}`}
              className="cart-trigger"
              onClick={() => setCartOpen(true)}
              type="button"
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="20"
                viewBox="0 0 24 24"
                width="20"
              >
                <path
                  d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 1.9-1.4L21 9H6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
                <circle cx="10" cy="20" r="1.2" fill="currentColor" />
                <circle cx="18" cy="20" r="1.2" fill="currentColor" />
              </svg>
              <span>Carrito</span>
              <span aria-live="polite" className="cart-count">
                {cartCount}
              </span>
            </button>
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
          </div>
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
                    <span className="price">{formatPrice(course.price)}</span>
                  </div>
                    <div className="course-actions">
                      <button
                        className="add-course-button"
                        onClick={() => addToCart(course.id)}
                        type="button"
                      >
                        Agregar
                      </button>
                      <a
                        className="details-link"
                        href={course.url || '#contacto'}
                        rel={course.url ? 'noreferrer' : undefined}
                        target={course.url ? '_blank' : undefined}
                      >
                        Ver detalle <span aria-hidden="true">→</span>
                      </a>
                    </div>
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
      {cartOpen && (
        <CartCheckout
          items={cartItems}
          lastOrder={lastOrder}
          onChangeQuantity={changeQuantity}
          onCheckout={completeCheckout}
          onClose={() => setCartOpen(false)}
          onRemove={removeFromCart}
          total={cartTotal}
        />
      )}
    </>
  )
}

export default App
