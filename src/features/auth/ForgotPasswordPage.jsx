import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, ArrowLeft, Activity, CheckCircle } from 'lucide-react';
import { forgotPassword } from './authSlice';
import { Input, Button } from '../../components/ui';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    await dispatch(forgotPassword(data));
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
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Check your email</h2>
            <p className="text-surface-500 mb-6">We've sent a password reset link to your email address.</p>
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium text-sm">← Back to Sign In</Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-2">Forgot Password?</h2>
            <p className="text-surface-500 mb-8">Enter your email and we'll send you a reset link.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input label="Email Address" type="email" icon={Mail} placeholder="Enter your email" error={errors.email?.message} {...register('email')} />
              <Button type="submit" loading={status === 'loading'} className="w-full">Send Reset Link</Button>
            </form>

            <Link to="/login" className="flex items-center gap-2 text-sm text-surface-500 hover:text-primary-600 mt-6 justify-center">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
