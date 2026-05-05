import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceRequestService } from '../api/services';
import type { ServiceRequestFilters, CreateServiceRequestPayload } from '../api/services';
import { QUERY_KEYS } from '../constants';

export function useServiceRequests(filters: ServiceRequestFilters = {}) {
  const queryKey = [QUERY_KEYS.SERVICE_REQUESTS, filters];

  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => serviceRequestService.getAll(filters),
  });

  return {
    requests: data?.data || [],
    loading: isLoading,
    totalPages: data?.last_page || 1,
    currentPage: data?.current_page || 1,
    total: data?.total || 0,
    refetch,
  };
}

export function useServiceRequestMutations() {
  const queryClient = useQueryClient();

  const invalidateRequests = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICE_REQUESTS] });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateServiceRequestPayload) => serviceRequestService.create(data),
    onSuccess: invalidateRequests,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, remarks }: { id: number; remarks?: string }) =>
      serviceRequestService.approve(id, remarks),
    onSuccess: invalidateRequests,
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, remarks }: { id: number; remarks: string }) =>
      serviceRequestService.reject(id, remarks),
    onSuccess: invalidateRequests,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => serviceRequestService.delete(id),
    onSuccess: invalidateRequests,
  });

  return {
    createRequest: createMutation.mutateAsync,
    approveRequest: (id: number, remarks?: string) =>
      approveMutation.mutateAsync({ id, remarks }),
    rejectRequest: (id: number, remarks: string) =>
      rejectMutation.mutateAsync({ id, remarks }),
    deleteRequest: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
