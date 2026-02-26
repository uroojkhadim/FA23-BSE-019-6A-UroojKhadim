export async function extractPdfText(file) {
  const buffer = await file.arrayBuffer();
  if (!window.pdfjsLib) throw new Error('PDF.js not loaded');
  const loadingTask = window.pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  let text = '';
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const lines = content.items.map((i) => i.str).join(' ');
    text += '\n' + lines;
  }
  return text;
}
