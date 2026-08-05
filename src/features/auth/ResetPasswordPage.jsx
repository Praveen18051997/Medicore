import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock, Eye, EyeOff, Activity, CheckCircle } from 'lucide-react';
import { Input, Button } from '../../components/ui';
import toast from 'react-hot-toast';

const schema = yup.object({
  password: yup.string().min(8, 'Minimum 8 characters').matches(/[A-Z]/, 'Must include uppercase').matches(/[0-9]/, 'Must include a number').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm password'),
});

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({ resolver: yupResolver(schema) });

  const password = watch('password', '');
  const strength = [/.{8,}/, /[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', 'bg-danger-500', 'bg-warning-500', 'bg-warning-400', 'bg-accent-500', 'bg-accent-400'][strength];

  const onSubmit = () => {
    toast.success('Password reset successfully!');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-6">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">MediCore</span>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-accent-50 dark:bg-accent-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-accent-500" />
            </div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Password Reset!</h2>
            <p className="text-surface-500 mb-6">Your password has been updated successfully.</p>
            <Link to="/login"><Button>Sign In</Button></Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Reset Password</h2>
            <p className="text-surface-500 mb-8">Create a new password for your account.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="Enter new password"
                error={errors.password?.message}
                {...register('password')}
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 p-1">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < strength ? strengthColor : 'bg-surface-200 dark:bg-surface-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-surface-500">{strengthLabel}</p>
                </div>
              )}

              <Input label="Confirm Password" type="password" icon={Lock} placeholder="Confirm new password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
              <Button type="submit" className="w-full">Reset Password</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
