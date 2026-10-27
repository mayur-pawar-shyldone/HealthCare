import { useQuery } from '@tanstack/react-query';
import api, { unwrap } from '@/services/api';
import { enrichPackages } from '@/lib/packages';
export function useHealthPackages() {
    return useQuery({
        queryKey: ['tests', 'packages'],
        queryFn: async () => {
            const data = unwrap((await api.get('/tests', { params: { packages: 'true' } })).data);
            return enrichPackages(data);
        },
        staleTime: 0,
        refetchOnMount: 'always',
    });
}
