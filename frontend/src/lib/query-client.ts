import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const STALE_TIMES = {
  SHORT: 1000 * 30, // 30 seconds
  MEDIUM: 1000 * 60, // 1 minute
  LONG: 1000 * 60 * 5, // 5 minutes
} as const;

export const REFETCH_INTERVALS = {
  FAST: 1000 * 5, // 5 seconds
  MEDIUM: 1000 * 15, // 15 seconds
  SLOW: 1000 * 60, // 1 minute
} as const;
