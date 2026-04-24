import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';

export function useApiKeys() {
  return useQuery({ queryKey: ['apiKeys'], queryFn: () => api.get('/v1/api-keys').then(r => r.data) });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (label: string) => api.post('/v1/api-keys', { label }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['apiKeys'] }),
  });
}
