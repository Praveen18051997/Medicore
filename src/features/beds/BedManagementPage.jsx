import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BedDouble, User, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { releaseBed, setMaintenance, assignBed } from './bedSlice';
import { Badge, Modal, Button, Input } from '../../components/ui';

export default function BedManagementPage() {
  const dispatch = useDispatch();
  const beds = useSelector((s) => s.beds.items);
  const [filterWard, setFilterWard] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedBed, setSelectedBed] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [patientName, setPatientName] = useState('');

  const wards = [...new Set(beds.map((b) => b.ward))];
  const filtered = beds.filter((b) => (!filterWard || b.ward === filterWard) && (!filterStatus || b.status === filterStatus));

  const available = beds.filter((b) => b.status === 'Available').length;
  const occupied = beds.filter((b) => b.status === 'Occupied').length;
  const maintenance = beds.filter((b) => b.status === 'Maintenance').length;

  const handleAssign = () => {
    if (!patientName.trim()) return toast.error('Enter patient name');
    dispatch(assignBed({ bedId: assignModal.id, patientName: patientName.trim(), patientId: 'PAT-NEW' }));
    toast.success(`Bed ${assignModal.bedNumber} assigned`);
    setAssignModal(null);
    setPatientName('');
  };

  const statusColors = {
    Available: 'border-accent-400 bg-accent-50 dark:bg-accent-950/30',
    Occupied: 'border-primary-400 bg-primary-50 dark:bg-primary-950/30',
    Maintenance: 'border-warning-400 bg-warning-50 dark:bg-warning-950/30',
  };

  const statusIcons = {
    Available: <BedDouble className="w-5 h-5 text-accent-500" />,
    Occupied: <User className="w-5 h-5 text-primary-500" />,
    Maintenance: <Wrench className="w-5 h-5 text-warning-500" />,
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Available', value: available, color: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-50 dark:bg-accent-950/30' },
          { label: 'Occupied', value: occupied, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-950/30' },
          { label: 'Maintenance', value: maintenance, color: 'text-warning-600 dark:text-warning-400', bg: 'bg-warning-50 dark:bg-warning-950/30' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 text-center`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-surface-500 mt-1">{s.label} Beds</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select value={filterWard} onChange={(e) => setFilterWard(e.target.value)} className="bg-surface-100 dark:bg-surface-800 rounded-xl px-3 py-2 text-sm border-none focus:ring-1 focus:ring-primary-500">
          <option value="">All Wards</option>
          {wards.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-surface-100 dark:bg-surface-800 rounded-xl px-3 py-2 text-sm border-none focus:ring-1 focus:ring-primary-500">
          <option value="">All Status</option>
          {['Available', 'Occupied', 'Maintenance'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Bed Grid */}
      {wards.filter((w) => !filterWard || w === filterWard).map((ward) => (
        <div key={ward}>
          <h3 className="text-base font-semibold text-surface-900 dark:text-surface-100 mb-3">{ward} — Floor {beds.find((b) => b.ward === ward)?.floor}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filtered.filter((b) => b.ward === ward).map((bed) => (
              <div
                key={bed.id}
                onClick={() => setSelectedBed(bed)}
                className={`border-2 rounded-xl p-3 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${statusColors[bed.status]}`}
              >
                <div className="flex items-center justify-between mb-2">
                  {statusIcons[bed.status]}
                  <span className="text-xs font-semibold text-surface-600 dark:text-surface-400">{bed.bedNumber}</span>
                </div>
                <Badge>{bed.status}</Badge>
                {bed.patientName && <p className="text-xs text-surface-600 dark:text-surface-400 mt-1.5 truncate">{bed.patientName}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Bed Detail Modal */}
      <Modal isOpen={!!selectedBed} onClose={() => setSelectedBed(null)} title={`Bed ${selectedBed?.bedNumber}`} size="sm"
        footer={
          selectedBed && (
            <>
              {selectedBed.status === 'Available' && <Button onClick={() => { setAssignModal(selectedBed); setSelectedBed(null); }}>Assign Patient</Button>}
              {selectedBed.status === 'Occupied' && <Button variant="secondary" onClick={() => { dispatch(releaseBed(selectedBed.id)); toast.success('Bed released'); setSelectedBed(null); }}>Release Bed</Button>}
              {selectedBed.status !== 'Maintenance' && <Button variant="ghost" onClick={() => { dispatch(setMaintenance(selectedBed.id)); toast.success('Set to maintenance'); setSelectedBed(null); }}>Set Maintenance</Button>}
            </>
          )
        }
      >
        {selectedBed && (
          <div className="space-y-3 text-sm">
            {[['Ward', selectedBed.ward], ['Floor', selectedBed.floor], ['Type', selectedBed.type], ['Status', selectedBed.status], ['Daily Rate', `$${selectedBed.dailyRate}`],
              ...(selectedBed.patientName ? [['Patient', selectedBed.patientName], ['Admission Date', selectedBed.admissionDate]] : []),
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between"><span className="text-surface-500">{l}</span><span className="font-medium text-surface-900 dark:text-surface-100">{v}</span></div>
            ))}
          </div>
        )}
      </Modal>

      {/* Assign Modal */}
      <Modal isOpen={!!assignModal} onClose={() => setAssignModal(null)} title={`Assign Patient to ${assignModal?.bedNumber}`} size="sm"
        footer={<><Button variant="secondary" onClick={() => setAssignModal(null)}>Cancel</Button><Button onClick={handleAssign}>Assign</Button></>}
      >
        <Input label="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter patient name" />
      </Modal>
    </div>
  );
}
