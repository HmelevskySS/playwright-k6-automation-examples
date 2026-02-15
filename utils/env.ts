export function getBooleanEnv(name: string, fallback: boolean): boolean {
  const rawValue = process.env[name];

  if (rawValue === undefined) {
    return fallback;
  }

  const normalizedValue = rawValue.trim().toLowerCase();

  if (['1', 'true', 'yes', 'on'].includes(normalizedValue)) {
    return true;
  }

  if (['0', 'false', 'no', 'off'].includes(normalizedValue)) {
    return false;
  }

  return fallback;
}
