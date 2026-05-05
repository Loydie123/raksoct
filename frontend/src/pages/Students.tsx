import { useState } from 'react';
import { Button, Modal, Pagination } from '../components/ui';
import { StudentForm, StudentTable, StudentFilters } from '../components/students';
import { useStudents, useStudentMutations } from '../hooks';
import type { Student } from '../types';
import type { StudentFormData } from '../components/students/StudentForm';

export default function Students() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { students, loading, totalPages } = useStudents({
    search,
    status: statusFilter,
    page: currentPage,
  });

  const { createStudent, updateStudent, deleteStudent } = useStudentMutations();

  const handleFilter = (newSearch: string, newStatus: string) => {
    setSearch(newSearch);
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleSubmit = async (data: StudentFormData) => {
    if (editingStudent) {
      await updateStudent(editingStudent.id, data);
    } else {
      await createStudent(data);
    }
    setShowModal(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    await deleteStudent(id);
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <Button onClick={openAddModal} className="mt-3 sm:mt-0">
          Add Student
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <StudentFilters onFilter={handleFilter} />
        
        <StudentTable
          students={students}
          loading={loading}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingStudent ? 'Edit Student' : 'Add Student'}
      >
        <StudentForm
          initialData={editingStudent || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  );
}
