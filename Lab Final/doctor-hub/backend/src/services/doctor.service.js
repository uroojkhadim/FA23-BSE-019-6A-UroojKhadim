const pool = require('../config/database');
const ApiError = require('../utils/ApiError');

const buildWhere = (filters) => {
  const params = [];
  let where = 'd.deleted_at IS NULL AND u.deleted_at IS NULL AND u.is_active = 1';

  if (filters.diseaseId) {
    where += ' AND EXISTS (SELECT 1 FROM doctor_diseases dd WHERE dd.doctor_id = d.id AND dd.disease_id = ?)';
    params.push(filters.diseaseId);
  }
  if (filters.treatmentTypeId) {
    where += ' AND d.treatment_type_id = ?';
    params.push(filters.treatmentTypeId);
  }
  if (filters.specializationId) {
    where +=
      ' AND EXISTS (SELECT 1 FROM doctor_specializations ds WHERE ds.doctor_id = d.id AND ds.specialization_id = ?)';
    params.push(filters.specializationId);
  }
  if (filters.city) {
    where +=
      ' AND (d.city LIKE ? OR EXISTS (SELECT 1 FROM clinics c WHERE c.doctor_id = d.id AND c.city LIKE ? AND c.deleted_at IS NULL))';
    params.push(`%${filters.city}%`, `%${filters.city}%`);
  }
  if (filters.clinicId) {
    where +=
      ' AND EXISTS (SELECT 1 FROM clinics c WHERE c.id = ? AND c.doctor_id = d.id AND c.deleted_at IS NULL)';
    params.push(filters.clinicId);
  }
  if (filters.minRating) {
    where += ' AND d.rating >= ?';
    params.push(filters.minRating);
  }
  if (filters.available === 'true' || filters.available === true) {
    where += ' AND d.is_available = 1';
  }
  if (filters.search) {
    where +=
      ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR d.bio LIKE ? OR d.qualification LIKE ?)';
    const s = `%${filters.search}%`;
    params.push(s, s, s, s);
  }

  return { where, params };
};

const searchDoctors = async (filters) => {
  const page = Math.max(1, parseInt(filters.page || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(filters.limit || '10', 10)));
  const offset = (page - 1) * limit;
  const { where, params } = buildWhere(filters);

  const baseFrom = `FROM doctors d
    JOIN users u ON d.user_id = u.id
    JOIN treatment_types tt ON d.treatment_type_id = tt.id
    LEFT JOIN doctor_specializations ds ON ds.doctor_id = d.id
    LEFT JOIN specializations sp ON sp.id = ds.specialization_id
    WHERE ${where}`;

  const [countRows] = await pool.execute(
    `SELECT COUNT(DISTINCT d.id) as total ${baseFrom}`,
    params
  );
  const total = countRows[0]?.total || 0;

  const [doctors] = await pool.query(
    `SELECT d.id, d.user_id, d.treatment_type_id, d.qualification, d.experience_years,
            d.bio, d.city, d.consultation_fee, d.rating, d.rating_count, d.is_available,
            d.profile_image, tt.name as treatment_type, tt.slug as treatment_slug,
            u.first_name, u.last_name, u.email, u.phone,
            GROUP_CONCAT(DISTINCT sp.name) as specializations
     ${baseFrom}
     GROUP BY d.id
     ORDER BY d.rating DESC, d.rating_count DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    data: doctors.map(mapDoctor),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

const mapDoctor = (row) => ({
  id: row.id,
  userId: row.user_id,
  firstName: row.first_name,
  lastName: row.last_name,
  email: row.email,
  phone: row.phone,
  treatmentType: row.treatment_type,
  treatmentSlug: row.treatment_slug,
  qualification: row.qualification,
  experienceYears: row.experience_years,
  bio: row.bio,
  city: row.city,
  consultationFee: parseFloat(row.consultation_fee),
  rating: parseFloat(row.rating),
  ratingCount: row.rating_count,
  isAvailable: !!row.is_available,
  profileImage: row.profile_image,
  specializations: row.specializations ? row.specializations.split(',') : [],
});

const getDoctorById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT d.*, tt.name as treatment_type, tt.slug as treatment_slug,
            u.first_name, u.last_name, u.email, u.phone
     FROM doctors d
     JOIN users u ON d.user_id = u.id
     JOIN treatment_types tt ON d.treatment_type_id = tt.id
     WHERE d.id = ? AND d.deleted_at IS NULL`,
    [id]
  );
  if (!rows.length) throw ApiError.notFound('Doctor not found');

  const [specs] = await pool.execute(
    `SELECT sp.id, sp.name FROM doctor_specializations ds
     JOIN specializations sp ON sp.id = ds.specialization_id WHERE ds.doctor_id = ?`,
    [id]
  );
  const [diseases] = await pool.execute(
    `SELECT dis.id, dis.name FROM doctor_diseases dd
     JOIN diseases dis ON dis.id = dd.disease_id WHERE dd.doctor_id = ?`,
    [id]
  );
  const [clinics] = await pool.execute(
    `SELECT * FROM clinics WHERE doctor_id = ? AND deleted_at IS NULL`,
    [id]
  );
  const [schedules] = await pool.execute(
    `SELECT s.* FROM schedules s
     JOIN clinics c ON c.id = s.clinic_id
     WHERE c.doctor_id = ? AND s.is_active = 1`,
    [id]
  );

  return {
    ...mapDoctor(rows[0]),
    specializations: specs,
    diseases,
    clinics,
    schedules,
  };
};

const updateDoctorProfile = async (userId, data) => {
  const [doc] = await pool.execute('SELECT id FROM doctors WHERE user_id = ? AND deleted_at IS NULL', [
    userId,
  ]);
  if (!doc.length) throw ApiError.notFound('Doctor profile not found');

  const fields = [];
  const values = [];
  const allowed = [
    'qualification',
    'experience_years',
    'bio',
    'city',
    'consultation_fee',
    'is_available',
    'profile_image',
    'license_number',
  ];
  const map = {
    qualification: 'qualification',
    experienceYears: 'experience_years',
    bio: 'bio',
    city: 'city',
    consultationFee: 'consultation_fee',
    isAvailable: 'is_available',
    profileImage: 'profile_image',
    licenseNumber: 'license_number',
  };

  Object.entries(map).forEach(([key, col]) => {
    if (data[key] !== undefined) {
      fields.push(`${col} = ?`);
      values.push(data[key]);
    }
  });

  if (fields.length) {
    values.push(doc[0].id);
    await pool.execute(`UPDATE doctors SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  if (data.firstName || data.lastName || data.phone) {
    await pool.execute(
      `UPDATE users SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        phone = COALESCE(?, phone)
       WHERE id = ?`,
      [data.firstName, data.lastName, data.phone, userId]
    );
  }

  return getDoctorById(doc[0].id);
};

const getLookupData = async () => {
  const [treatmentTypes] = await pool.execute('SELECT * FROM treatment_types ORDER BY name');
  const [specializations] = await pool.execute('SELECT * FROM specializations ORDER BY name');
  const [diseases] = await pool.execute('SELECT * FROM diseases ORDER BY name');
  return { treatmentTypes, specializations, diseases };
};

module.exports = {
  searchDoctors,
  getDoctorById,
  updateDoctorProfile,
  getLookupData,
};
