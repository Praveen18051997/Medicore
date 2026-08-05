import { generateDoctors } from './doctors';
import { generatePatients } from './patients';

const doctors = generateDoctors();
const patients = generatePatients();

export const generateAppointments = () => {
  const statuses = ['Scheduled', 'Completed', 'Cancelled', 'In Progress'];
  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
  const reasons = [
    'General Checkup', 'Follow-up Visit', 'Consultation', 'Lab Results Review',
    'Vaccination', 'Blood Pressure Check', 'Diabetes Management', 'Cardiac Evaluation',
    'Orthopedic Consultation', 'Dermatology Consultation', 'Eye Examination',
    'Dental Checkup', 'Prenatal Checkup', 'Post-Surgery Follow-up', 'Physical Therapy'
  ];

  return Array.from({ length: 100 }, (_, i) => {
    const patient = patients[i % patients.length];
    const doctor = doctors[i % doctors.length];
    const daysOffset = Math.floor(Math.random() * 60) - 30;
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);

    return {
      id: `APT-${String(i + 1).padStart(4, '0')}`,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      date: date.toISOString().split('T')[0],
      time: timeSlots[Math.floor(Math.random() * timeSlots.length)],
      status: daysOffset < -5 ? (Math.random() > 0.2 ? 'Completed' : 'Cancelled') : daysOffset < 0 ? 'Completed' : statuses[Math.floor(Math.random() * 2)],
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      notes: i % 3 === 0 ? 'Patient requested early morning slot' : '',
    };
  });
};
