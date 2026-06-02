USE doctor_hub;

INSERT INTO treatment_types (name, slug, description) VALUES
('Allopathic', 'allopathic', 'Modern Western medicine'),
('Homeopathic', 'homeopathic', 'Homeopathic treatment'),
('Herbal', 'herbal', 'Herbal and natural remedies');

INSERT INTO specializations (name, description) VALUES
('Cardiology', 'Heart and cardiovascular system'),
('Dermatology', 'Skin conditions'),
('Pediatrics', 'Child healthcare'),
('General Medicine', 'Primary care'),
('Orthopedics', 'Bones and joints'),
('Neurology', 'Nervous system');

INSERT INTO diseases (name, description) VALUES
('Hypertension', 'High blood pressure'),
('Diabetes', 'Blood sugar management'),
('Asthma', 'Respiratory condition'),
('Migraine', 'Severe headaches'),
('Eczema', 'Skin inflammation'),
('Arthritis', 'Joint inflammation');

-- Password for all demo users: Password@123
-- bcrypt hash generated with cost 10
SET @pwd = '$2b$10$rQZ8K8Y5Y5Y5Y5Y5Y5Y5YuGKxGxGxGxGxGxGxGxGxGxGxGxGxGxG';

INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES
('superadmin@doctorhub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 'Super', 'Admin', '03000000001'),
('admin@doctorhub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'System', 'Admin', '03000000002'),
('assistant@doctorhub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'assistant', 'Sara', 'Assistant', '03000000003'),
('doctor1@doctorhub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor', 'Ahmed', 'Khan', '03000000004'),
('doctor2@doctorhub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor', 'Fatima', 'Ali', '03000000005'),
('patient1@doctorhub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'patient', 'Ali', 'Hassan', '03000000006'),
('patient2@doctorhub.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'patient', 'Ayesha', 'Malik', '03000000007');

INSERT INTO super_admins (user_id) SELECT id FROM users WHERE email = 'superadmin@doctorhub.com';
INSERT INTO admins (user_id, department) SELECT id, 'Operations' FROM users WHERE email = 'admin@doctorhub.com';
INSERT INTO assistants (user_id, department) SELECT id, 'Billing' FROM users WHERE email = 'assistant@doctorhub.com';

INSERT INTO patients (user_id, city, gender, date_of_birth) 
SELECT id, 'Lahore', 'male', '1990-05-15' FROM users WHERE email = 'patient1@doctorhub.com';
INSERT INTO patients (user_id, city, gender, date_of_birth) 
SELECT id, 'Karachi', 'female', '1995-08-20' FROM users WHERE email = 'patient2@doctorhub.com';

INSERT INTO doctors (user_id, treatment_type_id, license_number, qualification, experience_years, bio, city, consultation_fee, rating, rating_count, is_available)
SELECT u.id, 1, 'PMDC-12345', 'MBBS, FCPS (Cardiology)', 12, 'Experienced cardiologist with focus on preventive care.', 'Lahore', 2500.00, 4.80, 120, 1
FROM users u WHERE u.email = 'doctor1@doctorhub.com';

INSERT INTO doctors (user_id, treatment_type_id, license_number, qualification, experience_years, bio, city, consultation_fee, rating, rating_count, is_available)
SELECT u.id, 2, 'PMDC-67890', 'BHMS', 8, 'Homeopathic specialist for chronic conditions.', 'Karachi', 1500.00, 4.50, 85, 1
FROM users u WHERE u.email = 'doctor2@doctorhub.com';

INSERT INTO doctor_specializations (doctor_id, specialization_id)
SELECT d.id, 1 FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@doctorhub.com';
INSERT INTO doctor_specializations (doctor_id, specialization_id)
SELECT d.id, 4 FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@doctorhub.com';
INSERT INTO doctor_specializations (doctor_id, specialization_id)
SELECT d.id, 4 FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@doctorhub.com';

INSERT INTO doctor_diseases (doctor_id, disease_id)
SELECT d.id, 1 FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@doctorhub.com';
INSERT INTO doctor_diseases (doctor_id, disease_id)
SELECT d.id, 2 FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@doctorhub.com';
INSERT INTO doctor_diseases (doctor_id, disease_id)
SELECT d.id, 3 FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@doctorhub.com';

INSERT INTO clinics (doctor_id, name, address, city, phone)
SELECT d.id, 'City Heart Clinic', '123 Mall Road, Gulberg', 'Lahore', '042-1111111'
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor1@doctorhub.com';

INSERT INTO clinics (doctor_id, name, address, city, phone)
SELECT d.id, 'Natural Care Center', '45 Clifton Block 2', 'Karachi', '021-2222222'
FROM doctors d JOIN users u ON d.user_id = u.id WHERE u.email = 'doctor2@doctorhub.com';

INSERT INTO schedules (clinic_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients)
SELECT c.id, 1, '09:00:00', '13:00:00', 30, 8 FROM clinics c WHERE c.name = 'City Heart Clinic';
INSERT INTO schedules (clinic_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients)
SELECT c.id, 3, '14:00:00', '18:00:00', 30, 8 FROM clinics c WHERE c.name = 'City Heart Clinic';
INSERT INTO schedules (clinic_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients)
SELECT c.id, 2, '10:00:00', '16:00:00', 30, 10 FROM clinics c WHERE c.name = 'Natural Care Center';

INSERT INTO system_settings (setting_key, setting_value) VALUES
('app_name', 'Doctor Hub'),
('consultation_currency', 'PKR'),
('payment_verification_required', 'true');
