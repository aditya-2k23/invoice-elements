import React, { useState } from 'react';
import { invoiceData } from './data/invoiceData';
import { EmailWrapper, getEmailHtml } from './components/EmailWrapper';
import { DocumentWrapper, getDocumentHtml } from './components/DocumentWrapper';

// Clean SVG Icon Components to eliminate heavy external icon package dependencies
const LayersIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0l-7 7m7-7l-7-7" />
  </svg>
);

const SparklesIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const MailIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const FileTextIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CopyIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const PrinterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

const CodeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const EyeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default function App() {
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'email' | 'pdf'
  const [copied, setCopied] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState('email'); // 'email' | 'pdf'

  const emailHtml = getEmailHtml(invoiceData);
  const pdfHtml = getDocumentHtml(invoiceData);

  const handleCopyEmailHtml = () => {
    navigator.clipboard.writeText(emailHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="no-print border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <LayersIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Invoice Engine</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center gap-1">
                  <SparklesIcon className="w-3 h-3" /> Unlayer Elements
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Single JSX Component Tree &rarr; Dual Output (Email HTML &amp; Print-Ready PDF)
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyEmailHtml}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 cursor-pointer"
              title="Copy email-safe HTML string to clipboard"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied Email HTML!</span>
                </>
              ) : (
                <>
                  <CopyIcon className="w-4 h-4 text-slate-400" />
                  <span>Copy Email HTML</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowCodeModal(true)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CodeIcon className="w-4 h-4 text-indigo-400" />
              <span>Inspect HTML</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PrinterIcon className="w-4 h-4" />
              <span>Download PDF / Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Navigation & View Mode Switcher */}
        <div className="no-print bg-slate-900 border border-slate-800 p-2 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('split')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                viewMode === 'split' 
                  ? 'bg-slate-800 text-white shadow border border-slate-700' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <EyeIcon className="w-4 h-4" />
              <span>Side-by-Side Dual View</span>
            </button>
            <button
              onClick={() => setViewMode('email')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                viewMode === 'email' 
                  ? 'bg-blue-600/20 text-blue-400 shadow border border-blue-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MailIcon className="w-4 h-4" />
              <span>Email Reminder Mode</span>
            </button>
            <button
              onClick={() => setViewMode('pdf')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                viewMode === 'pdf' 
                  ? 'bg-indigo-600/20 text-indigo-400 shadow border border-indigo-500/30' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileTextIcon className="w-4 h-4" />
              <span>PDF Document Mode</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2 px-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Single Source of Truth: <strong className="text-slate-200">INV-2026-0892</strong></span>
          </div>
        </div>

        {/* Dynamic Dual Preview Area */}
        <div className={`grid gap-6 flex-1 ${
          viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}>

          {/* 1. EMAIL REMINDER PREVIEW */}
          {(viewMode === 'split' || viewMode === 'email') && (
            <div className="no-print bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
              {/* Simulated Email Client Header */}
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="ml-2 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MailIcon className="w-3.5 h-3.5 text-blue-400" /> Payment Reminder Email View
                  </span>
                </div>
                <span className="text-[11px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded">
                  &lt;Email&gt; Root Wrapper
                </span>
              </div>

              {/* Email Envelope Header Meta */}
              <div className="bg-slate-950/60 px-5 py-3 border-b border-slate-800/80 text-xs text-slate-400 space-y-1">
                <div><span className="text-slate-500">From:</span> {invoiceData.company.name} &lt;{invoiceData.company.email}&gt;</div>
                <div><span className="text-slate-500">To:</span> {invoiceData.client.name} &lt;{invoiceData.client.email}&gt;</div>
                <div><span className="text-slate-500">Subject:</span> Payment Reminder: Invoice #{invoiceData.invoiceNumber} Due Aug 06</div>
              </div>

              {/* Rendered Email Body */}
              <div className="p-4 md:p-6 bg-slate-950/40 flex-1 overflow-auto flex justify-center">
                <div className="w-full max-w-[640px] shadow-2xl rounded-lg overflow-hidden border border-slate-800 bg-white text-slate-900">
                  <EmailWrapper invoice={invoiceData} />
                </div>
              </div>
            </div>
          )}

          {/* 2. PDF DOCUMENT PREVIEW (Target for window.print()) */}
          {(viewMode === 'split' || viewMode === 'pdf') && (
            <div 
              id="pdf-print-area" 
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl"
            >
              {/* Document Header Bar */}
              <div className="no-print bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-300">Print-Ready PDF Document View</span>
                </div>
                <span className="text-[11px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded">
                  &lt;Document&gt; Root Wrapper
                </span>
              </div>

              {/* Document Sheet Container */}
              <div className="p-4 md:p-6 bg-slate-950/40 flex-1 overflow-auto flex justify-center">
                <div className="w-full max-w-[800px] bg-white text-slate-900 shadow-2xl rounded-sm p-2 md:p-4 border border-slate-300">
                  <DocumentWrapper invoice={invoiceData} />
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Raw HTML Code Inspector Modal */}
      {showCodeModal && (
        <div className="no-print fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CodeIcon className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Unlayer Elements Production HTML Output</h3>
                  <p className="text-xs text-slate-400">Zero React hydration markers — raw production HTML</p>
                </div>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-white text-sm font-semibold px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                Close &#2715;
              </button>
            </div>

            {/* Modal Code Switcher */}
            <div className="bg-slate-950 px-6 py-2 border-b border-slate-800 flex items-center gap-4">
              <button
                onClick={() => setActiveCodeTab('email')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-all ${
                  activeCodeTab === 'email' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Email HTML (&lt;Email&gt; output)
              </button>
              <button
                onClick={() => setActiveCodeTab('pdf')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-all ${
                  activeCodeTab === 'pdf' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Document HTML (&lt;Document&gt; output)
              </button>
            </div>

            {/* Code Output Textarea */}
            <div className="p-6 flex-1 overflow-auto bg-slate-950">
              <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap break-all select-all p-4 bg-slate-900 rounded-lg border border-slate-800">
                {activeCodeTab === 'email' ? emailHtml : pdfHtml}
              </pre>
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs text-slate-400">
              <span>Length: {activeCodeTab === 'email' ? emailHtml.length : pdfHtml.length} chars</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeCodeTab === 'email' ? emailHtml : pdfHtml);
                  alert('HTML copied to clipboard!');
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer font-semibold"
              >
                Copy Active HTML
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
