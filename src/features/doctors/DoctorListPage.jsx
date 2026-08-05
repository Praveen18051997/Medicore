import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Edit2, Trash2, Eye, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { addDoctor, updateDoctor, deleteDoctor } from './doctorSlice';
import DataTable from '../../components/table/DataTable';
import { Button, Modal, Input, Select, Badge, Avatar, ConfirmDialog } from '../../components/ui';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  specialization: yup.string().required('Specialization is required'),
  department: yup.string().required('Department is required'),
  phone: yup.string().required('Phone is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  experience: yup.number().typeError('Must be a number').positive().required('Experience is required'),
  qualification: yup.string().required('Qualification is required'),
  status: yup.string().required('Status is required'),
});

export default function DoctorListPage() {
  const dispatch = useDispatch();
  const doctors = useSelector((s) => s.doctors.items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterDept, setFilterDept] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const openAdd = () => { setEditingDoctor(null); reset({ name: '', specialization: '', department: '', phone: '', email: '', experience: '', qualification: '', status: 'Available' }); setModalOpen(true); };
  const openEdit = (d) => { setEditingDoctor(d); reset(d); setModalOpen(true); };

  const onSubmit = (data) => {
    if (editingDoctor) {
      dispatch(updateDoctor({ ...editingDoctor, ...data }));
      toast.success('Doctor updated');
    } else {
      dispatch(addDoctor({ ...data, rating: 4.5, patientsHandled: 0, avatar: null, schedule: {} }));
      toast.success('Doctor added');
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => { dispatch(deleteDoctor(id)); toast.success('Doctor removed'); };

  const depts = [...new Set(doctors.map((d) => d.department))];
  const filtered = doctors.filter((d) => (!filterDept || d.department === filterDept) && (!filterStatus || d.status === filterStatus));

  const columns = [
    { accessorKey: 'id', header: 'ID', width: '100px' },
    { accessorKey: 'name', header: 'Doctor', cell: (row) => (
      <div className="flex items-center gap-2">
        <Avatar name={row.name} size="sm" />
        <div>
          <p className="font-medium text-surface-900 dark:text-surface-100">{row.name}</p>
          <p className="text-xs text-surface-500">{row.specialization}</p>
        </div>
      </div>
    )},
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'experience', header: 'Exp', width: '70px', cell: (row) => `${row.experience} yrs` },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'rating', header: 'Rating', cell: (row) => (
      <div className="flex items-center gap-1">
        <Star className="w-3.5 h-3.5 text-warning-400 fill-warning-400" />
        <span className="text-sm font-medium">{row.rating}</span>
      </div>
    )},
    { accessorKey: 'status', header: 'Status', cell: (row) => <Badge>{row.status}</Badge> },
    { id: 'actions', header: 'Actions', sortable: false, cell: (row) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setViewDoctor(row); }} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500"><Eye className="w-4 h-4" /></button>
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
        searchPlaceholder="Search doctors..."
        actions={<Button icon={Plus} size="sm" onClick={openAdd}>Add Doctor</Button>}
        filters={
          <div className="flex gap-2">
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="bg-surface-100 dark:bg-surface-800 rounded-xl px-3 py-2 text-sm border-none focus:ring-1 focus:ring-primary-500">
              <option value="">All Departments</option>
              {depts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-surface-100 dark:bg-surface-800 rounded-xl px-3 py-2 text-sm border-none focus:ring-1 focus:ring-primary-500">
              <option value="">All Status</option>
              {['Available', 'On Leave', 'In Surgery'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        }
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingDoctor ? 'Edit Doctor' : 'Add New Doctor'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)}>{editingDoctor ? 'Update' : 'Add'}</Button></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" error={errors.name?.message} {...register('name')} />
          <Input label="Specialization" error={errors.specialization?.message} {...register('specialization')} />
          <Input label="Department" error={errors.department?.message} {...register('department')} />
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Experience (years)" type="number" error={errors.experience?.message} {...register('experience')} />
          <Input label="Qualification" error={errors.qualification?.message} {...register('qualification')} className="md:col-span-2" />
          <Select label="Status" options={['Available', 'On Leave', 'In Surgery']} error={errors.status?.message} {...register('status')} />
        </div>
      </Modal>

      <Modal isOpen={!!viewDoctor} onClose={() => setViewDoctor(null)} title="Doctor Profile" size="lg">
        {viewDoctor && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={viewDoctor.name} size="xl" />
              <div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">{viewDoctor.name}</h3>
                <p className="text-sm text-surface-500">{viewDoctor.specialization} • {viewDoctor.department}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge>{viewDoctor.status}</Badge>
                  <div className="flex items-center gap-1 text-sm"><Star className="w-3.5 h-3.5 text-warning-400 fill-warning-400" /> {viewDoctor.rating}</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {[
                ['Experience', `${viewDoctor.experience} years`], ['Qualification', viewDoctor.qualification], ['Patients Handled', viewDoctor.patientsHandled?.toLocaleString()],
                ['Phone', viewDoctor.phone], ['Email', viewDoctor.email],
              ].map(([label, value]) => (
                <div key={label}><p className="text-surface-500 text-xs mb-0.5">{label}</p><p className="font-medium text-surface-900 dark:text-surface-100">{value}</p></div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget)} title="Remove Doctor" message="Are you sure you want to remove this doctor?" confirmText="Remove" danger />
    </div>
  );
}
