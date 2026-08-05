export const generateNotifications = () => {
  const types = ['appointment', 'alert', 'system', 'billing', 'pharmacy'];
  const notifications = [
    { type: 'appointment', title: 'Upcoming Appointment', message: 'Dr. Sarah Mitchell has an appointment with James Smith at 10:00 AM', priority: 'normal' },
    { type: 'alert', title: 'Critical Patient Alert', message: 'Patient PAT-0001 vitals are showing abnormal readings in ICU Bed 3', priority: 'high' },
    { type: 'pharmacy', title: 'Low Stock Warning', message: 'Amoxicillin 500mg stock is below threshold (23 units remaining)', priority: 'high' },
    { type: 'billing', title: 'Payment Overdue', message: 'Invoice INV-0015 for Patient Patricia Brown is 15 days overdue ($1,250.00)', priority: 'normal' },
    { type: 'system', title: 'System Maintenance', message: 'Scheduled maintenance window: Sunday 2:00 AM - 4:00 AM EST', priority: 'low' },
    { type: 'appointment', title: 'Appointment Cancelled', message: 'Jennifer Garcia cancelled her appointment with Dr. James Chen', priority: 'normal' },
    { type: 'alert', title: 'Emergency Admission', message: 'New emergency admission — Patient Robert Davis, suspected cardiac event', priority: 'high' },
    { type: 'pharmacy', title: 'Medicine Expiring Soon', message: 'Batch BTH-2024087 of Insulin Glargine expires in 30 days', priority: 'normal' },
    { type: 'billing', title: 'Payment Received', message: 'Payment of $2,450.00 received for Invoice INV-0023 via Insurance', priority: 'low' },
    { type: 'system', title: 'New Doctor Onboarded', message: 'Dr. Olivia Brown (Anesthesiology) has been added to the system', priority: 'low' },
    { type: 'appointment', title: 'Appointment Rescheduled', message: 'Michael Foster rescheduled from 2:00 PM to 4:30 PM with Dr. Raj Patel', priority: 'normal' },
    { type: 'alert', title: 'Bed Capacity Warning', message: 'ICU is at 90% capacity — only 2 beds available', priority: 'high' },
    { type: 'pharmacy', title: 'New Stock Arrived', message: 'Shipment received: 500 units of Metformin 850mg, 300 units of Lisinopril 10mg', priority: 'low' },
    { type: 'billing', title: 'Insurance Claim Approved', message: 'Insurance claim for Patient Linda Miller (BlueCross) approved — $3,200.00', priority: 'normal' },
    { type: 'system', title: 'Backup Completed', message: 'Daily database backup completed successfully at 3:00 AM', priority: 'low' },
    { type: 'appointment', title: 'Doctor On Leave', message: 'Dr. Emily Rodriguez will be on leave from Aug 10-17. 8 appointments need rescheduling', priority: 'high' },
    { type: 'alert', title: 'Lab Results Ready', message: 'Lab results for Patient William Johnson (Blood Panel, Lipid Profile) are now available', priority: 'normal' },
    { type: 'pharmacy', title: 'Prescription Filled', message: 'Prescription for Patient Elizabeth Brown — 3 medications dispensed successfully', priority: 'low' },
    { type: 'billing', title: 'Monthly Revenue Report', message: 'July 2024 revenue report is ready for review — Total: $284,500', priority: 'normal' },
    { type: 'system', title: 'Security Update', message: 'System security patches applied successfully. No downtime required.', priority: 'low' },
  ];

  return notifications.map((n, i) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 45 - Math.floor(Math.random() * 60));
    return {
      id: `NOTIF-${String(i + 1).padStart(3, '0')}`,
      ...n,
      timestamp: date.toISOString(),
      read: i > 5,
    };
  });
};
