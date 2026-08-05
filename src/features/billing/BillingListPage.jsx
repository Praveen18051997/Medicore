import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Eye, Trash2, DollarSign, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { addInvoice, deleteInvoice, markAsPaid } from './billingSlice';
import DataTable from '../../components/table/DataTable';
import { Button, Modal, Input, Badge, ConfirmDialog } from '../../components/ui';
import { formatCurrency, formatDate } from '../../utils/helpers';

const schema = yup.object({
  patientName: yup.string().required('Patient name is required'),
  consultation: yup.number().typeError('Number').min(0).required('Required'),
});

export default function BillingListPage() {
  const dispatch = useDispatch();
  const invoices = useSelector((s) => s.billing.items);
  const [filterStatus, setFilterStatus] = useState('');
  const [viewInvoice, setViewInvoice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const filtered = invoices.filter((i) => !filterStatus || i.status === filterStatus);

  const totalRevenue = invoices.reduce((s, i) => s + (i.status === 'Paid' ? i.total : 0), 0);
  const totalPending = invoices.reduce((s, i) => s + (i.status === 'Pending' ? i.total : 0), 0);
  const totalOverdue = invoices.reduce((s, i) => s + (i.status === 'Overdue' ? i.total : 0), 0);

  const openAdd = () => { reset({ patientName: '', consultation: 100, labTests: 0, pharmacy: 0, roomCharges: 0 }); setModalOpen(true); };

  const onSubmit = (data) => {
    const items = [{ description: 'Consultation Fee', amount: Number(data.consultation) }];
    if (data.labTests > 0) items.push({ description: 'Lab Tests', amount: Number(data.labTests) });
    if (data.pharmacy > 0) items.push({ description: 'Pharmacy', amount: Number(data.pharmacy) });
    if (data.roomCharges > 0) items.push({ description: 'Room Charges', amount: Number(data.roomCharges) });
    const subtotal = items.reduce((s, i) => s + i.amount, 0);
    const tax = Math.round(subtotal * 0.08);
    dispatch(addInvoice({
      patientName: data.patientName, patientId: 'PAT-NEW', date: new Date().toISOString().split('T')[0],
      status: 'Pending', items, subtotal, tax, discount: 0, total: subtotal + tax,
      paymentMethod: 'Pending', insuranceClaim: false,
    }));
    toast.success('Invoice created');
    setModalOpen(false);
  };

  const columns = [
    { accessorKey: 'id', header: 'Invoice', width: '110px' },
    { accessorKey: 'patientName', header: 'Patient' },
    { accessorKey: 'date', header: 'Date', cell: (row) => formatDate(row.date) },
    { accessorKey: 'total', header: 'Amount', cell: (row) => <span className="font-semibold">{formatCurrency(row.total)}</span> },
    { accessorKey: 'paymentMethod', header: 'Payment' },
    { accessorKey: 'status', header: 'Status', cell: (row) => <Badge>{row.status}</Badge> },
    { id: 'actions', header: 'Actions', sortable: false, cell: (row) => (
      <div className="flex items-center gap-1">
        <button onClick={(e) => { e.stopPropagation(); setViewInvoice(row); }} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500"><Eye className="w-4 h-4" /></button>
        {row.status !== 'Paid' && (
          <button onClick={(e) => { e.stopPropagation(); dispatch(markAsPaid(row.id)); toast.success('Marked as paid'); }} className="p-1.5 rounded-lg hover:bg-accent-50 dark:hover:bg-accent-950/30 text-accent-500" title="Mark Paid"><DollarSign className="w-4 h-4" /></button>
        )}
        <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(row.id); }} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 text-danger-500"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-950/30' },
          { label: 'Pending', value: formatCurrency(totalPending), color: 'text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-950/30' },
          { label: 'Overdue', value: formatCurrency(totalOverdue), color: 'text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-950/30' },
        ].map((s) => (
          <div key={s.label} className={`${s.color.split(' ').slice(2).join(' ')} rounded-2xl p-5`}>
            <p className="text-sm text-surface-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color.split(' ').slice(0, 2).join(' ')}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchPlaceholder="Search invoices..."
        actions={<Button icon={Plus} size="sm" onClick={openAdd}>New Invoice</Button>}
        filters={
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-surface-100 dark:bg-surface-800 rounded-xl px-3 py-2 text-sm border-none focus:ring-1 focus:ring-primary-500">
            <option value="">All Status</option>
            {['Paid', 'Pending', 'Overdue'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        }
      />

      {/* Create Invoice Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Invoice" size="md"
        footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSubmit(onSubmit)}>Create</Button></>}
      >
        <div className="space-y-4">
          <Input label="Patient Name" error={errors.patientName?.message} {...register('patientName')} />
          <Input label="Consultation Fee ($)" type="number" error={errors.consultation?.message} {...register('consultation')} />
          <Input label="Lab Tests ($)" type="number" {...register('labTests')} />
          <Input label="Pharmacy ($)" type="number" {...register('pharmacy')} />
          <Input label="Room Charges ($)" type="number" {...register('roomCharges')} />
        </div>
      </Modal>

      {/* View Invoice Modal */}
      <Modal isOpen={!!viewInvoice} onClose={() => setViewInvoice(null)} title={`Invoice ${viewInvoice?.id}`} size="md"
        footer={<Button variant="secondary" icon={Printer} onClick={() => window.print()}>Print</Button>}
      >
        {viewInvoice && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-surface-500">Patient</p>
                <p className="font-semibold text-surface-900 dark:text-surface-100">{viewInvoice.patientName}</p>
              </div>
              <Badge>{viewInvoice.status}</Badge>
            </div>
            <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
              {viewInvoice.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2 text-sm">
                  <span className="text-surface-600 dark:text-surface-400">{item.description}</span>
                  <span className="font-medium text-surface-900 dark:text-surface-100">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <hr className="my-2 border-surface-200 dark:border-surface-700" />
              <div className="flex justify-between py-1 text-sm"><span>Subtotal</span><span>{formatCurrency(viewInvoice.subtotal)}</span></div>
              <div className="flex justify-between py-1 text-sm"><span>Tax (8%)</span><span>{formatCurrency(viewInvoice.tax)}</span></div>
              {viewInvoice.discount > 0 && <div className="flex justify-between py-1 text-sm text-accent-600"><span>Discount</span><span>-{formatCurrency(viewInvoice.discount)}</span></div>}
              <hr className="my-2 border-surface-200 dark:border-surface-700" />
              <div className="flex justify-between py-1 text-base font-bold"><span>Total</span><span>{formatCurrency(viewInvoice.total)}</span></div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { dispatch(deleteInvoice(deleteTarget)); toast.success('Invoice deleted'); }} title="Delete Invoice" message="Are you sure?" confirmText="Delete" danger />
    </div>
  );
}
