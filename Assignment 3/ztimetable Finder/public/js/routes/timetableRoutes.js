import { handleSearch, handleUpload } from '../controllers/timetableController.js';

export async function getSearch(query) {
  await new Promise((r) => setTimeout(r, 150));
  return handleSearch(query);
}

export async function postUpload(file) {
  await new Promise((r) => setTimeout(r, 150));
  return handleUpload(file);
}
