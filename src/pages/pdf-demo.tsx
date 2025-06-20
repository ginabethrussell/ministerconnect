import React, { useState } from 'react';
import PDFViewer from '../components/PDFViewer';
import { PDF_FILES, getPDFById, getPDFsByCategory } from '../utils/pdfUtils';

export default function PDFDemo() {
  const [selectedPDF, setSelectedPDF] = useState<string>('');
  const [pdfViewer, setPdfViewer] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
  }>({
    isOpen: false,
    url: '',
    title: '',
  });

  const handleViewPDF = (pdfPath: string, title: string) => {
    setPdfViewer({
      isOpen: true,
      url: pdfPath,
      title,
    });
  };

  const resumePDFs = getPDFsByCategory('resume');

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-efcaDark mb-4">PDF Integration Demo</h1>
          <p className="text-gray-600">
            This page demonstrates different ways to use PDF files from the public folder in your application.
          </p>
        </header>

        {/* Method 1: Direct Links */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-efcaDark mb-4">Method 1: Direct PDF Links</h2>
          <p className="text-gray-600 mb-4">
            Simple links that open PDFs in a new tab or download them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PDF_FILES.map((pdf) => (
              <div key={pdf.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{pdf.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{pdf.description}</p>
                <div className="flex gap-2">
                  <a
                    href={pdf.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-efcaAccent text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Open in New Tab
                  </a>
                  <button
                    onClick={() => handleViewPDF(pdf.path, pdf.title)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors"
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Method 2: Embedded iframe */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-efcaDark mb-4">Method 2: Embedded PDF Viewer</h2>
          <p className="text-gray-600 mb-4">
            PDF embedded directly in the page using an iframe.
          </p>
          <div className="mb-4">
            <select
              value={selectedPDF}
              onChange={(e) => setSelectedPDF(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-efcaAccent"
            >
              <option value="">Select a PDF to view</option>
              {PDF_FILES.map((pdf) => (
                <option key={pdf.id} value={pdf.path}>
                  {pdf.title}
                </option>
              ))}
            </select>
          </div>
          {selectedPDF && (
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={selectedPDF}
                className="w-full h-96 border-0"
                title="Embedded PDF"
              />
            </div>
          )}
        </section>

        {/* Method 3: Mock Candidate Profiles */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-efcaDark mb-4">Method 3: Mock Candidate Profiles</h2>
          <p className="text-gray-600 mb-4">
            How PDFs are used in candidate profiles with preview functionality.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumePDFs.map((pdf, index) => (
              <div key={pdf.id} className="border rounded-lg p-4">
                <div className="font-bold text-lg mb-1">Candidate {index + 1}</div>
                <div className="text-sm text-gray-600 mb-2">Sample Candidate</div>
                <div className="text-xs text-gray-500 mb-3">
                  Resume: {pdf.title}
                </div>
                <div className="flex gap-2">
                  <a
                    href={pdf.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-efcaAccent underline text-xs"
                  >
                    View Resume
                  </a>
                  <button
                    onClick={() => handleViewPDF(pdf.path, `Candidate ${index + 1}'s Resume`)}
                    className="text-efcaAccent underline text-xs"
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Method 4: File Management */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-efcaDark mb-4">Method 4: File Management</h2>
          <p className="text-gray-600 mb-4">
            Utility functions for managing PDF files programmatically.
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Available PDF Files:</h3>
            <ul className="space-y-1 text-sm">
              {PDF_FILES.map((pdf) => (
                <li key={pdf.id} className="flex justify-between items-center">
                  <span>{pdf.title}</span>
                  <span className="text-gray-500">{pdf.filename}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <PDFViewer
        isOpen={pdfViewer.isOpen}
        onClose={() => setPdfViewer(prev => ({ ...prev, isOpen: false }))}
        pdfUrl={pdfViewer.url}
        title={pdfViewer.title}
      />
    </div>
  );
} 