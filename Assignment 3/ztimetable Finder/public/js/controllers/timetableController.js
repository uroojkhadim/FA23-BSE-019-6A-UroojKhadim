import { searchByClass, searchByTeacher, isClassPattern, setTimetableData, hasTimetable } from '../models/timetableModel.js';
import { validateSearchInput, validateUpload } from '../middleware/validator.js';
import { logEvent } from '../middleware/logger.js';
import { handleError } from '../middleware/errorHandler.js';
import { extractPdfText } from '../lib/pdfExtractor.js';
import { stripHidden, normalizeHyphens, collapseSpaces, normalizeClassCode, isClassLike, canonicalName } from '../lib/normalize.js';

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
    if (!hasTimetable()) return handleError('Upload a timetable PDF first');
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
  try {
    const text = await extractPdfText(file);
    const data = parseTimetableText(text);
    if (!data || !data.classes?.length) return handleError('Could not parse timetable from PDF');
    setTimetableData(data);
    logEvent('upload_completed', { name: file?.name, classes: data.classes.length });
    return { ok: true, data: { name: file.name, size: file.size, classes: data.classes.length } };
  } catch (err) {
    logEvent('upload_error', { error: String(err) });
    return handleError(err);
  }
}

function parseTimetableText(text) {
  const rawLines = text.split(/\n+/).filter(Boolean);
  const lines = rawLines.map((l) => collapseSpaces(normalizeHyphens(stripHidden(l)))).filter(Boolean);
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Mon','Tue','Wed','Thu','Fri'];
  const classes = [];
  let currentClass = null;
  let currentDay = null;
  function ensureClass(name) {
    if (!currentClass || currentClass.className !== name) {
      currentClass = { className: name, weekly: { Monday:[], Tuesday:[], Wednesday:[], Thursday:[], Friday:[] } };
      classes.push(currentClass);
    }
  }
  for (const raw of lines) {
    const l = raw;
    const classMatch = isClassLike(l) ? normalizeClassCode(l).match(/\bFA\d{2}-BSE-\d+[A-Z]\b/i) : null;
    if (classMatch) {
      ensureClass(classMatch[0].toUpperCase());
      continue;
    }
    const dayMatch = days.find((d) => l.toLowerCase().includes(d.toLowerCase()));
    if (dayMatch) {
      currentDay = ({ Mon:'Monday', Tue:'Tuesday', Wed:'Wednesday', Thu:'Thursday', Fri:'Friday' }[dayMatch]) || dayMatch;
      continue;
    }
    const timeMatch = l.match(/\b\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\s*-\s*\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\b/i);
    if (timeMatch && currentClass) {
      const time = timeMatch[0];
      const rest = l.replace(time, '').trim();
      const roomMatch = rest.match(/\b[A-Z]-\d{3}\b|\bLab-\d+\b|\b[A-Z]\d{3}\b/);
      const room = roomMatch ? roomMatch[0] : 'Room';
      const subject = rest.replace(room, '').trim().split(' ').slice(0,3).join(' ') || 'Subject';
      const teacherMatch = rest.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/);
      const teacher = teacherMatch ? teacherMatch[0] : 'Teacher';
      const targetDay = currentDay || 'Monday';
      currentClass.weekly[targetDay].push({ time, subject, room, teacher });
      continue;
    }
  }
  if (!classes.length) {
    const fallback = { className: 'Uploaded Timetable', weekly: { Monday:[], Tuesday:[], Wednesday:[], Thursday:[], Friday:[] } };
    // Attempt to collect time entries without class/day headings
    for (const raw of lines) {
      const l = raw;
      const dayMatch = days.find((d) => l.toLowerCase().includes(d.toLowerCase()));
      const timeMatch = l.match(/\b\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\s*-\s*\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\b/i);
      if (dayMatch && timeMatch) {
        const time = timeMatch[0];
        const rest = l.replace(time, '').replace(dayMatch, '').trim();
        const roomMatch = rest.match(/\b[A-Z]-\d{3}\b|\bLab-\d+\b|\b[A-Z]\d{3}\b/);
        const room = roomMatch ? roomMatch[0] : 'Room';
        const subject = rest.replace(room, '').trim().split(' ').slice(0,3).join(' ') || 'Subject';
        const teacherMatch = rest.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/);
        const teacher = teacherMatch ? teacherMatch[0] : 'Teacher';
        const mapDay = ({ Mon:'Monday', Tue:'Tuesday', Wed:'Wednesday', Thu:'Thursday', Fri:'Friday' }[dayMatch]) || dayMatch;
        fallback.weekly[mapDay].push({ time, subject, room, teacher });
      }
    }
    classes.push(fallback);
  }
  const normalized = classes.map((c) => ({
    className: normalizeClassCode(c.className),
    weekly: c.weekly
  }));
  return { classes: normalized };
}
