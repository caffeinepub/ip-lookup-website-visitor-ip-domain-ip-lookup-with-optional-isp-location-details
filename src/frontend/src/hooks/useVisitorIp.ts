import { useQuery } from '@tanstack/react-query';
import { fetchIpInfo } from '@/lib/ipLookup';

export function useVisitorIp(includeDetails: boolean) {
  return useQuery({
    queryKey: ['visitor-ip', includeDetails],
    queryFn: async () => {
      return await fetchIpInfo(undefined, includeDetails);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
