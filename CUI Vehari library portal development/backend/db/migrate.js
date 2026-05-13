const { sql } = require('./index');

async function migrate() {
  try {
    console.log('Starting migration...');

    // Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) NOT NULL, -- student, supervisor, librarian, admin
        department VARCHAR(50),
        reg_number VARCHAR(100),
        phone VARCHAR(50),
        supervisor_id INTEGER REFERENCES users(id), -- Assigned supervisor for students
        status VARCHAR(50) DEFAULT 'approved', -- pending, approved, rejected (Students start as pending)
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Users table ready');

    // Add indexes for performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)`;

    // Documents Table (formerly submissions)
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        supervisor_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_key TEXT NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_size BIGINT NOT NULL,
        file_url TEXT,
        status VARCHAR(50) DEFAULT 'uploaded', -- uploaded, approved, checking, completed, rejected
        reject_reason TEXT,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        approved_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE
      )
    `;
    console.log('Documents table ready');
    await sql`CREATE INDEX IF NOT EXISTS idx_documents_student ON documents(student_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status)`;

    // Reports Table
    await sql`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        librarian_id INTEGER REFERENCES users(id),
        doc_report_key TEXT, -- Plagiarism report
        doc_report_url TEXT,
        ai_report_key TEXT, -- AI detection report
        ai_report_url TEXT,
        similarity_score INTEGER,
        ai_percentage INTEGER,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Reports table ready');
    await sql`CREATE INDEX IF NOT EXISTS idx_reports_document ON reports(document_id)`;

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
