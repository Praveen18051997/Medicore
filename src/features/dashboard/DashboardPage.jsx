import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, Stethoscope, CalendarDays, BedDouble, AlertCircle, Plus, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import StatCard from '../../components/charts/StatCard';
import AreaChartCard from '../../components/charts/AreaChartCard';
import BarChartCard from '../../components/charts/BarChartCard';
import PieChartCard from '../../components/charts/PieChartCard';
import { Badge, Avatar, Button } from '../../components/ui';
import { formatDate } from '../../utils/helpers';

const monthlyAdmissions = [
  { name: 'Jan', patients: 320 }, { name: 'Feb', patients: 380 }, { name: 'Mar', patients: 420 },
  { name: 'Apr', patients: 390 }, { name: 'May', patients: 480 }, { name: 'Jun', patients: 520 },
  { name: 'Jul', patients: 490 }, { name: 'Aug', patients: 560 }, { name: 'Sep', patients: 610 },
  { name: 'Oct', patients: 580 }, { name: 'Nov', patients: 640 }, { name: 'Dec', patients: 700 },
];

const revenueData = [
  { name: 'Jan', revenue: 45000 }, { name: 'Feb', revenue: 52000 }, { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 }, { name: 'May', revenue: 55000 }, { name: 'Jun', revenue: 67000 },
  { name: 'Jul', revenue: 72000 }, { name: 'Aug', revenue: 69000 }, { name: 'Sep', revenue: 78000 },
  { name: 'Oct', revenue: 82000 }, { name: 'Nov', revenue: 88000 }, { name: 'Dec', revenue: 95000 },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const patients = useSelector((s) => s.patients.items);
  const doctors = useSelector((s) => s.doctors.items);
  const appointments = useSelector((s) => s.appointments.items);
  const beds = useSelector((s) => s.beds.items);
  const medicines = useSelector((s) => s.pharmacy.items);

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === today);
  const availableBeds = beds.filter((b) => b.status === 'Available').length;
  const availableDoctors = doctors.filter((d) => d.status === 'Available').length;

  const appointmentStatusData = [
    { name: 'Scheduled', value: appointments.filter((a) => a.status === 'Scheduled').length },
    { name: 'Completed', value: appointments.filter((a) => a.status === 'Completed').length },
    { name: 'Cancelled', value: appointments.filter((a) => a.status === 'Cancelled').length },
    { name: 'In Progress', value: appointments.filter((a) => a.status === 'In Progress').length },
  ];

  const departmentData = [
    { name: 'Cardiology', value: 24 }, { name: 'Neurology', value: 18 }, { name: 'Pediatrics', value: 32 },
    { name: 'Orthopedics', value: 15 }, { name: 'Emergency', value: 28 }, { name: 'Other', value: 22 },
  ];

  const recentAppointments = appointments.slice(0, 5);
  const lowStockMeds = medicines.filter((m) => m.isLowStock);

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Hero Welcome Banner */}
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-primary-900/90 via-primary-800/80 to-accent-950/90 border border-primary-500/20 text-white relative overflow-hidden animate-fade-in shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-accent-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-500/30 text-primary-300 border border-primary-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-400" /> MediCore Live System
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              WELCOME, <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">{user?.name || 'Administrator'}</span> 👋
            </h1>
            <p className="text-sm text-surface-300 max-w-xl">
              Here is your hospital overview for today. All systems are operational with 99.9% uptime.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="primary" icon={Plus} onClick={() => navigate('/patients')}>
              Add Patient
            </Button>
            <Button variant="secondary" icon={CalendarDays} onClick={() => navigate('/appointments')}>
              Appointments
            </Button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value={patients.length} change="+12.5%" changeType="increase" icon={Users} color="primary" delay={0} />
        <StatCard title="Available Doctors" value={availableDoctors} change="+3" changeType="increase" icon={Stethoscope} color="accent" delay={100} />
        <StatCard title="Today's Appointments" value={todayAppointments.length} change="+8.2%" changeType="increase" icon={CalendarDays} color="warning" delay={200} />
        <StatCard title="Available Beds" value={availableBeds} change="-2" changeType="decrease" icon={BedDouble} color="danger" delay={300} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaChartCard data={monthlyAdmissions} dataKey="patients" title="Patient Admissions (12 Months)" color="#10b981" />
        <PieChartCard data={departmentData} title="Patients by Department" height={300} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard data={revenueData} dataKey="revenue" title="Monthly Revenue" color="#06b6d4" />
        <PieChartCard data={appointmentStatusData} title="Appointment Status" height={300} />
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2 glass-card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-500" /> Recent Appointments
            </h3>
            <button onClick={() => navigate('/appointments')} className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="px-3 py-2 text-left">Patient</th>
                  <th className="px-3 py-2 text-left">Doctor</th>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((apt) => (
                  <tr key={apt.id} className="table-row">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={apt.patientName} size="sm" />
                        <span className="font-semibold text-surface-900 dark:text-surface-100">{apt.patientName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-surface-600 dark:text-surface-400 font-medium">{apt.doctorName}</td>
                    <td className="px-3 py-2.5 text-surface-600 dark:text-surface-400">{formatDate(apt.date)}</td>
                    <td className="px-3 py-2.5"><Badge>{apt.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning-500" /> Critical Alerts
          </h3>
          <div className="space-y-3">
            {patients.filter((p) => p.status === 'Critical').slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3.5 bg-danger-500/10 border border-danger-500/20 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-danger-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-danger-700 dark:text-danger-400 truncate">{p.name}</p>
                  <p className="text-xs text-danger-600 dark:text-danger-500">Critical condition — {p.condition}</p>
                </div>
              </div>
            ))}
            {lowStockMeds.slice(0, 3).map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3.5 bg-warning-500/10 border border-warning-500/20 rounded-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-warning-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-warning-700 dark:text-warning-400 truncate">{m.name}</p>
                  <p className="text-xs text-warning-600 dark:text-warning-500">Low stock: {m.stock} units left</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
