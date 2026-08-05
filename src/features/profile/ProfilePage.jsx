import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Edit2, Camera, Mail, Phone, Building, Calendar, ShieldCheck, Lock,
  Bell, Award, MapPin, Activity, User, CheckCircle2, ChevronRight,
  TrendingUp, Users, Stethoscope, Star, Smartphone, Laptop, LogOut,
  Sliders, Download, Check, Clock, AlertTriangle, ShieldAlert, Sparkles, Filter
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';
import { updateProfile } from '../auth/authSlice';
import { Avatar, Button, Card, Badge } from '../../components/ui';
import { formatDate } from '../../utils/helpers';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';
import TwoFactorModal from './TwoFactorModal';
import AvatarCoverModal from './AvatarCoverModal';

const PERFORMANCE_DATA = [
  { day: 'Mon', consultations: 14, procedures: 4 },
  { day: 'Tue', consultations: 19, procedures: 6 },
  { day: 'Wed', consultations: 16, procedures: 3 },
  { day: 'Thu', consultations: 22, procedures: 8 },
  { day: 'Fri', consultations: 18, procedures: 5 },
  { day: 'Sat', consultations: 10, procedures: 2 },
  { day: 'Sun', consultations: 7, procedures: 1 },
];

const INITIAL_ACTIVITIES = [
  { id: 1, type: 'prescription', title: 'Issued Prescription #RX-8841', detail: 'Amoxicillin 500mg for Patient #PT-104', time: '10 mins ago', category: 'Prescriptions' },
  { id: 2, type: 'surgery', title: 'Completed Neuro Checkup', detail: 'Patient #PT-092 - Normal brain MRI results', time: '1 hour ago', category: 'Surgeries' },
  { id: 3, type: 'record', title: 'Updated Patient EHR File', detail: 'Added diagnostic notes for Patient #PT-311', time: '3 hours ago', category: 'Records' },
  { id: 4, type: 'prescription', title: 'Refilled Pain Medication', detail: 'Ibuprofen 400mg for Patient #PT-205', time: 'Yesterday', category: 'Prescriptions' },
  { id: 5, type: 'surgery', title: 'Assisted in Surgical Procedure', detail: 'Room 3 - Lumbar Spine Decompression', time: '2 days ago', category: 'Surgeries' },
];

const DUTY_STATUSES = [
  { label: 'Active On Duty', color: 'bg-accent-500', text: 'text-accent-600' },
  { label: 'In Surgery', color: 'bg-warning-500', text: 'text-warning-600' },
  { label: 'On Call Duty', color: 'bg-primary-500', text: 'text-primary-600' },
  { label: 'Away / On Leave', color: 'bg-surface-400', text: 'text-surface-500' },
];

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);

  // Tab State
  const [activeTab, setActiveTab] = useState('overview');

  // Modals State
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showAvatarCoverModal, setShowAvatarCoverModal] = useState(false);

  // Interactive States
  const [dutyStatus, setDutyStatus] = useState(user?.status || 'Active On Duty');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(user?.twoFactorEnabled || false);
  const [bannerTheme, setBannerTheme] = useState(user?.bannerTheme || 'from-primary-500 via-primary-600 to-accent-500');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || null);
  const [activityCategory, setActivityCategory] = useState('All');

  // Notifications toggles
  const [notifSettings, setNotifSettings] = useState({
    urgentAlerts: true,
    patientMessages: true,
    labResults: true,
    emailSummary: false,
  });

  // Sessions list state
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows 11', location: 'New York, USA', current: true, icon: Laptop, time: 'Active Now' },
    { id: 2, device: 'MediCore iOS Mobile App', location: 'iPhone 15 Pro', current: false, icon: Smartphone, time: '2 hours ago' },
  ]);

  const handleProfileSave = (updatedData) => {
    dispatch(updateProfile(updatedData));
    toast.success('Profile information saved successfully!');
  };

  const handleAvatarCoverSave = ({ banner, avatar }) => {
    setBannerTheme(banner);
    setAvatarUrl(avatar);
    dispatch(updateProfile({ bannerTheme: banner, avatar }));
    toast.success('Header customization updated!');
  };

  const handleStatusChange = (newStatus) => {
    setDutyStatus(newStatus);
    setShowStatusDropdown(false);
    dispatch(updateProfile({ status: newStatus }));
    toast.success(`Duty status set to: ${newStatus}`);
  };

  const handleToggle2FA = (val) => {
    setIs2FAEnabled(val);
    dispatch(updateProfile({ twoFactorEnabled: val }));
    toast.success(val ? '2-Factor Authentication Enabled!' : '2-Factor Authentication Disabled');
  };

  const handleLogoutOtherSessions = () => {
    setSessions(sessions.filter((s) => s.current));
    toast.success('Logged out of all other active sessions');
  };

  const handleExportData = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: 'Preparing medical activity export PDF...',
        success: 'Clinical data log downloaded successfully!',
        error: 'Export failed',
      }
    );
  };

  // Profile Completion logic
  const completionItems = [
    { label: 'Basic Info & Email', done: true },
    { label: 'Medical License Verified', done: !!user?.licenseNo || true },
    { label: 'Emergency Contact Set', done: !!user?.emergencyContactName || true },
    { label: '2-Factor Security', done: is2FAEnabled },
  ];
  const completedCount = completionItems.filter((i) => i.done).length;
  const completionPercentage = Math.round((completedCount / completionItems.length) * 100);

  const filteredActivities = activityCategory === 'All'
    ? INITIAL_ACTIVITIES
    : INITIAL_ACTIVITIES.filter((a) => a.category === activityCategory);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Dynamic Profile Hero Card */}
      <Card className="relative overflow-hidden p-0 border-surface-200 dark:border-surface-800">
        {/* Banner */}
        <div className={`h-36 sm:h-44 bg-gradient-to-r ${bannerTheme} relative transition-all duration-500`}>
          <button
            onClick={() => setShowAvatarCoverModal(true)}
            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Camera className="w-3.5 h-3.5" /> Customize Banner & Avatar
          </button>
        </div>

        {/* Header Profile Controls */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full sm:w-auto">
              {/* Avatar - Negative margin pulls ONLY the avatar over the banner */}
              <div className="relative group flex-shrink-0 -mt-14 sm:-mt-16">
                <Avatar
                  name={user?.name || 'Dr. Praveen R'}
                  src={avatarUrl}
                  size="xl"
                  className="w-28 h-28 sm:w-32 sm:h-32 text-3xl ring-4 ring-white dark:ring-surface-900 shadow-xl"
                />
                <button
                  onClick={() => setShowAvatarCoverModal(true)}
                  className="absolute bottom-1 right-1 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-transform group-hover:scale-110 shadow-lg"
                  title="Change avatar"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Text - Positioned cleanly in white card section */}
              <div className="text-center sm:text-left space-y-2 pt-2 sm:pt-3">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-surface-900 dark:text-surface-50 drop-shadow-xs">
                    {user?.name || 'Dr. Praveen R'}
                  </h2>
                  <span className="px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-slate-900 text-white dark:bg-surface-100 dark:text-surface-900 rounded-md shadow-sm">
                    {user?.degree || 'M.D.'}
                  </span>
                  <Badge variant="success" className="flex items-center gap-1 py-1 px-2.5 shadow-sm ring-1 ring-accent-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Practitioner
                  </Badge>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-surface-700 dark:text-surface-300 flex-wrap">
                  <span className="flex items-center gap-1 text-primary-700 dark:text-primary-300 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> {user?.clinicalRank || 'Senior Clinical Lead'}
                  </span>
                  <span className="text-surface-300 dark:text-surface-600">•</span>
                  <span className="text-surface-800 dark:text-surface-200">{user?.role || 'Doctor'}</span>
                  <span className="text-surface-300 dark:text-surface-600">•</span>
                  <span className="px-2.5 py-0.5 bg-primary-500/10 text-primary-700 dark:text-primary-300 rounded-full text-xs font-bold border border-primary-500/20">
                    {user?.department || 'Neurology'} Department
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-surface-500 pt-1 flex-wrap">
                  <span className="flex items-center gap-1.5 font-medium bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded-xl border border-surface-200/60 dark:border-surface-700/60">
                    <Award className="w-3.5 h-3.5 text-amber-500" /> License: <strong className="text-surface-800 dark:text-surface-200">{user?.licenseNo || 'MD-94021-USA'}</strong>
                  </span>
                  <span className="flex items-center gap-1.5 font-medium bg-surface-100 dark:bg-surface-800 px-3 py-1.5 rounded-xl border border-surface-200/60 dark:border-surface-700/60">
                    <MapPin className="w-3.5 h-3.5 text-primary-500" /> Room: <strong className="text-surface-800 dark:text-surface-200">{user?.officeRoom || 'Suite 408'}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Duty Status Dropdown */}
            <div className="flex items-center gap-2 flex-wrap justify-center pt-2 sm:pt-3">
              {/* Duty Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-xs font-semibold text-surface-800 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${DUTY_STATUSES.find((s) => s.label === dutyStatus)?.color || 'bg-accent-500'} animate-pulse`} />
                  {dutyStatus}
                </button>

                {showStatusDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-xl py-1.5 z-30 animate-scale-in">
                    <p className="px-3 py-1 text-[10px] font-bold text-surface-400 uppercase tracking-wider">Set On-Duty Status</p>
                    {DUTY_STATUSES.map((st) => (
                      <button
                        key={st.label}
                        onClick={() => handleStatusChange(st.label)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors ${
                          dutyStatus === st.label ? 'bg-primary-500/10 font-bold text-primary-600' : 'text-surface-700 dark:text-surface-300'
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                        {st.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button variant="primary" icon={Edit2} onClick={() => setShowEditModal(true)}>
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div className="bg-surface-50 dark:bg-surface-800/40 border-t border-surface-200 dark:border-surface-800 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <span className="font-semibold text-surface-800 dark:text-surface-200">Account Security & Profile Completion: </span>
              <span className="font-bold text-primary-600 dark:text-primary-400">{completionPercentage}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-64">
            <div className="h-2 flex-1 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
            </div>
            {!is2FAEnabled && (
              <button onClick={() => setShow2FAModal(true)} className="text-xs font-bold text-primary-600 hover:underline flex-shrink-0">
                + Enable 2FA
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-200 dark:border-surface-800 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview & Info', icon: User },
          { id: 'activity', label: 'Clinical Activity & Stats', icon: Activity },
          { id: 'security', label: 'Security & Sessions', icon: Lock },
          { id: 'preferences', label: 'Preferences & Alerts', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & CREDENTIALS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Personal & Clinical Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Card */}
            <Card>
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 mb-2">Professional Biography</h3>
              <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">
                {user?.bio ||
                  'Senior Neurological Consultant & Clinical Researcher specializing in neurovascular disorders, brain injury recovery, and advanced diagnostic imaging. Committed to high-precision patient care and hospital administration excellence.'}
              </p>

              <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-surface-500">Specializations:</span>
                {['Clinical Neurology', 'Neuro-Oncology', 'Stroke Rehabilitation', 'EHR Management'].map((spec) => (
                  <span key={spec} className="px-2.5 py-1 bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-lg text-xs font-medium">
                    {spec}
                  </span>
                ))}
              </div>
            </Card>

            {/* General Info Grid */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Personal & Contact Details</h3>
                <button onClick={() => setShowEditModal(true)} className="text-xs text-primary-600 hover:underline font-semibold flex items-center gap-1">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Mail, label: 'Email Address', value: user?.email || 'admin@medicore.com' },
                  { icon: Phone, label: 'Phone Number', value: user?.phone || '+1 (555) 000-0001' },
                  { icon: Building, label: 'Department', value: user?.department || 'Administration' },
                  { icon: Award, label: 'Medical License #', value: user?.licenseNo || 'MD-94021-USA' },
                  { icon: MapPin, label: 'Office Room', value: user?.officeRoom || 'Suite 408 - East Wing' },
                  { icon: Calendar, label: 'Member Since', value: formatDate(user?.joinDate || '2020-03-15') },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3.5 p-3 rounded-xl bg-surface-50/50 dark:bg-surface-800/30">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-surface-500 font-medium">{item.label}</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning-500" /> Emergency Contact Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-warning-500/5 border border-warning-500/20 p-4 rounded-2xl">
                <div>
                  <p className="text-xs text-surface-500">Contact Name</p>
                  <p className="text-sm font-bold text-surface-900 dark:text-surface-100">{user?.emergencyContactName || 'Sarah Reynolds'}</p>
                </div>
                <div>
                  <p className="text-xs text-surface-500">Relationship</p>
                  <p className="text-sm font-bold text-surface-900 dark:text-surface-100">{user?.emergencyContactRelation || 'Spouse'}</p>
                </div>
                <div>
                  <p className="text-xs text-surface-500">Emergency Phone</p>
                  <p className="text-sm font-bold text-surface-900 dark:text-surface-100">{user?.emergencyContactPhone || '+1 (555) 234-5678'}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Col: Shift & Quick Stats */}
          <div className="space-y-6">
            {/* Shift & Duty Schedule Card */}
            <Card>
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-500" /> Clinical Shift Schedule
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-surface-800 dark:text-surface-200">Regular Ward Shift</p>
                    <p className="text-surface-500">Mon - Fri • 08:00 AM - 04:00 PM</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-surface-800 dark:text-surface-200">ER On-Call Rotation</p>
                    <p className="text-surface-500">Alternate Weekends • 24 Hours</p>
                  </div>
                  <Badge variant="info">Upcoming</Badge>
                </div>
              </div>
            </Card>

            {/* Quick Profile Actions */}
            <Card>
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full justify-between text-xs" onClick={handleExportData}>
                  <span>Download Medical Credentials PDF</span>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="secondary" className="w-full justify-between text-xs" onClick={() => setShowPasswordModal(true)}>
                  <span>Update Account Password</span>
                  <Lock className="w-4 h-4" />
                </Button>
                <Button variant="secondary" className="w-full justify-between text-xs" onClick={() => setShow2FAModal(true)}>
                  <span>{is2FAEnabled ? 'Manage 2FA Settings' : 'Enable 2FA Protection'}</span>
                  <ShieldCheck className="w-4 h-4 text-accent-500" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: CLINICAL ACTIVITY & STATS */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-500">Total Consultations</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">342</p>
                <p className="text-[11px] text-accent-600 font-medium flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +14% this month</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent-500/10 text-accent-600 dark:text-accent-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-500">Patients Managed</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">128</p>
                <p className="text-[11px] text-surface-500">Across 3 Wards</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-warning-500/10 text-warning-600">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-500">Procedures & Surgeries</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">45</p>
                <p className="text-[11px] text-accent-600 font-medium">100% Success Rate</p>
              </div>
            </Card>

            <Card className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-surface-500">Patient Satisfaction</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">4.9 / 5.0</p>
                <p className="text-[11px] text-amber-600 font-medium">Top 5% Rated Doctor</p>
              </div>
            </Card>
          </div>

          {/* Recharts Analytics */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Weekly Clinical Activity Trend</h3>
                <p className="text-xs text-surface-500">Patient consultations vs surgeries conducted over the past 7 days</p>
              </div>
              <Badge variant="neutral">This Week</Badge>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConsult" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="consultations" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorConsult)" name="Consultations" />
                  <Area type="monotone" dataKey="procedures" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorProc)" name="Surgeries/Procedures" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Activity Log Feed */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-500" /> Recent Clinical Log & Audit Trail
              </h3>
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <Filter className="w-3.5 h-3.5 text-surface-400 mr-1 hidden sm:block" />
                {['All', 'Prescriptions', 'Surgeries', 'Records'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActivityCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      activityCategory === cat
                        ? 'bg-primary-500 text-white'
                        : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200/60 dark:border-surface-700/50">
                  <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-surface-900 dark:text-surface-100 truncate">{act.title}</p>
                      <span className="text-[11px] text-surface-400 flex-shrink-0 ml-2">{act.time}</span>
                    </div>
                    <p className="text-xs text-surface-500 mt-0.5">{act.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: SECURITY & SESSIONS */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Password Card */}
          <Card>
            <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 mb-2">Password Management</h3>
            <p className="text-xs text-surface-500 mb-4">Ensure your account password is strong and updated regularly.</p>
            <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-surface-900 dark:text-surface-100">Account Password</p>
                  <p className="text-xs text-surface-500">Last updated 30 days ago</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </Button>
            </div>
          </Card>

          {/* 2FA Card */}
          <Card>
            <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 mb-2">Two-Factor Authentication (2FA)</h3>
            <p className="text-xs text-surface-500 mb-4">Add an extra layer of security to your medical staff login.</p>
            <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${is2FAEnabled ? 'bg-accent-500/10 text-accent-600' : 'bg-warning-500/10 text-warning-600'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-surface-900 dark:text-surface-100">Authenticator App 2FA</p>
                    <Badge variant={is2FAEnabled ? 'success' : 'warning'}>
                      {is2FAEnabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-xs text-surface-500">
                    {is2FAEnabled ? 'Protected with TOTP Authenticator App' : 'Enable to protect HIPAA compliant medical records'}
                  </p>
                </div>
              </div>
              <Button variant={is2FAEnabled ? 'secondary' : 'primary'} size="sm" onClick={() => setShow2FAModal(true)}>
                {is2FAEnabled ? 'Manage 2FA' : 'Setup 2FA'}
              </Button>
            </div>
          </Card>

          {/* Active Devices & Sessions */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Active Login Sessions</h3>
                <p className="text-xs text-surface-500">Devices currently logged into your MediCore account</p>
              </div>
              {sessions.length > 1 && (
                <Button variant="danger" size="sm" icon={LogOut} onClick={handleLogoutOtherSessions}>
                  Logout Other Devices
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {sessions.map((sess) => {
                const Icon = sess.icon;
                return (
                  <div key={sess.id} className="flex items-center justify-between p-3.5 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-200/60 dark:border-surface-700/60">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-surface-700 dark:text-surface-300">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-surface-900 dark:text-surface-100">{sess.device}</p>
                          {sess.current && <Badge variant="success">Current Device</Badge>}
                        </div>
                        <p className="text-xs text-surface-500">{sess.location} • {sess.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: PREFERENCES & NOTIFICATIONS */}
      {activeTab === 'preferences' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Alerts */}
          <Card>
            <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 mb-2 flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary-500" /> Notification Preferences
            </h3>
            <p className="text-xs text-surface-500 mb-4">Choose which notifications you want to receive on your dashboard.</p>

            <div className="space-y-4">
              {[
                { key: 'urgentAlerts', label: 'Urgent ER & Code Red Alerts', desc: 'Real-time popups for critical emergency room admissions' },
                { key: 'patientMessages', label: 'Patient Consultation Updates', desc: 'Notifications when patients post lab queries or request appointments' },
                { key: 'labResults', label: 'Lab & Diagnostic Test Ready', desc: 'Alerts when radiology or blood test reports are uploaded' },
                { key: 'emailSummary', label: 'Weekly Clinical Summary Email', desc: 'Receive weekly automated statistics in your inbox' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3.5 bg-surface-50 dark:bg-surface-800/40 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{item.label}</p>
                    <p className="text-xs text-surface-500">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSettings[item.key]}
                    onChange={(e) => {
                      setNotifSettings({ ...notifSettings, [item.key]: e.target.checked });
                      toast.success(`${item.label} setting updated`);
                    }}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-surface-300 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Export & Data Backup */}
          <Card className="flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 mb-2 flex items-center gap-2">
                <Download className="w-4 h-4 text-accent-500" /> Data Export & Backup
              </h3>
              <p className="text-xs text-surface-500 mb-4">
                Export your clinical history, consultation reports, and audit logs into HIPAA compliant formats.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-surface-50 dark:bg-surface-800/40 rounded-xl border border-surface-200 dark:border-surface-700">
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">Export Clinical Activity Log</p>
                  <p className="text-xs text-surface-500 mt-0.5">Includes prescription records, procedure logs, and patient notes.</p>
                  <Button variant="secondary" size="sm" className="mt-3" onClick={handleExportData}>
                    Download Activity Log (PDF)
                  </Button>
                </div>

                <div className="p-3.5 bg-surface-50 dark:bg-surface-800/40 rounded-xl border border-surface-200 dark:border-surface-700">
                  <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">Doctor Credentials Summary</p>
                  <p className="text-xs text-surface-500 mt-0.5">Formal medical license verification document.</p>
                  <Button variant="secondary" size="sm" className="mt-3" onClick={handleExportData}>
                    Download Credentials Certificate
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* MODALS */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={handleProfileSave}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onPasswordChanged={() => toast.success('Password changed successfully!')}
      />

      <TwoFactorModal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        isEnabled={is2FAEnabled}
        onToggle2FA={handleToggle2FA}
      />

      <AvatarCoverModal
        isOpen={showAvatarCoverModal}
        onClose={() => setShowAvatarCoverModal(false)}
        currentBanner={bannerTheme}
        currentAvatar={avatarUrl}
        onSave={handleAvatarCoverSave}
      />
    </div>
  );
}
