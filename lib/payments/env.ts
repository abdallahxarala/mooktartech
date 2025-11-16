export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`La variable d'environnement ${name} est requise pour les paiements.`)
  }
  return value
}

