import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function replaceTokens(template: string, contact: {
  firstName?: string | null
  lastName?: string | null
  email?: string | null
  city?: string | null
  phoneNumber?: string
  customValues?: Array<{ customField: { name: string }, value: string | null }>
}): string {
  const fallback = (value: string | null | undefined, fb: string) => value || fb

  return template
    .replace(/\{firstName\|([^}]+)\}/g, (_, fb) => fallback(contact.firstName, fb))
    .replace(/\{firstName\}/g, fallback(contact.firstName, 'there'))
    .replace(/\{lastName\|([^}]+)\}/g, (_, fb) => fallback(contact.lastName, fb))
    .replace(/\{lastName\}/g, fallback(contact.lastName, ''))
    .replace(/\{fullName\}/g, [contact.firstName, contact.lastName].filter(Boolean).join(' ') || 'there')
    .replace(/\{city\}/g, fallback(contact.city, ''))
    .replace(/\{phone\}/g, contact.phoneNumber || '')
    .replace(/\{custom1\}/g, contact.customValues?.find(v => v.customField.name === 'custom1')?.value || '')
    .replace(/\{custom2\}/g, contact.customValues?.find(v => v.customField.name === 'custom2')?.value || '')
}
