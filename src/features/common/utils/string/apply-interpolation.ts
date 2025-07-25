export function applyInterpolation(text: string, variables?: Record<string, string | number>) {
  if (!variables) return text;
  return text.replace(/\$\{([^}]+)\}/g, (_, varName) => {
    const trimmed = varName.trim();
    return variables[trimmed] !== undefined ? String(variables[trimmed]) : '';
  });
}
