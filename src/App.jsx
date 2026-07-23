import { useState, useEffect } from "react";
import {
  FileText,
  Mail,
  Eye,
  ExternalLink,
  Info,
  Send,
  RefreshCw,
  Edit,
  CornerDownLeft,
  Command,
  Loader2,
} from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { invoiceData, calculateTotals } from "./data/invoiceData";
import { EmailWrapper, getEmailHtml } from "./components/EmailWrapper";
import { DocumentWrapper, getDocumentHtml } from "./components/DocumentWrapper";
import { InvoiceForm } from "./components/InvoiceForm";

// Demo Data Presets
const demoFreelance = {
  ...invoiceData,
  invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  company: {
    ...invoiceData.company,
    name: "Alex Dev",
    tagline: "Full-Stack Web Development",
    email: "alex@dev.local",
  },
  client: {
    ...invoiceData.client,
    name: "Startup Inc",
    company: "NextGen Software",
    email: "billing@startup.local",
  },
  items: [
    {
      id: 1,
      title: "Frontend Development",
      details: "React application build",
      quantity: 40,
      unitPrice: 75.0,
    },
    {
      id: 2,
      title: "Backend API",
      details: "Node.js endpoints",
      quantity: 20,
      unitPrice: 85.0,
    },
  ],
};

const demoAgency = {
  ...invoiceData,
  invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  company: {
    ...invoiceData.company,
    name: "Creative Spark Agency",
    tagline: "Marketing & Strategy",
    email: "hello@creativespark.local",
  },
  client: {
    ...invoiceData.client,
    name: "Retail Corp",
    company: "Global Goods",
    email: "accounts@retailcorp.local",
  },
  items: [
    {
      id: 1,
      title: "Q3 Marketing Retainer",
      details: "Monthly social media & ads management",
      quantity: 1,
      unitPrice: 5000.0,
    },
    {
      id: 2,
      title: "Ad Spend Reimbursement",
      details: "Google Ads (July)",
      quantity: 1,
      unitPrice: 1250.0,
    },
  ],
};

const demoGoods = {
  ...invoiceData,
  invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  company: {
    ...invoiceData.company,
    name: "Artisan Coffee Roasters",
    tagline: "Wholesale Beans",
    email: "orders@artisancoffee.local",
  },
  client: {
    ...invoiceData.client,
    name: "Local Cafe",
    company: "Morning Brews LLC",
    email: "manager@localcafe.local",
  },
  items: [
    {
      id: 1,
      title: "Espresso Blend (5lb bags)",
      details: "Dark roast",
      quantity: 10,
      unitPrice: 65.0,
    },
    {
      id: 2,
      title: "Single Origin Ethiopia (5lb bags)",
      details: "Light roast",
      quantity: 5,
      unitPrice: 80.0,
    },
    {
      id: 3,
      title: "Wholesale Shipping",
      details: "Next day delivery",
      quantity: 1,
      unitPrice: 25.0,
    },
  ],
};

export default function App() {
  const [invoice, setInvoice] = useState(invoiceData);
  const [viewMode, setViewMode] = useState("split"); // 'split' | 'email' | 'pdf'
  const [showFormModal, setShowFormModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);

  // Derive HTML for exports using LIVE state
  const emailHtml = getEmailHtml(invoice);
  const pdfHtml = getDocumentHtml(invoice);

  // Basic Validation
  const isValid =
    invoice.client.name?.trim() !== "" &&
    invoice.client.email?.trim() !== "" &&
    invoice.items.length > 0 &&
    invoice.items.every(
      (i) => i.title?.trim() !== "" && i.quantity > 0 && i.unitPrice >= 0,
    );

  // Keyboard Shortcuts for Modal
  useEffect(() => {
    if (!showFormModal) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowFormModal(false);
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        setShowFormModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFormModal]);

  const handleDownloadPdf = async () => {
    if (!isValid || isGeneratingPdf) return;

    const element = document.getElementById("pdf-content-wrapper");
    if (!element) return;

    setIsGeneratingPdf(true);

    try {
      // 1. Convert the DOM element to a high-quality PNG
      // We set a slightly larger scale (pixelRatio) for better PDF text clarity
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      // Calculate exact dimensions in CSS pixels
      const width = element.offsetWidth;
      const height = element.offsetHeight;

      // 2. Initialize jsPDF with dynamic dimensions matching the element
      const pdf = new jsPDF({
        orientation: width > height ? "landscape" : "portrait",
        unit: "px",
        format: [width, height],
      });

      pdf.setProperties({
        title: `Invoice - ${invoice.client.name}`,
      });

      // 3. Add image and open in new tab
      // Drawing a 2x resolution image into a 1x size box gives crisp Retina-quality text!
      pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
      const pdfBlobUrl = pdf.output("bloburl");
      window.open(pdfBlobUrl, "_blank");
    } catch (err) {
      console.error("Failed to generate PDF", err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendInvoice = () => {
    if (!isValid || isSendingInvoice) return;
    setIsSendingInvoice(true);

    const totals = calculateTotals(invoice);
    const subject = encodeURIComponent(
      `Invoice #${invoice.invoiceNumber} from ${invoice.company.name}`,
    );
    const body = encodeURIComponent(
      `Hi ${invoice.client.name},\n\nPlease find the details for Invoice #${invoice.invoiceNumber} below.\n\nDue Date: ${invoice.dueDate}\nTotal Due: ${totals.totalAmount}\n\nFull formatted invoice HTML is available via Copy Email HTML.\n\nThank you,\n${invoice.company.name}`,
    );

    window.location.href = `mailto:${invoice.client.email}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setIsSendingInvoice(false);
    }, 2500);
  };

  // Event delegation to intercept click on "Pay Invoice Online" button in rendered HTML
  const handlePreviewClick = (e) => {
    const link = e.target.closest('a[href*="pay.apexdigital.io"]');
    if (link) {
      e.preventDefault();
      setNotification(
        "This would open a secure payment gateway in production.",
      );
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleReset = () => {
    setInvoice(JSON.parse(JSON.stringify(invoiceData)));
  };

  const handleLoadPreset = (presetData) => {
    setInvoice(JSON.parse(JSON.stringify(presetData)));
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
            <div className="w-9 h-9 rounded-lg bg-slate-800  flex items-center justify-center text-slate-200">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold tracking-tight text-white">
                Invoice Studio
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-medium bg-slate-800 text-slate-300  rounded-md">
                Unlayer Elements
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {!isValid && (
              <span className="text-xs text-red-400 mr-2 flex items-center gap-1">
                <Info className="w-3 h-3" /> Missing required fields
              </span>
            )}

            <button
              onClick={() => setShowFormModal(true)}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-900/50 border-none mr-2"
            >
              <Edit className="w-4 h-4" />
              <span>New Invoice</span>
            </button>

            <button
              onClick={handleSendInvoice}
              disabled={!isValid || isSendingInvoice}
              className={`px-3.5 py-1.5 min-w-32 justify-center text-xs font-medium rounded-lg border-none transition-all flex items-center gap-2 ${isValid && !isSendingInvoice ? "bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer " : "bg-slate-800 text-slate-500 cursor-not-allowed "}`}
              title="Send via default mail client"
            >
              {isSendingInvoice ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isSendingInvoice ? "Sending..." : "Send Invoice"}
              </span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={!isValid || isGeneratingPdf}
              className={`px-3.5 py-1.5 min-w-30 justify-center text-xs font-medium border-none rounded-lg transition-all flex items-center gap-2 ${isValid && !isGeneratingPdf ? "bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
              title="Open PDF in new tab"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              ) : (
                <ExternalLink className="w-4 h-4 text-slate-400" />
              )}
              <span className="hidden sm:block">
                {isGeneratingPdf ? "Generating..." : "Open PDF"}
              </span>
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
                  ? "bg-slate-800 text-white shadow-xs"
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
                  ? "bg-slate-800 text-blue-400  shadow-xs"
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
                  ? "bg-slate-800 text-indigo-400 shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>PDF Document</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 px-3 hidden sm:block">
            Invoice:{" "}
            <span className="font-mono text-slate-200 font-medium">
              {invoice.invoiceNumber || "Untitled"}
            </span>
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
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> Payment
                    Reminder Email
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
                  {invoice.company.name} &lt;{invoice.company.email}&gt;
                </div>
                <div>
                  <span className="text-slate-500">To:</span>{" "}
                  {invoice.client.name} &lt;{invoice.client.email}&gt;
                </div>
                <div>
                  <span className="text-slate-500">Subject:</span> Payment
                  Reminder: Invoice #{invoice.invoiceNumber}
                </div>
              </div>

              {/* Rendered Email Body */}
              <div className="p-4 md:p-6 bg-slate-950/40 flex-1 overflow-auto flex justify-center">
                <div className="w-full max-w-160 shadow-xl rounded-lg overflow-hidden border border-slate-800 bg-white text-slate-900 mx-auto">
                  <EmailWrapper invoice={invoice} />
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
                <div
                  id="pdf-content-wrapper"
                  className="w-full max-w-200 bg-white text-slate-900 shadow-xl rounded-xs p-2 md:p-4 border border-slate-300 mx-auto"
                >
                  <DocumentWrapper invoice={invoice} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Form Editor Modal */}
      {showFormModal && (
        <div
          className="no-print fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={() => setShowFormModal(false)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Edit Invoice Details
                </h2>
                <p className="text-xs text-slate-400">
                  Update data to generate the invoice
                </p>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors"
              >
                Close &#2715;
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Demo Presets
                </label>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset to default sample data"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => handleLoadPreset(demoFreelance)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-colors"
                >
                  Freelance
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset(demoAgency)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-colors"
                >
                  Agency
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset(demoGoods)}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer transition-colors"
                >
                  Wholesale
                </button>
              </div>

              <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end shrink-0">
              <button
                onClick={() => setShowFormModal(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-md shadow-indigo-900/50 cursor-pointer flex items-center gap-2 group"
                title="Generate Invoices (Ctrl + Enter)"
              >
                <span>Generate Invoices</span>
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-medium bg-indigo-700/50 text-indigo-100 rounded border border-indigo-400/30 group-hover:bg-indigo-600/50 transition-colors">
                  <Command className="w-3.5 h-3.5" />
                  <span className="text-[10px] opacity-70">+</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </kbd>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
