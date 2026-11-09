export function formatPrice(amount) {
  return `US$${Number(amount).toFixed(2)}`
}

export function readSavedValue(key, fallback) {
  try {
    const savedValue = window.localStorage.getItem(key)
    return savedValue === null ? fallback : JSON.parse(savedValue)
  } catch {
    return fallback
  }
}

export function saveValue(key, value) {
  try {
    if (value === null) {
      window.localStorage.removeItem(key)
      return
    }

    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return
  }
}