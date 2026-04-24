import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';

export function useFolders(parentFolderId?: string) {
  return useQuery({
    queryKey: ['folders', parentFolderId],
    queryFn: () => api.get('/v1/folders', { params: { parentFolderId } }).then(r => r.data),
    enabled: !!parentFolderId,
  });
}

export function useCreateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; parentFolderId?: string }) => api.post('/v1/folders', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['folders'] }),
  });
}
