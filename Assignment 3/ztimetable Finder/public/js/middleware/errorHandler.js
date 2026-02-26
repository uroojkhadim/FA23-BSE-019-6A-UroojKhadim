export function handleError(err) {
  const message =
    typeof err === 'string'
      ? err
      : err?.message || 'Unexpected error';
  return { ok: false, error: message };
}
