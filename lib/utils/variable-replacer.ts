/**
 * Detect variables in text like {nom}, {email}
 */
export function detectVariables(text: string): string[] {
  const regex = /\{([^}]+)\}/g
  const matches = text.matchAll(regex)
  return Array.from(matches, (m) => m[1])
}

/**
 * Replace variables with actual values
 */
export function replaceVariables(
  text: string,
  data: Record<string, string>
): string {
  return text.replace(/\{([^}]+)\}/g, (match, varName) => {
    return data[varName] || match
  })
}

/**
 * Check if text contains variables
 */
export function hasVariables(text: string): boolean {
  return /\{[^}]+\}/.test(text)
}

/**
 * Get preview text with sample data
 */
export function getPreviewText(
  text: string,
  sampleData?: Record<string, string>
): string {
  const defaultData: Record<string, string> = {
    nom: "John Doe",
    prenom: "John",
    email: "john@example.com",
    entreprise: "Acme Corp",
    poste: "Developer",
    telephone: "+33 6 12 34 56 78",
  }

  return replaceVariables(text, { ...defaultData, ...sampleData })
}

/**
 * Validate variable name
 */
export function isValidVariableName(name: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)
}

/**
 * Format text to insert variable
 */
export function insertVariable(
  text: string,
  cursorPosition: number,
  variableName: string
): { newText: string; newCursorPosition: number } {
  const varText = `{${variableName}}`
  const newText =
    text.slice(0, cursorPosition) + varText + text.slice(cursorPosition)
  const newCursorPosition = cursorPosition + varText.length

  return { newText, newCursorPosition }
}

/**
 * Extract all unique variables from elements
 */
export function extractVariablesFromElements(
  elements: Array<{ type: string; properties: any }>
): string[] {
  const variables = new Set<string>()

  elements.forEach((element) => {
    if (element.type === "text" && element.properties?.text) {
      detectVariables(element.properties.text).forEach((v) => variables.add(v))
    }
  })

  return Array.from(variables)
}

