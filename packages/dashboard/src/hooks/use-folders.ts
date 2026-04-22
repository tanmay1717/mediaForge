import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import type { Folder, FolderTreeNode, CreateFolderRequest } from '@media-forge/core';

/** TODO: Folder CRUD + tree queries */
export function useFolders(parentFolderId?: string) {
  return useQuery({
    queryKey: ['folders', parentFolderId],
    queryFn: () => api.get<Folder[]>('/v1/folders', { params: { parentFolderId } }).then(r => r.data),
    enabled: !!parentFolderId,
  });
}

export function useCreateFolder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFolderRequest) => api.post('/v1/folders', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['folders'] }),
  });
}
