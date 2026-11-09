import { useEffect, useState } from 'react'
import { formatPrice } from './commerce.js'

function CartCheckout({
  items,
  isAuthenticated,
  lastOrder,
  onChangeQuantity,
  onCheckout,
  onClose,
  onRequestAuth,
  onRemove,
  total,
  user,
}) {
  const [step, setStep] = useState('cart')
  const [paymentMethod, setPaymentMethod] = useState('Tarjeta simulada')
  const [completedOrder, setCompletedOrder] = useState(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  function submitCheckout(event) {
    event.preventDefault()
    if (!isAuthenticated) {
      onRequestAuth()
      return
    }

    const order = onCheckout({
      customerName: user.name,
      customerEmail: user.email,
      paymentMethod,
    })
    setCompletedOrder(order)
    setStep('success')
  }

  const title = {
    cart: 'Tu carrito',
    checkout: 'Finaliza tu pedido',
    success: 'Pedido confirmado',
  }[step]

  return (
    <div
      className="cart-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby="cart-dialog-title"
        aria-modal="true"
        className="cart-dialog"
        role="dialog"
      >
        <header className="cart-dialog-header">
          <div>
            <span className="kicker">Skill SV</span>
            <h2 id="cart-dialog-title">{title}</h2>
          </div>
          <button
            aria-label="Cerrar carrito"
            className="cart-close"
            onClick={onClose}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        {step === 'cart' && (
          <div className="cart-dialog-content">
            {items.length === 0 ? (
              <div className="empty-cart">
                <h3>Tu carrito está vacío</h3>
                <p>Agrega un curso del catálogo para comenzar tu pedido.</p>
                {lastOrder && (
                  <div className="saved-order-summary">
                    <span className="course-tag">Último pedido guardado</span>
                    <strong>{lastOrder.id}</strong>
                    <span>{lastOrder.status}</span>
                    <span>{formatPrice(lastOrder.total)}</span>
                  </div>
                )}
                <button className="btn" onClick={onClose} type="button">
                  Volver al catálogo
                </button>
              </div>
            ) : (
              <>
                <ul className="cart-items">
                  {items.map(({ course, quantity }) => (
                    <li className="cart-item" key={course.id}>
                      <div className="cart-item-info">
                        <span className="course-tag">{course.category}</span>
                        <h3>{course.title}</h3>
                        <span className="cart-item-price">
                          {formatPrice(course.price * quantity)}
                        </span>
                      </div>
                      <div className="cart-item-controls">
                        <div
                          aria-label={`Cantidad de ${course.title}`}
                          className="quantity-control"
                        >
                          <button
                            aria-label={`Restar una inscripción de ${course.title}`}
                            disabled={quantity <= 1}
                            onClick={() => onChangeQuantity(course.id, -1)}
                            type="button"
                          >
                            −
                          </button>
                          <span aria-live="polite">{quantity}</span>
                          <button
                            aria-label={`Agregar una inscripción de ${course.title}`}
                            onClick={() => onChangeQuantity(course.id, 1)}
                            type="button"
                          >
                            +
                          </button>
                        </div>
                        <button
                          aria-label={`Quitar ${course.title} del carrito`}
                          className="remove-item"
                          onClick={() => onRemove(course.id)}
                          type="button"
                        >
                          Quitar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="cart-total">
                  <span>Total estimado</span>
                  <strong>{formatPrice(total)}</strong>
                </div>
                <p className="simulation-note">
                  Simulación de compra. No se realizará un cargo real.
                </p>
                {!isAuthenticated && (
                  <div className="auth-required" role="status">
                    <p>Inicia sesión o crea tu cuenta de alumno para pagar.</p>
                    <button
                      className="account-trigger"
                      onClick={onRequestAuth}
                      type="button"
                    >
                      Iniciar sesión / registrarme
                    </button>
                  </div>
                )}
                <button
                  className="btn checkout-button"
                  onClick={() => setStep('checkout')}
                  disabled={!isAuthenticated}
                  type="button"
                >
                  Continuar al pago
                </button>
              </>
            )}
          </div>
        )}

        {step === 'checkout' && isAuthenticated && (
          <form className="checkout-form" onSubmit={submitCheckout}>
            <button
              className="back-to-cart"
              onClick={() => setStep('cart')}
              type="button"
            >
              ← Volver al carrito
            </button>
            <div className="checkout-order-total">
              <span>{items.length} {items.length === 1 ? 'curso' : 'cursos'}</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <label className="form-field">
              <span>Nombre completo</span>
              <input
                autoComplete="name"
                readOnly
                required
                value={user?.name || ''}
              />
            </label>
            <label className="form-field">
              <span>Correo electrónico</span>
              <input
                autoComplete="email"
                readOnly
                required
                type="email"
                value={user?.email || ''}
              />
            </label>
            <fieldset className="payment-methods">
              <legend>Método de pago (simulación)</legend>
              {['Tarjeta simulada', 'Transferencia simulada'].map((method) => (
                <label className="payment-option" key={method}>
                  <input
                    checked={paymentMethod === method}
                    name="payment-method"
                    onChange={() => setPaymentMethod(method)}
                    type="radio"
                    value={method}
                  />
                  <span>{method}</span>
                </label>
              ))}
              <p>No ingreses datos bancarios ni de tarjeta reales.</p>
            </fieldset>
            <button className="btn checkout-button" type="submit">
              Simular cobro por {formatPrice(total)}
            </button>
          </form>
        )}

        {step === 'checkout' && !isAuthenticated && (
          <div className="cart-dialog-content auth-required" role="alert">
            <p>Necesitas una sesión de alumno para continuar al pago.</p>
            <button
              className="account-trigger"
              onClick={onRequestAuth}
              type="button"
            >
              Iniciar sesión / registrarme
            </button>
          </div>
        )}

        {step === 'success' && completedOrder && (
          <div className="checkout-success">
            <span aria-hidden="true" className="success-mark">
              ✓
            </span>
            <h3>Pago simulado exitosamente</h3>
            <p>
              No se realizó ningún cargo real. El pedido quedó guardado en este
              navegador.
            </p>
            <dl className="order-receipt">
              <div>
                <dt>Número de pedido</dt>
                <dd>{completedOrder.id}</dd>
              </div>
              <div>
                <dt>Correo</dt>
                <dd>{completedOrder.customerEmail}</dd>
              </div>
              <div>
                <dt>Método</dt>
                <dd>{completedOrder.paymentMethod}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{formatPrice(completedOrder.total)}</dd>
              </div>
            </dl>
            <button className="btn checkout-button" onClick={onClose} type="button">
              Cerrar
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default CartCheckout