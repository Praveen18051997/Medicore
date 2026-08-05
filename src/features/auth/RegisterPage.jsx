import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff, Activity, User, Phone, Shield, Building } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerUser, clearError } from './authSlice';
import { Input, Select, Button, Logo } from '../../components/ui';

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  role: yup.string().required('Please select a role'),
  department: yup.string().required('Please select a department'),
  password: yup.string().min(8, 'Minimum 8 characters').matches(/[A-Z]/, 'Must include uppercase').matches(/[0-9]/, 'Must include a number').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm password'),
  acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

const roles = ['Administrator', 'Doctor', 'Nurse', 'Pharmacist', 'Staff Member'];
const departments = ['Administration', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Pharmacy', 'General Surgery', 'Emergency'];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password', '');
  const strength = [/.{8,}/, /[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', 'bg-danger-500', 'bg-warning-500', 'bg-warning-400', 'bg-primary-500', 'bg-accent-500'][strength];

  const onSubmit = async (data) => {
    dispatch(clearError());
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      toast.success(`Welcome to MediCore, ${data.name}! Account created.`);
      navigate('/');
    } else if (registerUser.rejected.match(result)) {
      toast.error(result.payload || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-extrabold mb-4 leading-tight">Join MediCore Healthcare Network</h1>
          <p className="text-sm text-surface-300 max-w-md">
            Create an account to manage patients, schedule appointments, review bed availability, and oversee hospital operations seamlessly.
          </p>
          <div className="mt-10 space-y-4">
            {[
              'Secure Role-Based Access',
              'Real-Time Bed & Patient Tracking',
              'Integrated Pharmacy & Billing',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3">
                <Shield className="w-5 h-5 text-accent-400" />
                <span className="text-sm font-medium">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-surface-50 dark:bg-surface-950 overflow-y-auto">
        <div className="w-full max-w-xl animate-slide-up py-6">
          {/* Mobile logo */}
          <div className="mb-6 lg:hidden">
            <Logo size="md" />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-1">Create Account</h2>
            <p className="text-sm text-surface-500">Sign up to get access to MediCore Hospital Portal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Full Name" icon={User} placeholder="Dr. Jane Doe" error={errors.name?.message} {...register('name')} />
              <Input label="Email Address" type="email" icon={Mail} placeholder="jane.doe@medicore.com" error={errors.email?.message} {...register('email')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Phone Number" icon={Phone} placeholder="+1-555-0188" error={errors.phone?.message} {...register('phone')} />
              <Select label="Role" options={roles} error={errors.role?.message} {...register('role')} />
            </div>

            <Select label="Department" options={departments} error={errors.department?.message} {...register('department')} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="Minimum 8 characters"
                error={errors.password?.message}
                {...register('password')}
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 p-1">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <Input label="Confirm Password" type={showPassword ? 'text' : 'password'} icon={Lock} placeholder="Repeat password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
            </div>

            {password && (
              <div className="space-y-1.5">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < strength ? strengthColor : 'bg-surface-200 dark:bg-surface-700'}`} />
                  ))}
                </div>
                <p className="text-xs text-surface-500">Password strength: <span className="font-semibold text-surface-700 dark:text-surface-300">{strengthLabel}</span></p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => {
                  setAcceptTerms(e.target.checked);
                  setValue('acceptTerms', e.target.checked, { shouldValidate: true });
                }}
                className="w-4 h-4 rounded border-surface-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
              />
              <label htmlFor="acceptTerms" className="text-xs text-surface-600 dark:text-surface-400 cursor-pointer select-none">
                I agree to MediCore's <span className="text-primary-600 font-semibold">Terms of Service</span> and <span className="text-primary-600 font-semibold">Privacy Policy</span>
              </label>
            </div>
            {errors.acceptTerms && <p className="text-xs text-danger-500">{errors.acceptTerms.message}</p>}

            <Button type="submit" loading={status === 'loading'} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
