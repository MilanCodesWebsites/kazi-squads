import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNaira(value: number | null | undefined) {
  const amount = typeof value === 'number' && Number.isFinite(value) ? value : null
  if (amount === null) return '₦0'

  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `₦${amount.toLocaleString()}`
  }
}

export function formatRelativeTime(date: string | Date | null | undefined) {
  if (!date) return ''
  const dt = typeof date === 'string' ? new Date(date) : date
  const diffMs = Date.now() - dt.getTime()
  const diffMin = Math.floor(diffMs / (1000 * 60))

  if (!Number.isFinite(diffMin)) return ''
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`

  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`

  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay}d ago`

  const diffWk = Math.floor(diffDay / 7)
  return `${diffWk}w ago`
}
