import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { addPatient, updatePatient, deletePatient } from './patientSlice';
import DataTable from '../../components/table/DataTable';
import { Button, Modal, Input, Select, Badge, Avatar, ConfirmDialog } from '../../components/ui';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().typeError('Must be a number').positive().integer().required('Age is required'),
  gender: yup.string().required('Gender is required'),
  phone: yup.string().required('Phone is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  bloodGroup: yup.string().required('Blood group is required'),
  condition: yup.string().required('Condition is required'),
  status: yup.string().required('Status is required'),
});

export default function PatientListPage() {
  const dispatch = useDispatch();
  const patients = useSelector((s) => s.patients.items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewPatient, setViewPatient] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterGender, setFilterGender] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const openAdd = () => { setEditingPatient(null); reset({ name: '', age: '', gender: '', phone: '', email: '', bloodGroup: '', condition: '', status: 'Active' }); setModalOpen(true); };
  const openEdit = (p) => { setEditingPatient(p); reset(p); setModalOpen(true); };

  const onSubmit = (data) => {
    if (editingPatient) {
      dispatch(updatePatient({ ...editingPatient, ...data }));
      toast.success('Patient updated');
    } else {
      dispatch(addPatient({ ...data, admitDate: new Date().toISOString().split('T')[0], address: '', insuranceProvider: 'N/A', insuranceId: 'N/A' }));
      toast.success('Patient added');
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => { dispatch(deletePatient(id)); toast.success('Patient deleted'); };

  const filtered = patients.filter((p) => (!filterStatus || p.status === filterStatus) && (!filterGender || p.gender === filterGender));

  const columns = [
    { accessorKey: 'id', header: 'ID', width: '100px' },
    { accessorKey: 'name', header: 'Name', cell: (row) => (
      <div className="flex items-center gap-2">
        <Avatar name={row.name} size="sm" />
        <div>
          <p className="font-medium text-surface-900 dark:text-surface-100">{row.name}</p>
          <p className="text-xs text-surface-500">{row.email}</p>
        </div>
      </div>
    )},
    { accessorKey: 'age', header: 'Age', width: '70px' },
    { accessorKey: 'gender', header: 'Gender', width: '90px' },
    { accessorKey: 'phone', header: 'Phone' },
    { accessorKey: 'bloodGroup', header: 'Blood', width: '80px', cell: (row) => <span className="font-semibold text-danger-600 dark:text-danger-400">{row.bloodGroup}</span> },
    { accessorKey: 'condition', header: 'Condition' },
    { accessorKey: 'status', header: 'Status', cell: (row) => <Badge>{row.status}</Badge> },
    { id: 'actions', header: 'Actions', sortable: false, cell: (row) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setViewPatient(row); }} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500"><Eye className="w-4 h-4" /></button>
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
        searchPlaceholder="Search patients..."
        actions={<Button icon={Plus} size="sm" onClick={openAdd}>Add Patient</Button>}
        filters={
          <div className="flex gap-2">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-surface-100 dark:bg-surface-800 rounded-xl px-3 py-2 text-sm border-none focus:ring-1 focus:ring-primary-500">
              <option value="">All Status</option>
              {['Active', 'Discharged', 'Critical', 'Recovering'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="bg-surface-100 dark:bg-surface-800 rounded-xl px-3 py-2 text-sm border-none focus:ring-1 focus:ring-primary-500">
              <option value="">All Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        }
      />

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingPatient ? 'Edit Patient' : 'Add New Patient'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)}>{editingPatient ? 'Update' : 'Add'}</Button></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" error={errors.name?.message} {...register('name')} />
          <Input label="Age" type="number" error={errors.age?.message} {...register('age')} />
          <Select label="Gender" options={['Male', 'Female']} error={errors.gender?.message} {...register('gender')} />
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Select label="Blood Group" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} error={errors.bloodGroup?.message} {...register('bloodGroup')} />
          <Input label="Condition" error={errors.condition?.message} {...register('condition')} />
          <Select label="Status" options={['Active', 'Discharged', 'Critical', 'Recovering']} error={errors.status?.message} {...register('status')} />
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewPatient} onClose={() => setViewPatient(null)} title="Patient Details" size="lg">
        {viewPatient && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <Avatar name={viewPatient.name} size="xl" />
              <div>
                <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">{viewPatient.name}</h3>
                <p className="text-sm text-surface-500">{viewPatient.id}</p>
                <Badge>{viewPatient.status}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Age', viewPatient.age], ['Gender', viewPatient.gender], ['Blood Group', viewPatient.bloodGroup],
                ['Phone', viewPatient.phone], ['Email', viewPatient.email], ['Condition', viewPatient.condition],
                ['Admit Date', viewPatient.admitDate], ['Room', viewPatient.room || 'N/A'],
                ['Insurance', viewPatient.insuranceProvider], ['Insurance ID', viewPatient.insuranceId],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-surface-500 text-xs mb-0.5">{label}</p>
                  <p className="font-medium text-surface-900 dark:text-surface-100">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget)} title="Delete Patient" message="Are you sure you want to delete this patient record? This action cannot be undone." confirmText="Delete" danger />
    </div>
  );
}
