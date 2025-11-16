import crypto from 'crypto'

export function createHmacSignature(payload: string, secret: string, algorithm: string = 'sha256') {
  return crypto.createHmac(algorithm, secret).update(payload).digest('hex')
}

export function verifyHmacSignature(
  signature: string | null,
  payload: string,
  secret: string,
  algorithm: string = 'sha256'
) {
  if (!signature) return false
  const expected = createHmacSignature(payload, secret, algorithm)
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

