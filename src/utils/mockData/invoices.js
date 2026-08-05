export const generateInvoices = () => {
  const statuses = ['Paid', 'Pending', 'Overdue'];
  const paymentMethods = ['Credit Card', 'Insurance', 'Cash', 'Bank Transfer'];

  return Array.from({ length: 80 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    const consultation = 100 + Math.floor(Math.random() * 400);
    const labTests = Math.random() > 0.4 ? 50 + Math.floor(Math.random() * 300) : 0;
    const pharmacy = Math.random() > 0.3 ? 20 + Math.floor(Math.random() * 200) : 0;
    const roomCharges = Math.random() > 0.6 ? 500 + Math.floor(Math.random() * 2000) : 0;
    const subtotal = consultation + labTests + pharmacy + roomCharges;
    const tax = Math.round(subtotal * 0.08);
    const discount = i % 5 === 0 ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + tax - discount;

    return {
      id: `INV-${String(i + 1).padStart(4, '0')}`,
      patientId: `PAT-${String((i % 50) + 1).padStart(4, '0')}`,
      patientName: `Patient ${(i % 50) + 1}`,
      date: date.toISOString().split('T')[0],
      status: date < new Date(Date.now() - 30 * 86400000) && Math.random() > 0.5 ? 'Overdue' : statuses[Math.floor(Math.random() * 2)],
      items: [
        { description: 'Consultation Fee', amount: consultation },
        ...(labTests ? [{ description: 'Lab Tests', amount: labTests }] : []),
        ...(pharmacy ? [{ description: 'Pharmacy', amount: pharmacy }] : []),
        ...(roomCharges ? [{ description: 'Room Charges', amount: roomCharges }] : []),
      ],
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      insuranceClaim: Math.random() > 0.5,
    };
  });
};
