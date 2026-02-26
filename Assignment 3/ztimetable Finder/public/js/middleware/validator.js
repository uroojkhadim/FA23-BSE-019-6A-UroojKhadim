export function validateSearchInput(input) {
  const value = (input ?? '').trim();
  if (!value) return { valid: false, error: 'Search input is required' };
  if (value.length < 2) return { valid: false, error: 'Enter at least 2 characters' };
  return { valid: true };
}

export function validateUpload(file) {
  if (!file) return { valid: false, error: 'No file selected' };
  const name = file.name?.toLowerCase() || '';
  if (!name.endsWith('.pdf')) return { valid: false, error: 'Only PDF files are allowed' };
  return { valid: true };
}
