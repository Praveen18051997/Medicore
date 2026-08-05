export const generateBeds = () => {
  const wards = ['General Ward A', 'General Ward B', 'ICU', 'Pediatric Ward'];
  const floors = [1, 2, 3, 4];
  const statuses = ['Available', 'Occupied', 'Maintenance'];

  return Array.from({ length: 60 }, (_, i) => {
    const wardIndex = Math.floor(i / 15);
    const status = i < 35 ? (i % 3 === 0 ? 'Available' : 'Occupied') : (i % 5 === 0 ? 'Maintenance' : statuses[Math.floor(Math.random() * 2)]);

    return {
      id: `BED-${String(i + 1).padStart(3, '0')}`,
      bedNumber: `${wards[wardIndex].charAt(0)}${i + 1}`,
      ward: wards[wardIndex],
      floor: floors[wardIndex],
      status,
      type: wardIndex === 2 ? 'ICU' : wardIndex === 3 ? 'Pediatric' : 'General',
      patientId: status === 'Occupied' ? `PAT-${String((i % 50) + 1).padStart(4, '0')}` : null,
      patientName: status === 'Occupied' ? `Patient ${i + 1}` : null,
      admissionDate: status === 'Occupied' ? new Date(Date.now() - Math.random() * 30 * 86400000).toISOString().split('T')[0] : null,
      dailyRate: wardIndex === 2 ? 5000 : wardIndex === 3 ? 2000 : 1500,
    };
  });
};
