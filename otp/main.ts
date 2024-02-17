import * as OTPAUTH from 'otpauth'

export function createRandomSecret(length = 64) {
  return [...Array(length)].map(() =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

export function createToken(secret: string, timestamp?: number) {
  const totp = new OTPAUTH.TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAUTH.Secret.fromHex(secret)
  })

  return totp.generate({ timestamp })
}

export function createUri(secret: string, issuer: string, label: string) {
  const totp = new OTPAUTH.TOTP({
    issuer,
    label,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAUTH.Secret.fromHex(secret),
    issuerInLabel: true
  })

  return totp.toString()
}

export function isValid(secret: string, token: string) {
  const totp = new OTPAUTH.TOTP({
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAUTH.Secret.fromHex(secret)
  })

  return totp.validate({ token }) === 0
}
