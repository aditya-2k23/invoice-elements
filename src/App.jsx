import { useState } from "react";
import {
  FileText,
  Mail,
  Eye,
  Copy,
  Check,
  Printer,
  Code,
  Info,
} from "lucide-react";
import { invoiceData } from "./data/invoiceData";
import { EmailWrapper, getEmailHtml } from "./components/EmailWrapper";
import { DocumentWrapper, getDocumentHtml } from "./components/DocumentWrapper";

export default function App() {
  const [viewMode, setViewMode] = useState("split"); // 'split' | 'email' | 'pdf'
  const [copied, setCopied] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState("email"); // 'email' | 'pdf'
  const [notification, setNotification] = useState(null);

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

  // Event delegation to intercept click on "Pay Invoice Online" button in rendered HTML
  const handlePreviewClick = (e) => {
    const link = e.target.closest('a[href*="pay.apexdigital.io"]');
    if (link) {
      e.preventDefault();
      setNotification("This would open a secure payment gateway in production.");
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification for Intercepted Actions */}
      {notification && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-400 flex items-center gap-3 animate-fade-in">
          <Info className="w-5 h-5 text-indigo-200 shrink-0" />
          <span className="text-xs font-semibold">{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-indigo-200 hover:text-white text-xs font-bold"
          >
            &#2715;
          </button>
        </div>
      )}

      {/* Header Bar */}
      <header className="no-print border-b border-slate-800 bg-slate-900/90 sticky top-0 z-40 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold tracking-tight text-white">
                Invoice Studio
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
                Unlayer Elements
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyEmailHtml}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              title="Copy email-safe HTML string to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied Email HTML</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy Email HTML</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowCodeModal(true)}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Code className="w-4 h-4 text-slate-400" />
              <span>Inspect Output</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        {/* Navigation & View Mode Switcher */}
        <div className="no-print bg-slate-900 border border-slate-800 p-1.5 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 w-full sm:w-auto">
            <button
              onClick={() => setViewMode("split")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === "split"
                  ? "bg-slate-800 text-white border border-slate-700 shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Side-by-Side View</span>
            </button>
            <button
              onClick={() => setViewMode("email")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === "email"
                  ? "bg-slate-800 text-blue-400 border border-slate-700 shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Reminder</span>
            </button>
            <button
              onClick={() => setViewMode("pdf")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                viewMode === "pdf"
                  ? "bg-slate-800 text-indigo-400 border border-slate-700 shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>PDF Document</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 px-3 hidden sm:block">
            Invoice: <span className="font-mono text-slate-200 font-medium">INV-2026-0892</span>
          </div>
        </div>

        {/* Dynamic Dual Preview Area */}
        <div
          onClick={handlePreviewClick}
          className={`grid gap-6 flex-1 ${
            viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* 1. EMAIL REMINDER PREVIEW */}
          {(viewMode === "split" || viewMode === "email") && (
            <div className="no-print bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-lg">
              {/* Simulated Email Client Header */}
              <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <span className="ml-2 text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> Payment Reminder Email
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  &lt;Email&gt;
                </span>
              </div>

              {/* Email Envelope Header Meta */}
              <div className="bg-slate-950/60 px-5 py-2.5 border-b border-slate-800/80 text-xs text-slate-400 space-y-1">
                <div>
                  <span className="text-slate-500">From:</span>{" "}
                  {invoiceData.company.name} &lt;{invoiceData.company.email}&gt;
                </div>
                <div>
                  <span className="text-slate-500">To:</span>{" "}
                  {invoiceData.client.name} &lt;{invoiceData.client.email}&gt;
                </div>
                <div>
                  <span className="text-slate-500">Subject:</span> Payment
                  Reminder: Invoice #{invoiceData.invoiceNumber}
                </div>
              </div>

              {/* Rendered Email Body */}
              <div className="p-4 md:p-6 bg-slate-950/40 flex-1 overflow-auto flex justify-center">
                <div className="w-full max-w-160 shadow-xl rounded-lg overflow-hidden border border-slate-800 bg-white text-slate-900">
                  <EmailWrapper invoice={invoiceData} />
                </div>
              </div>
            </div>
          )}

          {/* 2. PDF DOCUMENT PREVIEW */}
          {(viewMode === "split" || viewMode === "pdf") && (
            <div
              id="pdf-print-area"
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-lg"
            >
              {/* Document Header Bar */}
              <div className="no-print bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-medium text-slate-300">
                    PDF Document
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  &lt;Document&gt;
                </span>
              </div>

              {/* Document Sheet Container */}
              <div className="p-4 md:p-6 bg-slate-950/40 flex-1 overflow-auto flex justify-center">
                <div className="w-full max-w-200 bg-white text-slate-900 shadow-xl rounded-xs p-2 md:p-4 border border-slate-300">
                  <DocumentWrapper invoice={invoiceData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Raw HTML Code Inspector Modal */}
      {showCodeModal && (
        <div className="no-print fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="px-6 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Unlayer Elements HTML Output
                  </h3>
                  <p className="text-xs text-slate-400">
                    Production HTML output from renderToHtml()
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
              >
                Close &#2715;
              </button>
            </div>

            {/* Modal Code Switcher */}
            <div className="bg-slate-950 px-6 py-2 border-b border-slate-800 flex items-center gap-3">
              <button
                onClick={() => setActiveCodeTab("email")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-all ${
                  activeCodeTab === "email"
                    ? "bg-slate-800 text-blue-400 border border-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Email HTML (&lt;Email&gt;)
              </button>
              <button
                onClick={() => setActiveCodeTab("pdf")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer transition-all ${
                  activeCodeTab === "pdf"
                    ? "bg-slate-800 text-indigo-400 border border-slate-700"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Document HTML (&lt;Document&gt;)
              </button>
            </div>

            {/* Code Output Textarea */}
            <div className="p-6 flex-1 overflow-auto bg-slate-950">
              <pre className="text-xs font-mono text-emerald-400 whitespace-pre-wrap break-all select-all p-4 bg-slate-900 rounded-lg border border-slate-800">
                {activeCodeTab === "email" ? emailHtml : pdfHtml}
              </pre>
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs text-slate-400">
              <span>
                Length:{" "}
                {activeCodeTab === "email" ? emailHtml.length : pdfHtml.length}{" "}
                chars
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    activeCodeTab === "email" ? emailHtml : pdfHtml
                  );
                  alert("HTML copied to clipboard!");
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer font-medium"
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
