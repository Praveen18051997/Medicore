import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Phone, Building, Award, MapPin, FileText, HeartHandshake } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  department: yup.string().required('Department is required'),
  role: yup.string().required('Role/Title is required'),
  degree: yup.string(),
  clinicalRank: yup.string(),
  licenseNo: yup.string(),
  officeRoom: yup.string(),
  bio: yup.string(),
  emergencyContactName: yup.string(),
  emergencyContactPhone: yup.string(),
  emergencyContactRelation: yup.string(),
});

export default function EditProfileModal({ isOpen, onClose, user, onSave }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: '',
      role: '',
      degree: 'M.D.',
      clinicalRank: 'Senior Clinical Lead',
      licenseNo: '',
      officeRoom: '',
      bio: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || 'Neurology',
        role: user.role || 'Doctor',
        degree: user.degree || 'M.D.',
        clinicalRank: user.clinicalRank || 'Senior Clinical Lead',
        licenseNo: user.licenseNo || 'MD-94021-USA',
        officeRoom: user.officeRoom || 'Suite 408 - East Wing',
        bio: user.bio || 'Board-certified clinical specialist with over 8 years of patient care experience.',
        emergencyContactName: user.emergencyContactName || 'Sarah Reynolds',
        emergencyContactPhone: user.emergencyContactPhone || '+1 (555) 234-5678',
        emergencyContactRelation: user.emergencyContactRelation || 'Spouse',
      });
    }
  }, [user, reset]);

  const onSubmit = (data) => {
    onSave(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile Information"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>Save Changes</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-3">Basic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" icon={User} error={errors.name?.message} {...register('name')} />
            <Input label="Email Address" icon={Mail} type="email" error={errors.email?.message} {...register('email')} />
            <Input label="Phone Number" icon={Phone} error={errors.phone?.message} {...register('phone')} />
            <Select
              label="Department"
              options={['Neurology', 'Cardiology', 'Pediatrics', 'Oncology', 'Emergency', 'Administration', 'Pharmacy']}
              error={errors.department?.message}
              {...register('department')}
            />
          </div>
        </div>

        <hr className="border-surface-200 dark:border-surface-700" />

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-3">Clinical & Office Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Professional Role/Title" icon={Award} error={errors.role?.message} {...register('role')} />
            <Input label="Medical Degree (Suffix)" placeholder="e.g. M.D., Ph.D., F.A.C.S." {...register('degree')} />
            <Input label="Clinical Rank / Special Honor" placeholder="e.g. Senior Clinical Lead" {...register('clinicalRank')} />
            <Input label="Medical License ID" icon={FileText} placeholder="e.g. MD-94021" error={errors.licenseNo?.message} {...register('licenseNo')} />
            <Input label="Office / Room #" icon={MapPin} placeholder="e.g. Suite 408" error={errors.officeRoom?.message} {...register('officeRoom')} />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Professional Biography / Summary
            </label>
            <textarea
              rows={3}
              className="input-field w-full p-3 border rounded-xl text-sm"
              placeholder="Write a brief intro about your medical focus and experience..."
              {...register('bio')}
            />
          </div>
        </div>

        <hr className="border-surface-200 dark:border-surface-700" />

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-3 flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4" /> Emergency Contact
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Contact Name" placeholder="Full name" {...register('emergencyContactName')} />
            <Input label="Relationship" placeholder="e.g. Spouse / Parent" {...register('emergencyContactRelation')} />
            <Input label="Phone Number" icon={Phone} placeholder="+1 (555) 000-0000" {...register('emergencyContactPhone')} />
          </div>
        </div>
      </form>
    </Modal>
  );
}
