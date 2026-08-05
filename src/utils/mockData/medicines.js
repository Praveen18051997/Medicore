export const generateMedicines = () => {
  const medicines = [
    { name: 'Amoxicillin 500mg', category: 'Antibiotics', price: 12.99, manufacturer: 'PharmaCorp' },
    { name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 8.49, manufacturer: 'MediLabs' },
    { name: 'Metformin 850mg', category: 'Diabetes', price: 15.99, manufacturer: 'GlucoHealth' },
    { name: 'Lisinopril 10mg', category: 'Cardiovascular', price: 22.50, manufacturer: 'CardioMed' },
    { name: 'Omeprazole 20mg', category: 'Gastrointestinal', price: 18.75, manufacturer: 'DigestCare' },
    { name: 'Cetirizine 10mg', category: 'Allergy', price: 6.99, manufacturer: 'AllergyFree' },
    { name: 'Amlodipine 5mg', category: 'Cardiovascular', price: 19.99, manufacturer: 'CardioMed' },
    { name: 'Azithromycin 250mg', category: 'Antibiotics', price: 25.00, manufacturer: 'PharmaCorp' },
    { name: 'Atorvastatin 20mg', category: 'Cardiovascular', price: 28.50, manufacturer: 'LipidCare' },
    { name: 'Paracetamol 500mg', category: 'Pain Relief', price: 4.99, manufacturer: 'MediLabs' },
    { name: 'Salbutamol Inhaler', category: 'Respiratory', price: 35.00, manufacturer: 'BreathEasy' },
    { name: 'Insulin Glargine', category: 'Diabetes', price: 89.99, manufacturer: 'GlucoHealth' },
    { name: 'Metoprolol 50mg', category: 'Cardiovascular', price: 16.50, manufacturer: 'CardioMed' },
    { name: 'Clopidogrel 75mg', category: 'Blood Thinner', price: 32.00, manufacturer: 'HemoCare' },
    { name: 'Diazepam 5mg', category: 'Sedatives', price: 11.99, manufacturer: 'NeuroChem' },
    { name: 'Fluoxetine 20mg', category: 'Antidepressants', price: 14.50, manufacturer: 'MindWell' },
    { name: 'Losartan 50mg', category: 'Cardiovascular', price: 20.00, manufacturer: 'CardioMed' },
    { name: 'Ciprofloxacin 500mg', category: 'Antibiotics', price: 18.99, manufacturer: 'PharmaCorp' },
    { name: 'Dexamethasone 4mg', category: 'Steroids', price: 9.50, manufacturer: 'InflamaCare' },
    { name: 'Pantoprazole 40mg', category: 'Gastrointestinal', price: 21.00, manufacturer: 'DigestCare' },
    { name: 'Morphine 10mg', category: 'Pain Relief', price: 45.00, manufacturer: 'PainAway' },
    { name: 'Warfarin 5mg', category: 'Blood Thinner', price: 12.00, manufacturer: 'HemoCare' },
    { name: 'Prednisone 10mg', category: 'Steroids', price: 7.99, manufacturer: 'InflamaCare' },
    { name: 'Levothyroxine 100mcg', category: 'Thyroid', price: 13.50, manufacturer: 'ThyroMed' },
    { name: 'Gabapentin 300mg', category: 'Neurology', price: 24.00, manufacturer: 'NeuroChem' },
    { name: 'Ranitidine 150mg', category: 'Gastrointestinal', price: 10.50, manufacturer: 'DigestCare' },
    { name: 'Hydroxychloroquine 200mg', category: 'Immunology', price: 38.00, manufacturer: 'ImmunoLab' },
    { name: 'Tramadol 50mg', category: 'Pain Relief', price: 16.00, manufacturer: 'PainAway' },
    { name: 'Furosemide 40mg', category: 'Diuretics', price: 8.00, manufacturer: 'RenalCare' },
    { name: 'Alprazolam 0.5mg', category: 'Sedatives', price: 13.99, manufacturer: 'NeuroChem' },
    { name: 'Clindamycin 300mg', category: 'Antibiotics', price: 22.00, manufacturer: 'PharmaCorp' },
    { name: 'Montelukast 10mg', category: 'Respiratory', price: 19.50, manufacturer: 'BreathEasy' },
    { name: 'Sertraline 50mg', category: 'Antidepressants', price: 17.00, manufacturer: 'MindWell' },
    { name: 'Rosuvastatin 10mg', category: 'Cardiovascular', price: 30.00, manufacturer: 'LipidCare' },
    { name: 'Esomeprazole 40mg', category: 'Gastrointestinal', price: 26.50, manufacturer: 'DigestCare' },
    { name: 'Metronidazole 400mg', category: 'Antibiotics', price: 9.99, manufacturer: 'PharmaCorp' },
    { name: 'Telmisartan 40mg', category: 'Cardiovascular', price: 18.00, manufacturer: 'CardioMed' },
    { name: 'Vitamin D3 60000IU', category: 'Supplements', price: 5.50, manufacturer: 'VitaLife' },
    { name: 'Iron Supplement 325mg', category: 'Supplements', price: 7.00, manufacturer: 'VitaLife' },
    { name: 'Calcium + Vitamin D', category: 'Supplements', price: 9.00, manufacturer: 'VitaLife' },
  ];

  return medicines.map((med, i) => {
    const stock = Math.floor(Math.random() * 500);
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + Math.floor(Math.random() * 24) + 1);

    return {
      id: `MED-${String(i + 1).padStart(3, '0')}`,
      ...med,
      stock,
      lowStockThreshold: 50,
      isLowStock: stock < 50,
      expiryDate: expiryDate.toISOString().split('T')[0],
      batchNumber: `BTH-${2024}${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`,
    };
  });
};

export const medicineCategories = [
  'Antibiotics', 'Pain Relief', 'Diabetes', 'Cardiovascular', 'Gastrointestinal',
  'Allergy', 'Respiratory', 'Blood Thinner', 'Sedatives', 'Antidepressants',
  'Steroids', 'Thyroid', 'Neurology', 'Immunology', 'Diuretics', 'Supplements'
];
