const usersKey = 'skillsv:users'
const sessionKey = 'skillsv:session'
const passwordIterations = 120000

function readUsers() {
  try {
    const users = JSON.parse(window.localStorage.getItem(usersKey) || '[]')
    return Array.isArray(users) ? users : []
  } catch {
    return []
  }
}

function saveLocalValue(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    throw new Error('No se pudo guardar la cuenta en este navegador.')
  }
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function hexToBytes(value) {
  return new Uint8Array(value.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)))
}

async function hashPassword(password, salt) {
  const cryptoApi = globalThis.crypto

  if (!cryptoApi?.subtle || !cryptoApi.getRandomValues) {
    throw new Error('Este navegador no permite crear una cuenta segura.')
  }

  const key = await cryptoApi.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const hash = await cryptoApi.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: passwordIterations,
      hash: 'SHA-256',
    },
    key,
    256,
  )

  return bytesToHex(new Uint8Array(hash))
}

function createSession(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: 'Alumno',
  }
}

export function readCurrentUser() {
  try {
    const user = JSON.parse(window.localStorage.getItem(sessionKey) || 'null')

    if (user?.id && user?.name && user?.email) return user
  } catch {
    return null
  }

  return null
}

export async function registerStudent({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedName = name.trim()
  const users = readUsers()

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('Ya existe una cuenta con ese correo electrónico.')
  }

  if (password.length < 8) {
    throw new Error('La contraseña debe tener al menos 8 caracteres.')
  }

  const salt = globalThis.crypto.getRandomValues(new Uint8Array(16))
  const user = {
    id: `${Date.now().toString(36)}-${bytesToHex(salt.slice(0, 4))}`,
    name: normalizedName,
    email: normalizedEmail,
    role: 'Alumno',
    salt: bytesToHex(salt),
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  }

  saveLocalValue(usersKey, [...users, user])
  const session = createSession(user)
  saveLocalValue(sessionKey, session)
  return session
}

export async function loginStudent({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const user = readUsers().find((item) => item.email === normalizedEmail)

  if (!user || !user.salt || !user.passwordHash) {
    throw new Error('Correo o contraseña incorrectos.')
  }

  const passwordHash = await hashPassword(password, hexToBytes(user.salt))

  if (passwordHash !== user.passwordHash) {
    throw new Error('Correo o contraseña incorrectos.')
  }

  const session = createSession(user)
  saveLocalValue(sessionKey, session)
  return session
}

export function logoutStudent() {
  try {
    window.localStorage.removeItem(sessionKey)
  } catch {
    return
  }
}