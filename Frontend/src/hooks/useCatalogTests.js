import { useQuery } from '@tanstack/react-query';
import api, { unwrap } from '@/services/api';
export function useCatalogTests() {
    return useQuery({
        queryKey: ['tests', 'catalog'],
        queryFn: async () => {
            const [packages, all] = await Promise.all([
                unwrap((await api.get('/tests', { params: { packages: 'true' } })).data),
                unwrap((await api.get('/tests')).data),
            ]);
            const merged = [...packages];
            for (const row of all) {
                if (!merged.some((item) => item.id === row.id))
                    merged.push(row);
            }
            return merged;
        },
        staleTime: 60_000,
    });
}
