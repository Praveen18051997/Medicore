import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Edit2, Trash2, Check, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { addAppointment, updateAppointment, deleteAppointment, cancelAppointment, completeAppointment } from './appointmentSlice';
import DataTable from '../../components/table/DataTable';
import { Button, Modal, Input, Select, Badge, Avatar, ConfirmDialog } from '../../components/ui';
import { formatDate } from '../../utils/helpers';

const schema = yup.object({
  patientName: yup.string().required('Patient name is required'),
  doctorName: yup.string().required('Doctor name is required'),
  department: yup.string().required('Department is required'),
  date: yup.string().required('Date is required'),
  time: yup.string().required('Time is required'),
  reason: yup.string().required('Reason is required'),
});

export default function AppointmentListPage() {
  const dispatch = useDispatch();
  const appointments = useSelector((s) => s.appointments.items);
  const doctors = useSelector((s) => s.doctors.items);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApt, setEditingApt] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const openAdd = () => { setEditingApt(null); reset({ patientName: '', doctorName: '', department: '', date: '', time: '', reason: '', notes: '' }); setModalOpen(true); };
  const openEdit = (a) => { setEditingApt(a); reset(a); setModalOpen(true); };

  const onSubmit = (data) => {
    if (editingApt) {
      dispatch(updateAppointment({ ...editingApt, ...data }));
      toast.success('Appointment updated');
    } else {
      dispatch(addAppointment({ ...data, status: 'Scheduled', patientId: 'PAT-NEW', doctorId: 'DOC-NEW' }));
      toast.success('Appointment scheduled');
    }
    setModalOpen(false);
  };

  const filtered = appointments.filter((a) => !filterStatus || a.status === filterStatus);

  const columns = [
    { accessorKey: 'id', header: 'ID', width: '110px' },
    { accessorKey: 'patientName', header: 'Patient', cell: (row) => (
      <div className="flex items-center gap-2"><Avatar name={row.patientName} size="sm" /><span className="font-medium text-surface-900 dark:text-surface-100">{row.patientName}</span></div>
    )},
    { accessorKey: 'doctorName', header: 'Doctor' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'date', header: 'Date', cell: (row) => formatDate(row.date) },
    { accessorKey: 'time', header: 'Time', width: '80px' },
    { accessorKey: 'reason', header: 'Reason' },
    { accessorKey: 'status', header: 'Status', cell: (row) => <Badge>{row.status}</Badge> },
    { id: 'actions', header: 'Actions', sortable: false, cell: (row) => (
      <div className="flex items-center gap-1">
        {row.status === 'Scheduled' && (
          <>
            <button onClick={(e) => { e.stopPropagation(); dispatch(completeAppointment(row.id)); toast.success('Marked completed'); }} className="p-1.5 rounded-lg hover:bg-accent-50 dark:hover:bg-accent-950/30 text-accent-500" title="Complete"><Check className="w-4 h-4" /></button>
            <button onClick={(e) => { e.stopPropagation(); dispatch(cancelAppointment(row.id)); toast.success('Cancelled'); }} className="p-1.5 rounded-lg hover:bg-warning-50 dark:hover:bg-warning-950/30 text-warning-500" title="Cancel"><XCircle className="w-4 h-4" /></button>
          </>
        )}
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
        searchPlaceholder="Search appointments..."
        actions={<Button icon={Plus} size="sm" onClick={openAdd}>New Appointment</Button>}
        filters={
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-surface-100 dark:bg-surface-800 rounded-xl px-3 py-2 text-sm border-none focus:ring-1 focus:ring-primary-500">
            <option value="">All Status</option>
            {['Scheduled', 'Completed', 'Cancelled', 'In Progress'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        }
      />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingApt ? 'Edit Appointment' : 'Schedule Appointment'} size="lg"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)}>{editingApt ? 'Update' : 'Schedule'}</Button></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Patient Name" error={errors.patientName?.message} {...register('patientName')} />
          <Select label="Doctor" options={doctors.map((d) => ({ value: d.name, label: `${d.name} — ${d.specialization}` }))} error={errors.doctorName?.message} {...register('doctorName')} />
          <Input label="Department" error={errors.department?.message} {...register('department')} />
          <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
          <Input label="Time" type="time" error={errors.time?.message} {...register('time')} />
          <Input label="Reason" error={errors.reason?.message} {...register('reason')} />
          <div className="md:col-span-2"><Input label="Notes (optional)" {...register('notes')} /></div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { dispatch(deleteAppointment(deleteTarget)); toast.success('Deleted'); }} title="Delete Appointment" message="Are you sure?" confirmText="Delete" danger />
    </div>
  );
}
