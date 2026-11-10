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
  const [completedOrder, setCompletedOrder] = useState(null)
  const [cardNumber, setCardNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function closeOnEscape(event) {
      if (event.key === 'Escape' && !isProcessing) onClose()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isProcessing, onClose])

  async function submitCheckout(event) {
    event.preventDefault()
    if (!isAuthenticated) {
      onRequestAuth()
      return
    }

    setIsProcessing(true)
    setCardNumber('')
    await new Promise((resolve) => window.setTimeout(resolve, 2500))

    const order = onCheckout({
      customerName: user.name,
      customerEmail: user.email,
      paymentMethod: 'Tarjeta de crédito',
    })
    setCompletedOrder(order)
    setStep('success')
  }

  function formatCardNumber(value) {
    return value
      .replace(/\D/g, '')
      .slice(0, 19)
      .replace(/(.{4})/g, '$1 ')
      .trim()
  }

  const title = {
    cart: 'Tu carrito',
    checkout: 'Finaliza tu pedido',
    success: 'Pago realizado',
  }[step]

  return (
    <div
      className="cart-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isProcessing) onClose()
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
            <h2 id="cart-dialog-title">{title}</h2>
          </div>
          <button
            aria-label="Cerrar carrito"
            className="cart-close"
            onClick={onClose}
            disabled={isProcessing}
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
          <form
            aria-busy={isProcessing}
            className="checkout-form"
            onSubmit={submitCheckout}
          >
            <button
              className="back-to-cart"
              onClick={() => setStep('cart')}
              type="button"
              disabled={isProcessing}
            >
              ← Volver al carrito
            </button>
            <div className="checkout-order-total">
              <span>{items.length} {items.length === 1 ? 'curso' : 'cursos'}</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            {isProcessing ? (
              <div aria-live="polite" className="payment-processing" role="status">
                <span aria-hidden="true" className="payment-spinner" />
                <span>Procesando pago...</span>
              </div>
            ) : (
              <>
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
                  <legend>Datos de la tarjeta de crédito</legend>
                  <label className="form-field">
                    <span>Nombre en la tarjeta</span>
                    <input
                      autoComplete="cc-name"
                      maxLength={80}
                      name="cardholder"
                      required
                    />
                  </label>
                  <label className="form-field">
                    <span>Número de tarjeta</span>
                    <input
                      autoComplete="cc-number"
                      inputMode="numeric"
                      maxLength={23}
                      name="card-number"
                      onChange={(event) =>
                        setCardNumber(formatCardNumber(event.target.value))
                      }
                      pattern="[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{1,4}|[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4} [0-9]{1,3}"
                      placeholder="0000 0000 0000 0000"
                      required
                      type="text"
                      value={cardNumber}
                    />
                  </label>
                  <div className="card-fields-row">
                    <label className="form-field">
                      <span>Vencimiento</span>
                      <input
                        autoComplete="cc-exp"
                        min={new Date().toISOString().slice(0, 7)}
                        name="card-expiration"
                        required
                        type="month"
                      />
                    </label>
                    <label className="form-field">
                      <span>Código de seguridad</span>
                      <input
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        maxLength={4}
                        minLength={3}
                        name="card-security-code"
                        pattern="[0-9]{3,4}"
                        placeholder="CVV"
                        required
                        type="password"
                      />
                    </label>
                  </div>
                </fieldset>
                <button className="btn checkout-button" type="submit">
                  Pagar {formatPrice(total)}
                </button>
              </>
            )}
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
            <h3>Pago realizado</h3>
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
                <dt>Método de pago</dt>
                <dd>{completedOrder.paymentMethod}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{completedOrder.status}</dd>
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