import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { addMedicine, updateMedicine, deleteMedicine } from './pharmacySlice';
import DataTable from '../../components/table/DataTable';
import { Button, Modal, Input, Select, Badge, ConfirmDialog } from '../../components/ui';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { medicineCategories } from '../../utils/mockData';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  category: yup.string().required('Category is required'),
  price: yup.number().typeError('Must be a number').positive().required('Price is required'),
  stock: yup.number().typeError('Must be a number').min(0).required('Stock is required'),
  manufacturer: yup.string().required('Manufacturer is required'),
  expiryDate: yup.string().required('Expiry date is required'),
});

export default function PharmacyPage() {
  const dispatch = useDispatch();
  const medicines = useSelector((s) => s.pharmacy.items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const openAdd = () => { setEditingMed(null); reset({ name: '', category: '', price: '', stock: '', manufacturer: '', expiryDate: '' }); setModalOpen(true); };
  const openEdit = (m) => { setEditingMed(m); reset(m); setModalOpen(true); };

  const onSubmit = (data) => {
    const med = { ...data, lowStockThreshold: 50, isLowStock: data.stock < 50, batchNumber: `BTH-${Date.now()}` };
    if (editingMed) {
      dispatch(updateMedicine({ ...editingMed, ...med }));
      toast.success('Medicine updated');
    } else {
      dispatch(addMedicine(med));
      toast.success('Medicine added');
    }
    setModalOpen(false);
  };

  const filtered = medicines.filter((m) => (!filterCategory || m.category === filterCategory) && (!showLowStock || m.isLowStock));

  const columns = [
    { accessorKey: 'id', header: 'ID', width: '90px' },
    { accessorKey: 'name', header: 'Medicine', cell: (row) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-surface-900 dark:text-surface-100">{row.name}</span>
        {row.isLowStock && <AlertTriangle className="w-4 h-4 text-warning-500" />}
      </div>
    )},
    { accessorKey: 'category', header: 'Category', cell: (row) => <Badge variant="info">{row.category}</Badge> },
    { accessorKey: 'stock', header: 'Stock', cell: (row) => (
      <span className={`font-semibold ${row.isLowStock ? 'text-danger-600 dark:text-danger-400' : 'text-surface-900 dark:text-surface-100'}`}>
        {row.stock}
      </span>
    )},
    { accessorKey: 'price', header: 'Price', cell: (row) => formatCurrency(row.price) },
    { accessorKey: 'manufacturer', header: 'Manufacturer' },
    { accessorKey: 'expiryDate', header: 'Expiry', cell: (row) => formatDate(row.expiryDate) },
    { id: 'actions', header: 'Actions', sortable: false, cell: (row) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); openEdit(row); }} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-primary-500"><Edit2 className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row.id); }} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-danger-500"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search medicines..."
        actions={<Button icon={Plus} size="sm" onClick={openAdd}>Add Medicine</Button>}
        filters={
          <div className="flex gap-2 items-center">
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-surface-100 dark:bg-surface-800 rounded-xl px-3 py-2 text-sm border-none focus:ring-1 focus:ring-primary-500">
              <option value="">All Categories</option>
              {medicineCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 cursor-pointer">
              <input type="checkbox" checked={showLowStock} onChange={(e) => setShowLowStock(e.target.checked)} className="rounded border-surface-300 text-warning-500 focus:ring-warning-500" />
              Low Stock Only
            </label>
          </div>
        }
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingMed ? 'Edit Medicine' : 'Add Medicine'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)}>{editingMed ? 'Update' : 'Add'}</Button></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Medicine Name" error={errors.name?.message} {...register('name')} />
          <Select label="Category" options={medicineCategories} error={errors.category?.message} {...register('category')} />
          <Input label="Price ($)" type="number" step="0.01" error={errors.price?.message} {...register('price')} />
          <Input label="Stock" type="number" error={errors.stock?.message} {...register('stock')} />
          <Input label="Manufacturer" error={errors.manufacturer?.message} {...register('manufacturer')} />
          <Input label="Expiry Date" type="date" error={errors.expiryDate?.message} {...register('expiryDate')} />
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { dispatch(deleteMedicine(deleteTarget)); toast.success('Medicine deleted'); }} title="Delete Medicine" message="Are you sure?" confirmText="Delete" danger />
    </div>
  );
}
