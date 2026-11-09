import { useEffect, useState } from 'react'
import AuthPage from './AuthPage.jsx'
import CartCheckout from './CartCheckout.jsx'
import CourseDetails from './CourseDetails.jsx'
import { logoutStudent, readCurrentUser } from './auth.js'
import { formatPrice, readSavedValue, saveValue } from './commerce.js'
import './App.css'

const courses = [
  {
    id: 'marketing-digital',
    category: 'Marketing y Ventas',
    title: 'Marketing Digital para Emprendedores',
    description:
      'Explora herramientas para comunicar mejor tu emprendimiento y dar coherencia a su presencia digital.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=82',
    imageAlt: 'Panel de analítica digital en una computadora portátil',
    price: 25,
  },
  {
    id: 'diseno-grafico',
    category: 'Diseño y Creatividad',
    title: 'Taller Práctico de Diseño Gráfico con Canva y Photoshop',
    description:
      'Acércate a principios de diseño para crear comunicaciones visuales más claras y consistentes.',
    image:
      'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=82',
    imageAlt: 'Espacio de trabajo creativo con herramientas de diseño',
    price: 20,
  },
  {
    id: 'desarrollo-web',
    category: 'Tecnología y Programación',
    title: 'Diplomado en Desarrollo Web Básico (HTML, CSS y JS)',
    description:
      'Descubre cómo se estructuran, presentan y enriquecen las interacciones de una página web sencilla.',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=82',
    imageAlt: 'Desarrollador trabajando en código desde una computadora',
    price: 45,
    url: 'https://bt1141022012.systeme.io/school/course/appmovilreact',
  },
  {
    id: 'office-basico',
    category: 'Ofimática y Herramientas Digitales',
    title: 'Curso Básico de Office',
    description:
      'Fortalece habilidades de organización y trabajo con herramientas de oficina para tareas cotidianas.',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=82',
    imageAlt: 'Espacio de oficina preparado para trabajar y colaborar',
    price: 20,
  },
  {
    id: 'finanzas-personales',
    category: 'Negocios y Gestión',
    title: 'Taller de Finanzas Personales y Contabilidad Básica',
    description:
      'Conoce conceptos iniciales para registrar y comprender mejor los movimientos de tus recursos.',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=82',
    imageAlt: 'Documentos y calculadora para organizar las finanzas',
    price: 18,
  },
  {
    id: 'edicion-video',
    category: 'Multimedia',
    title: 'Curso de Edición de Video y Creación de Contenido',
    description:
      'Explora una forma más ordenada de pensar, preparar y editar piezas audiovisuales básicas.',
    image:
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=82',
    imageAlt: 'Equipo audiovisual para grabar y editar contenido',
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
  ['Cómo funciona', '#como-funciona'],
  ['Cursos', '#cursos'],
  ['Mis cursos', '#mis-cursos'],
  ['Preguntas frecuentes', '#preguntas'],
  ['Contacto', '#contacto'],
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authUser, setAuthUser] = useState(() => readCurrentUser())
  const [cart, setCart] = useState(() => {
    const savedCart = readSavedValue('skillsv:cart', [])
    return Array.isArray(savedCart) ? savedCart : []
  })
  const [lastOrder, setLastOrder] = useState(() =>
    readSavedValue('skillsv:last-order', null),
  )
  const [purchases, setPurchases] = useState(() => {
    const savedPurchases = readSavedValue('skillsv:purchases', [])
    return Array.isArray(savedPurchases) ? savedPurchases : []
  })
  const [courseDetailState, setCourseDetailState] = useState(null)

  useEffect(() => {
    saveValue('skillsv:cart', cart)
  }, [cart])

  useEffect(() => {
    saveValue('skillsv:last-order', lastOrder)
  }, [lastOrder])

  useEffect(() => {
    saveValue('skillsv:purchases', purchases)
  }, [purchases])

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
  const myCourses = purchases
    .filter((purchase) => purchase.studentId === authUser?.id)
    .map((purchase) => ({
      purchase,
      course: courses.find((course) => course.id === purchase.courseId),
    }))
    .filter((item) => item.course)

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleLogout() {
    logoutStudent()
    setAuthUser(null)
  }

  async function openCourseDetails(course) {
    setCourseDetailState({ course, details: null, status: 'loading' })

    try {
      const { courseDetails } = await import('./data/courseDetails.js')
      const details = courseDetails[course.id]

      setCourseDetailState((currentState) =>
        currentState?.course.id === course.id
          ? { course, details, status: details ? 'ready' : 'missing' }
          : currentState,
      )
    } catch {
      setCourseDetailState((currentState) =>
        currentState?.course.id === course.id
          ? { course, details: null, status: 'error' }
          : currentState,
      )
    }
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

  function completeCheckout({ paymentMethod }) {
    if (!authUser) return null

    const createdAt = new Date().toISOString()
    const order = {
      id: `SK-${Date.now().toString(36).toUpperCase()}`,
      createdAt,
      studentId: authUser.id,
      customerName: authUser.name,
      customerEmail: authUser.email,
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

    const newPurchases = order.items.map((item) => ({
      id: `${order.id}:${item.courseId}`,
      orderId: order.id,
      studentId: authUser.id,
      courseId: item.courseId,
      quantity: item.quantity,
      purchasedAt: createdAt,
      paid: item.lineTotal,
      status: 'Inscrito',
    }))

    setLastOrder(order)
    setPurchases((currentPurchases) => [
      ...newPurchases,
      ...currentPurchases,
    ])
    setCart([])
    return order
  }

  return (
    <>
      <header className="site-header">
        <div className="nav-container">
          <a className="logo" href="#inicio" onClick={closeMenu}>
            <img
              alt="Skill SV"
              className="logo-image"
              src={`${import.meta.env.BASE_URL}Logo.jpg`}
            />
          </a>
          <nav
            aria-label="Navegación principal"
            className={`site-nav${menuOpen ? ' is-open' : ''}`}
            id="main-navigation"
          >
            <ul className="primary-navigation">
              {navigation
                .filter(
                  ([, href]) =>
                    href === '#inicio' ||
                    href === '#nosotros' ||
                    href === '#como-funciona' ||
                    href === '#cursos',
                )
                .map(([label, href]) => (
                  <li key={href}>
                    <a href={href} onClick={closeMenu}>
                      {label}
                    </a>
                  </li>
                ))}
            </ul>
            <details className="nav-more">
              <summary>
                Más
                <span aria-hidden="true" className="nav-more-chevron" />
              </summary>
              <ul>
                {navigation
                  .filter(
                    ([, href]) =>
                      href !== '#inicio' &&
                      href !== '#nosotros' &&
                      href !== '#como-funciona' &&
                      href !== '#cursos',
                  )
                  .map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(event) => {
                      event.currentTarget.closest('details').open = false
                      closeMenu()
                    }}
                  >
                    {label}
                  </a>
                </li>
                  ))}
              </ul>
            </details>
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
            {authUser ? (
              <>
                <span className="account-name" title={authUser.email}>
                  {authUser.name}
                </span>
                <button
                  className="account-trigger"
                  onClick={handleLogout}
                  type="button"
                >
                  Salir
                </button>
              </>
            ) : (
              <button
                className="account-trigger"
                onClick={() => setAuthOpen(true)}
                type="button"
              >
                Ingresar
              </button>
            )}
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
                  <img
                    alt={course.imageAlt}
                    className="course-card-image"
                    decoding="async"
                    loading="lazy"
                    src={course.image}
                  />
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
                      <button
                        className="details-link"
                        onClick={() => openCourseDetails(course)}
                        type="button"
                      >
                        Ver detalle <span aria-hidden="true">→</span>
                      </button>
                    </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="my-courses-title"
          className="container my-courses-section"
          id="mis-cursos"
        >
          <div className="section-header">
            <span className="kicker">Área de aprendizaje</span>
            <h2 id="my-courses-title">Mis cursos</h2>
          </div>
          {!authUser ? (
            <div className="my-courses-empty">
              <p>Inicia sesión para consultar los cursos que has comprado.</p>
              <button
                className="btn"
                onClick={() => setAuthOpen(true)}
                type="button"
              >
                Ingresar como alumno
              </button>
            </div>
          ) : myCourses.length === 0 ? (
            <div className="my-courses-empty">
              <p>Aún no tienes cursos comprados.</p>
              <a className="btn" href="#cursos">
                Explorar cursos
              </a>
            </div>
          ) : (
            <div className="my-courses-grid">
              {myCourses.map(({ course, purchase }) => (
                <article className="my-course-item" key={purchase.id}>
                  <img
                    alt={course.imageAlt}
                    className="my-course-image"
                    decoding="async"
                    loading="lazy"
                    src={course.image}
                  />
                  <div className="my-course-content">
                    <span className="course-tag">{course.category}</span>
                    <h3>{course.title}</h3>
                    <p>
                      Pedido {purchase.orderId} ·{' '}
                      {new Intl.DateTimeFormat('es-SV', {
                        dateStyle: 'medium',
                      }).format(new Date(purchase.purchasedAt))}
                    </p>
                    {purchase.quantity > 1 && (
                      <p>{purchase.quantity} inscripciones</p>
                    )}
                    <div className="my-course-footer">
                      <span className="enrollment-status">
                        {purchase.status}
                      </span>
                      <button
                        className="details-link"
                        onClick={() => openCourseDetails(course)}
                        type="button"
                      >
                        Ver temario <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
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
          isAuthenticated={Boolean(authUser)}
          items={cartItems}
          lastOrder={lastOrder}
          onChangeQuantity={changeQuantity}
          onCheckout={completeCheckout}
          onClose={() => setCartOpen(false)}
          onRequestAuth={() => setAuthOpen(true)}
          onRemove={removeFromCart}
          total={cartTotal}
          user={authUser}
        />
      )}
      {authOpen && (
        <AuthPage
          onAuthenticated={(user) => {
            setAuthUser(user)
            setAuthOpen(false)
          }}
          onClose={() => setAuthOpen(false)}
        />
      )}
      {courseDetailState && (
        <CourseDetails
          course={courseDetailState.course}
          details={courseDetailState.details}
          onAddToCart={() => addToCart(courseDetailState.course.id)}
          onClose={() => setCourseDetailState(null)}
          status={courseDetailState.status}
        />
      )}
    </>
  )
}

export default App
