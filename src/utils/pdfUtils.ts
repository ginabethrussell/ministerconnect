// PDF file management utilities

export interface PDFFile {
  id: string;
  filename: string;
  path: string;
  title: string;
  description?: string;
  category?: string;
}

// Available PDF files in the public folder
export const PDF_FILES: PDFFile[] = [
  {
    id: 'student-pastor-resume',
    filename: 'student-pastor-resume.pdf',
    path: '/student-pastor-resume.pdf',
    title: 'Student Pastor Resume',
    description: 'Sample resume for a student pastor position',
    category: 'resume'
  },
  {
    id: 'assistant-pastor-resume',
    filename: 'assistant-pastor-resume.pdf',
    path: '/assistant-pastor-resume.pdf',
    title: 'Assistant Pastor Resume',
    description: 'Sample resume for an assistant pastor position',
    category: 'resume'
  }
];

// Get PDF file by ID
export const getPDFById = (id: string): PDFFile | undefined => {
  return PDF_FILES.find(pdf => pdf.id === id);
};

// Get PDF file by filename
export const getPDFByFilename = (filename: string): PDFFile | undefined => {
  return PDF_FILES.find(pdf => pdf.filename === filename);
};

// Get all PDFs by category
export const getPDFsByCategory = (category: string): PDFFile[] => {
  return PDF_FILES.filter(pdf => pdf.category === category);
};

// Get random PDF for mock data
export const getRandomPDF = (): PDFFile => {
  const randomIndex = Math.floor(Math.random() * PDF_FILES.length);
  return PDF_FILES[randomIndex];
};

// Generate mock resume URL for candidates
export const generateMockResumeUrl = (candidateName: string): string => {
  // Use different PDFs based on candidate name or random selection
  const pdfs = PDF_FILES.filter(pdf => pdf.category === 'resume');
  const randomPdf = pdfs[Math.floor(Math.random() * pdfs.length)];
  return randomPdf.path;
}; 