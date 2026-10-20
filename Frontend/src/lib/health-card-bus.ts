type Listener = () => void

const listeners = new Set<Listener>()

export function openHealthCard() {
  listeners.forEach((fn) => fn())
}

export function subscribeHealthCard(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
