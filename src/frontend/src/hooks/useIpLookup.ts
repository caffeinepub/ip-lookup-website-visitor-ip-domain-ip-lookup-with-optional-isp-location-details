import { useMutation } from '@tanstack/react-query';
import { fetchIpInfo } from '@/lib/ipLookup';

export function useIpLookup(includeDetails: boolean) {
  return useMutation({
    mutationFn: async (input: string) => {
      return await fetchIpInfo(input, includeDetails);
    },
    retry: 1,
  });
}
