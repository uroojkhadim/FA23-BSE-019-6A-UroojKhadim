import { searchByClass, searchByTeacher, isClassPattern } from '../models/timetableModel.js';
import { validateSearchInput, validateUpload } from '../middleware/validator.js';
import { logEvent } from '../middleware/logger.js';
import { handleError } from '../middleware/errorHandler.js';

function toUI(result) {
  if (!result) return null;
  if (result.type === 'class') {
    return {
      title: result.className,
      subtitle: 'Weekly Timetable',
      weekly: result.weekly,
    };
  }
  return {
    title: result.teacherName || result.teacher || 'Teacher',
    subtitle: 'Teacher Schedule',
    weekly: result.weekly,
  };
}

export async function handleSearch(query) {
  logEvent('search_started', { query });
  const v = validateSearchInput(query);
  if (!v.valid) return handleError(v.error);
  try {
    const isClass = isClassPattern(query);
    const data = isClass
      ? await searchByClass(query.replace(/^class:/i, '').trim())
      : await searchByTeacher(query);
    if (!data) return handleError('No results found');
    const ui = toUI(data);
    logEvent('search_completed', { query });
    return { ok: true, data: ui };
  } catch (err) {
    logEvent('search_error', { error: String(err) });
    return handleError(err);
  }
}

export async function handleUpload(file) {
  logEvent('upload_started', { name: file?.name });
  const v = validateUpload(file);
  if (!v.valid) return handleError(v.error);
  await new Promise((resolve) => setTimeout(resolve, 800));
  logEvent('upload_completed', { name: file?.name });
  return { ok: true, data: { name: file.name, size: file.size } };
}
