import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';

export function useAssets(query: Record<string, string> = {}) {
  return useQuery({
    queryKey: ['assets', query],
    queryFn: () => api.get('/v1/assets', { params: query }).then(r => r.data),
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: () => api.get(`/v1/assets/${id}`).then(r => r.data),
    enabled: !!id,
  });
}

export function useDeleteAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/v1/assets/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['assets'] }),
  });
}
