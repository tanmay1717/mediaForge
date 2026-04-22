import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';
import type { UsageStats } from '@media-forge/core';

export function useStats() {
  return useQuery({ queryKey: ['stats'], queryFn: () => api.get<UsageStats>('/v1/stats').then(r => r.data) });
}
