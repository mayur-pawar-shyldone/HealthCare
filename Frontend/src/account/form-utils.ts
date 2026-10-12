export function readForm(form: HTMLFormElement): Record<string, string> {
  const out: Record<string, string> = {}
  new FormData(form).forEach((value, key) => {
    out[key] = String(value)
  })
  return out
}
