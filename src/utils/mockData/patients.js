export const generatePatients = () => {
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen', 'Daniel', 'Lisa', 'Matthew', 'Nancy', 'Anthony', 'Betty', 'Mark', 'Margaret', 'Donald', 'Sandra', 'Steven', 'Ashley', 'Paul', 'Dorothy', 'Andrew', 'Kimberly', 'Joshua', 'Emily', 'Kenneth', 'Donna', 'Kevin', 'Michelle', 'Brian', 'Carol', 'George', 'Amanda', 'Timothy', 'Melissa', 'Ronald', 'Deborah'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const statuses = ['Active', 'Discharged', 'Critical', 'Recovering'];
  const genders = ['Male', 'Female'];

  return Array.from({ length: 50 }, (_, i) => {
    const gender = genders[i % 2];
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const age = 18 + Math.floor(Math.random() * 65);
    const admitDate = new Date();
    admitDate.setDate(admitDate.getDate() - Math.floor(Math.random() * 90));

    return {
      id: `PAT-${String(i + 1).padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      age,
      gender,
      dob: `${1960 + Math.floor(Math.random() * 45)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+1-555-${String(1000 + i).padStart(4, '0')}`,
      address: `${100 + i * 10} ${lastName} St, Springfield, IL`,
      bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
      status: i < 3 ? 'Critical' : statuses[Math.floor(Math.random() * statuses.length)],
      admitDate: admitDate.toISOString().split('T')[0],
      condition: ['Hypertension', 'Diabetes Type 2', 'Fracture', 'Pneumonia', 'Migraine', 'Asthma', 'Cardiac Arrhythmia', 'Appendicitis', 'Allergic Reaction', 'Chronic Back Pain'][i % 10],
      assignedDoctor: `DOC-${String((i % 20) + 1).padStart(3, '0')}`,
      room: i < 40 ? `${Math.floor(i / 10) + 1}${String(100 + (i % 10)).slice(1)}` : null,
      insuranceProvider: ['BlueCross', 'Aetna', 'Cigna', 'UnitedHealth', 'Humana'][i % 5],
      insuranceId: `INS-${String(10000 + i)}`,
    };
  });
};
