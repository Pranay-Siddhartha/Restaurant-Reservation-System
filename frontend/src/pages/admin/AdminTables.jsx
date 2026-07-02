import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiUserGroup,
  HiTable,
} from 'react-icons/hi';
import {
  useTables,
  useCreateTable,
  useUpdateTable,
  useDeleteTable,
} from '../../hooks/useTables';
import Modal from '../../components/Modal';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';

const tableSchema = z.object({
  tableNumber: z
    .number({ invalid_type_error: 'Table number is required' })
    .min(1, 'Table number must be at least 1'),
  capacity: z
    .number({ invalid_type_error: 'Capacity is required' })
    .min(1, 'Capacity must be at least 1')
    .max(50, 'Maximum capacity is 50'),
  isActive: z.boolean(),
});

export default function AdminTables() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading } = useTables();
  const createTable = useCreateTable();
  const updateTable = useUpdateTable();
  const deleteTable = useDeleteTable();

  const tables = useMemo(() => {
    if (!data) return [];
    return data.tables || data.data || data || [];
  }, [data]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      tableNumber: undefined,
      capacity: undefined,
      isActive: true,
    },
  });

  const openCreateModal = () => {
    setEditTable(null);
    reset({ tableNumber: undefined, capacity: undefined, isActive: true });
    setModalOpen(true);
  };

  const openEditModal = (table) => {
    setEditTable(table);
    reset({
      tableNumber: table.tableNumber,
      capacity: table.capacity,
      isActive: table.isActive !== false,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTable(null);
    reset();
  };

  const onSubmit = async (formData) => {
    try {
      if (editTable) {
        await updateTable.mutateAsync({
          id: editTable._id || editTable.id,
          data: formData,
        });
      } else {
        await createTable.mutateAsync(formData);
      }
      closeModal();
    } catch {
      // Error handled by hook
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTable.mutateAsync(deleteTarget._id || deleteTarget.id);
    } catch {
      // Error handled by hook
    }
    setDeleteTarget(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton variant="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tables</h1>
          <p className="mt-1 text-gray-500">
            Manage your restaurant tables.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn-primary gap-2">
          <HiPlus className="w-5 h-5" />
          Add Table
        </button>
      </div>

      {/* Table grid */}
      {tables.length === 0 ? (
        <EmptyState
          icon={HiTable}
          title="No tables yet"
          description="Add your first table to start accepting reservations."
          actionLabel="Add Table"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <div
              key={table._id || table.id}
              className="glass p-6 hover:shadow-glass-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-600">
                      #{table.tableNumber}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Table {table.tableNumber}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${
                        table.isActive !== false
                          ? 'text-emerald-600'
                          : 'text-gray-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          table.isActive !== false
                            ? 'bg-emerald-500'
                            : 'bg-gray-300'
                        }`}
                      />
                      {table.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <HiUserGroup className="w-4 h-4" />
                <span>Capacity: {table.capacity} guests</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(table)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  <HiPencil className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(table)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <HiTrash className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-md backdrop-blur-xl bg-white/90 border border-white/30 shadow-glass-lg rounded-2xl animate-slide-up">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {editTable ? 'Edit Table' : 'Add New Table'}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="label">Table Number</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="e.g. 1"
                    {...register('tableNumber', { valueAsNumber: true })}
                    className={`input-field ${
                      errors.tableNumber ? 'input-error' : ''
                    }`}
                  />
                  {errors.tableNumber && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.tableNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    placeholder="e.g. 4"
                    {...register('capacity', { valueAsNumber: true })}
                    className={`input-field ${
                      errors.capacity ? 'input-error' : ''
                    }`}
                  />
                  {errors.capacity && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.capacity.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register('isActive')}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="isActive"
                    className="text-sm font-medium text-gray-700"
                  >
                    Active (available for reservations)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      createTable.isPending ||
                      updateTable.isPending
                    }
                    className="btn-primary"
                  >
                    {isSubmitting ||
                    createTable.isPending ||
                    updateTable.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : editTable ? (
                      'Update Table'
                    ) : (
                      'Create Table'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Table"
        onConfirm={handleDelete}
        confirmText="Yes, Delete"
        confirmVariant="danger"
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold">
            Table #{deleteTarget?.tableNumber}
          </span>
          ? This may affect existing reservations assigned to this table.
        </p>
      </Modal>
    </div>
  );
}
