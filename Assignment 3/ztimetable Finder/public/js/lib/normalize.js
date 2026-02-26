export function stripHidden(s) {
  return String(s).replace(/[\u00A0\u2000-\u200D\u2060\uFEFF]/g, ' ');
}

export function normalizeHyphens(s) {
  return String(s).replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-');
}

export function collapseSpaces(s) {
  return String(s).replace(/\s+/g, ' ').trim();
}

export function canonicalName(s) {
  const t = collapseSpaces(normalizeHyphens(stripHidden(s)));
  return t.toLowerCase();
}

export function normalizeClassCode(s) {
  let t = normalizeHyphens(stripHidden(s));
  t = t.replace(/\s*-\s*/g, '-');
  t = collapseSpaces(t).toUpperCase();
  return t;
}

export function isClassLike(s) {
  const t = normalizeHyphens(stripHidden(s));
  return /\bFA\d{2}\s*[- ]\s*BSE\s*[- ]\s*\d+[A-Z]\b/i.test(t);
}
