import { useRef } from 'react'

export function usePinSequence() {
  const ref = useRef<HTMLElement>(null)
  return { ref }
}
