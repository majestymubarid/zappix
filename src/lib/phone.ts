// Phone number normalization utilities

export function normalizePhone(raw: string): string {
  // Remove all non-digit characters
  const digits = raw.replace(/\D/g, '')
  
  // Already formatted with +234
  if (digits.startsWith('234')) return '+' + digits
  
  // Starts with 0 (e.g., 08012345678)
  if (digits.startsWith('0')) return '+234' + digits.slice(1)
  
  // 10 digits without prefix (e.g., 8012345678)
  if (digits.length === 10) return '+234' + digits
  
  // Default: add + prefix
  return '+' + digits
}

export function validatePhone(phone: string): boolean {
  const normalized = normalizePhone(phone)
  // Nigerian numbers should be +234 followed by 10 digits
  return /^\+234\d{10}$/.test(normalized)
}

export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizePhone(phone)
  // Format as +234 801 234 5678
  if (normalized.startsWith('+234')) {
    const number = normalized.slice(4)
    return `+234 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`
  }
  return normalized
}
