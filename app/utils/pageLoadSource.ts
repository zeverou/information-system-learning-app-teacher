import { useRuntimeConfig } from '#app'

export type PageLoadSource = 'system' | 'directory'

export function normalizePageLoadSource(value: unknown): PageLoadSource {
  return String(value ?? 'system').trim().toLowerCase() === 'directory' ? 'directory' : 'system'
}

export function getPageLoadSource(): PageLoadSource {
  const config = useRuntimeConfig()
  return normalizePageLoadSource(config.public.loadPagesFrom)
}
