import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock, Eye, EyeOff, CheckCircle, ShieldAlert } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const schema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
});

export default function ChangePasswordModal({ isOpen, onClose, onPasswordChanged }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassValue = watch('newPassword', '');

  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const strength = getStrength(newPassValue);

  const getStrengthLabel = (score) => {
    if (score <= 25) return { text: 'Weak', color: 'bg-danger-500 text-danger-600' };
    if (score <= 50) return { text: 'Fair', color: 'bg-warning-500 text-warning-600' };
    if (score <= 75) return { text: 'Good', color: 'bg-primary-500 text-primary-600' };
    return { text: 'Strong', color: 'bg-accent-500 text-accent-600' };
  };

  const strengthInfo = getStrengthLabel(strength);

  const onSubmit = () => {
    reset();
    onPasswordChanged();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>Update Password</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Current Password"
          icon={Lock}
          type={showCurrent ? 'text' : 'password'}
          placeholder="Enter current password"
          error={errors.currentPassword?.message}
          rightElement={
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="text-surface-400 hover:text-surface-600">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          {...register('currentPassword')}
        />

        <Input
          label="New Password"
          icon={Lock}
          type={showNew ? 'text' : 'password'}
          placeholder="Enter new password (min 8 chars)"
          error={errors.newPassword?.message}
          rightElement={
            <button type="button" onClick={() => setShowNew(!showNew)} className="text-surface-400 hover:text-surface-600">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          {...register('newPassword')}
        />

        {/* Password Strength Indicator */}
        {newPassValue && (
          <div className="space-y-1.5 p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200 dark:border-surface-700">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-surface-600 dark:text-surface-300">Password Strength:</span>
              <span className={`font-bold ${strengthInfo.color.split(' ')[1]}`}>{strengthInfo.text}</span>
            </div>
            <div className="h-1.5 w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 ${strengthInfo.color.split(' ')[0]}`} style={{ width: `${strength}%` }} />
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-surface-500 pt-1">
              <span className={`flex items-center gap-1 ${newPassValue.length >= 8 ? 'text-accent-600 font-medium' : ''}`}>
                {newPassValue.length >= 8 ? <CheckCircle className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />} At least 8 characters
              </span>
              <span className={`flex items-center gap-1 ${/[A-Z]/.test(newPassValue) ? 'text-accent-600 font-medium' : ''}`}>
                {/[A-Z]/.test(newPassValue) ? <CheckCircle className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />} Uppercase letter
              </span>
              <span className={`flex items-center gap-1 ${/[0-9]/.test(newPassValue) ? 'text-accent-600 font-medium' : ''}`}>
                {/[0-9]/.test(newPassValue) ? <CheckCircle className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />} Number (0-9)
              </span>
              <span className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(newPassValue) ? 'text-accent-600 font-medium' : ''}`}>
                {/[^A-Za-z0-9]/.test(newPassValue) ? <CheckCircle className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />} Special character
              </span>
            </div>
          </div>
        )}

        <Input
          label="Confirm New Password"
          icon={Lock}
          type={showConfirm ? 'text' : 'password'}
          placeholder="Re-enter new password"
          error={errors.confirmPassword?.message}
          rightElement={
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-surface-400 hover:text-surface-600">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          {...register('confirmPassword')}
        />
      </form>
    </Modal>
  );
}
