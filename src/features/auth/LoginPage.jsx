import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginUser, clearError } from './authSlice';
import { Input, Button, Logo } from '../../components/ui';

const schema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    dispatch(clearError());
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name}!`);
      navigate('/');
    } else if (loginUser.rejected.match(result)) {
      toast.error(result.payload || 'Invalid User! Account does not exist.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-950 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <Logo size="lg" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">Hospital Management<br />Made Effortless</h1>
          <p className="text-lg text-primary-200 max-w-md">
            Streamline patient care, manage appointments, track beds, handle billing, and oversee pharmacy operations — all from one powerful dashboard.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { label: 'Patients Managed', value: '12,400+' },
              { label: 'Active Doctors', value: '200+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-primary-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-surface-50 dark:bg-surface-950">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Welcome back</h2>
            <p className="text-surface-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password')}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-surface-600 dark:text-surface-400 cursor-pointer">
                <input type="checkbox" className="rounded border-surface-300 text-primary-500 focus:ring-primary-500" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">Forgot Password?</Link>
            </div>

            <Button type="submit" loading={status === 'loading'} className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 p-4 bg-surface-100 dark:bg-surface-800/50 rounded-xl">
            <p className="text-xs text-surface-500 mb-1">Demo Credentials:</p>
            <p className="text-sm text-surface-700 dark:text-surface-300 font-mono">admin@medicore.com / admin123</p>
          </div>

          <p className="mt-6 text-center text-sm text-surface-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
