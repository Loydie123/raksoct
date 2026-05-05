import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService } from '../api/services';
import type { StudentFilters, CreateStudentPayload, UpdateStudentPayload } from '../api/services';
import { QUERY_KEYS } from '../constants';

export function useStudents(filters: StudentFilters = {}) {
  const queryKey = [QUERY_KEYS.STUDENTS, filters];

  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => studentService.getAll(filters),
  });

  return {
    students: data?.data || [],
    loading: isLoading,
    totalPages: data?.last_page || 1,
    currentPage: data?.current_page || 1,
    total: data?.total || 0,
    refetch,
  };
}

export function useStudent(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDENTS, id],
    queryFn: () => studentService.getById(id),
    enabled: !!id,
  });
}

export function useStudentMutations() {
  const queryClient = useQueryClient();

  const invalidateStudents = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDENTS] });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateStudentPayload) => studentService.create(data),
    onSuccess: invalidateStudents,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentPayload }) =>
      studentService.update(id, data),
    onSuccess: invalidateStudents,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => studentService.delete(id),
    onSuccess: invalidateStudents,
  });

  return {
    createStudent: createMutation.mutateAsync,
    updateStudent: (id: number, data: UpdateStudentPayload) =>
      updateMutation.mutateAsync({ id, data }),
    deleteStudent: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
