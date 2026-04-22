import { useRef } from 'react'

export function useParallax() {
  const ref = useRef<HTMLElement>(null)
  return { ref }
}
