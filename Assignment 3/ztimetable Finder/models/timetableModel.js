const TIMETABLE_URL = new URL('./mockTimetable.json', import.meta.url);

let cache = null;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function loadTimetable() {
  if (cache) return cache;
  await delay(300);
  const res = await fetch(TIMETABLE_URL);
  cache = await res.json();
  return cache;
}

function normalizeDay(day) {
  return day.map((slot) => ({
    time: slot.time,
    subject: slot.subject,
    room: slot.room,
    teacher: slot.teacher,
  }));
}

function normalizeWeekly(weekly) {
  const out = {};
  for (const day of Object.keys(weekly)) {
    out[day] = normalizeDay(weekly[day]);
  }
  return out;
}

export async function searchByClass(className) {
  const data = await loadTimetable();
  const found = data.classes.find(
    (c) => c.className.toLowerCase() === className.trim().toLowerCase()
  );
  if (!found) return null;
  return {
    type: 'class',
    className: found.className,
    weekly: normalizeWeekly(found.weekly),
  };
}

export async function searchByTeacher(name) {
  const data = await loadTimetable();
  const teacher = name.trim().toLowerCase();
  const weekly = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] };
  for (const cls of data.classes) {
    for (const [day, slots] of Object.entries(cls.weekly)) {
      for (const slot of slots) {
        if (slot.teacher.trim().toLowerCase() === teacher) {
          weekly[day].push({
            time: slot.time,
            subject: slot.subject,
            room: slot.room,
            teacher: slot.teacher,
            className: cls.className,
          });
        }
      }
    }
  }
  const hasAny =
    Object.values(weekly).reduce((acc, v) => acc + v.length, 0) > 0;
  if (!hasAny) return null;
  return { type: 'teacher', teacherName: name.trim(), weekly };
}

export function isClassPattern(q) {
  const s = q.trim();
  if (/^class:/i.test(s)) return true;
  return /\bFA\d{2}-BSE-\d+[A-Z]\b/i.test(s);
}
