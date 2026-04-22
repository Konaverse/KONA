import { useRef } from 'react'

export function useTextReveal() {
  const ref = useRef<HTMLElement>(null)
  return { ref }
}
