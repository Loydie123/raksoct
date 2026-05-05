import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { importService } from '../api/services';
import { QUERY_KEYS } from '../constants';
import { REFETCH_INTERVALS } from '../lib';
import { getApiErrorMessage } from '../utils';

export function useImportLogs() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.IMPORT_LOGS],
    queryFn: () => importService.getLogs(),
    refetchInterval: REFETCH_INTERVALS.FAST,
  });

  return {
    logs: data?.data || [],
    loading: isLoading,
    total: data?.total || 0,
    refetch,
  };
}

export function useUploadImport() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => importService.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.IMPORT_LOGS] });
    },
  });

  return {
    upload: mutation.mutateAsync,
    uploading: mutation.isPending,
    error: mutation.error ? getApiErrorMessage(mutation.error) : '',
    success: mutation.isSuccess ? 'File uploaded successfully! Processing started.' : '',
    reset: mutation.reset,
  };
}
