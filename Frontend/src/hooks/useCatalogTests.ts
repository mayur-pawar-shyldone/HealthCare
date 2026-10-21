import { useQuery } from '@tanstack/react-query'
import api, { unwrap } from '@/services/api'
import type { LabTest } from '@/types'

export function useCatalogTests() {
  return useQuery({
    queryKey: ['tests', 'catalog'],
    queryFn: async () => {
      const [packages, all] = await Promise.all([
        unwrap<LabTest[]>((await api.get('/tests', { params: { packages: 'true' } })).data),
        unwrap<LabTest[]>((await api.get('/tests')).data),
      ])
      const merged = [...packages]
      for (const row of all) {
        if (!merged.some((item) => item.id === row.id)) merged.push(row)
      }
      return merged
    },
    staleTime: 60_000,
  })
}
