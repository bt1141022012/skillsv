import { useState } from 'react'
import { loginStudent, registerStudent } from './auth.js'

function AuthPage({ onAuthenticated, onClose }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isRegistering = mode === 'register'

  async function submitForm(event) {
    event.preventDefault()
    setError('')

    if (isRegistering && password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setIsSubmitting(true)

    try {
      const student = isRegistering
        ? await registerStudent({ name, email, password })
        : await loginStudent({ email, password })
      onAuthenticated(student)
    } catch (submitError) {
      setError(submitError.message || 'No se pudo completar la solicitud.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    setError('')
  }

  return (
    <div
      className="auth-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby="auth-title"
        aria-modal="true"
        className="auth-dialog"
        role="dialog"
      >
        <header className="cart-dialog-header">
          <div>
            <span className="kicker">Área de alumnos</span>
            <h2 id="auth-title">
              {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
            </h2>
          </div>
          <button
            aria-label="Cerrar acceso de alumnos"
            className="cart-close"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="auth-content">
          <div aria-label="Acceso de alumnos" className="auth-switch" role="group">
            <button
              aria-pressed={!isRegistering}
              className={!isRegistering ? 'is-selected' : ''}
              onClick={() => changeMode('login')}
              type="button"
            >
              Iniciar sesión
            </button>
            <button
              aria-pressed={isRegistering}
              className={isRegistering ? 'is-selected' : ''}
              onClick={() => changeMode('register')}
              type="button"
            >
              Registrarme
            </button>
          </div>

          <p className="auth-intro">
            {isRegistering
              ? 'Crea tu perfil de alumno para continuar con tu inscripción.'
              : 'Ingresa con la cuenta de alumno guardada en este navegador.'}
          </p>

          <form className="auth-form" onSubmit={submitForm}>
            {isRegistering && (
              <label className="form-field">
                <span>Nombre completo</span>
                <input
                  autoComplete="name"
                  minLength={2}
                  onChange={(event) => setName(event.target.value)}
                  required
                  value={name}
                />
              </label>
            )}
            <label className="form-field">
              <span>Correo electrónico</span>
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label className="form-field">
              <span>Contraseña</span>
              <input
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                minLength={isRegistering ? 8 : undefined}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>
            {isRegistering && (
              <label className="form-field">
                <span>Confirmar contraseña</span>
                <input
                  autoComplete="new-password"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  type="password"
                  value={confirmPassword}
                />
              </label>
            )}

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <p className="auth-storage-note">
              Cuenta de demostración guardada en este navegador. No uses una
              contraseña que utilices en otros servicios.
            </p>

            <button
              className="btn auth-submit"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? 'Procesando…'
                : isRegistering
                  ? 'Crear cuenta de alumno'
                  : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default AuthPage