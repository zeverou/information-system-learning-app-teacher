import { useRuntimeConfig } from '#app'

export type ComponentLoadSource = 'system' | 'directory'

export function normalizeComponentLoadSource(value: unknown): ComponentLoadSource {
  return String(value ?? 'system').trim().toLowerCase() === 'directory' ? 'directory' : 'system'
}

export function getComponentLoadSource(): ComponentLoadSource {
  const config = useRuntimeConfig()
  return normalizeComponentLoadSource(config.public.loadComponentsFrom)
}
