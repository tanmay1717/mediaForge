import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import type { Asset, AssetSummary, PaginatedResponse, ListAssetsQuery } from '@media-forge/core';

/** TODO: Implement all CRUD operations with React Query
 * - useAssets: list with pagination + filters
 * - useAsset: single asset by ID
 * - useCreateAsset: upload mutation
 * - useUpdateAsset: partial update mutation
 * - useDeleteAsset: soft-delete mutation
 * - All mutations should invalidate relevant queries on success
 */
export function useAssets(query: ListAssetsQuery = {}) {
  return useQuery({
    queryKey: ['assets', query],
    queryFn: () => api.get<PaginatedResponse<AssetSummary>>('/v1/assets', { params: query }).then(r => r.data),
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: () => api.get<Asset>(`/v1/assets/${id}`).then(r => r.data),
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
