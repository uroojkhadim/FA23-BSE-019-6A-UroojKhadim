import { canonicalName, normalizeClassCode, isClassLike } from '../lib/normalize.js';
 
let timetableData = null;
let timetableEntries = [];
export function setTimetableData(data) {
  timetableData = data;
  timetableEntries = buildEntries(data);
}
export function hasTimetable() {
  return !!timetableData;
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

function buildEntries(data) {
  const entries = [];
  for (const cls of data.classes) {
    const classCode = normalizeClassCode(cls.className);
    for (const [day, slots] of Object.entries(cls.weekly)) {
      for (const slot of slots) {
        entries.push({
          className: cls.className,
          classCode,
          day,
          time: slot.time,
          subject: slot.subject,
          room: slot.room,
          teacher: slot.teacher,
          teacherCanonical: canonicalName(slot.teacher),
        });
      }
    }
  }
  return entries;
}

function groupToWeekly(entries) {
  const weekly = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] };
  for (const e of entries) {
    const day = weekly[e.day] ? e.day : 'Monday';
    weekly[day].push({
      time: e.time,
      subject: e.subject,
      room: e.room,
      teacher: e.teacher,
      className: e.className,
    });
  }
  return weekly;
}

export async function searchByClass(className) {
  if (!timetableEntries.length) return null;
  const qCode = normalizeClassCode(className);
  const matches = timetableEntries.filter(
    (e) => e.classCode === qCode || e.classCode.includes(qCode)
  );
  if (!matches.length) return null;
  const title = matches[0].className;
  return { type: 'class', className: title, weekly: groupToWeekly(matches) };
}

export async function searchByTeacher(name) {
  if (!timetableEntries.length) return null;
  const teacher = canonicalName(name);
  const matches = timetableEntries.filter(
    (e) => e.teacherCanonical === teacher || e.teacherCanonical.includes(teacher)
  );
  if (!matches.length) return null;
  return { type: 'teacher', teacherName: name.trim(), weekly: groupToWeekly(matches) };
}

export function isClassPattern(q) {
  const s = q.trim();
  if (/^class:/i.test(s)) return true;
  return isClassLike(s);
}
