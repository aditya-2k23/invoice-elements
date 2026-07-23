# Unlayer Elements Dual-Mode Invoice Generator 🚀

> **Write Once, Render Many** — A hackathon application built with [Unlayer Elements (`@unlayer/react-elements`)](https://github.com/unlayer/elements) demonstrating single-source React component rendering for both email-safe HTML reminders and print-ready PDF invoices.

---

## 📸 Demo Preview

> [!NOTE]
> _screenshot/GIF goes here_

---

## 🌟 What & Why

When building transactional workflows (e.g. e-commerce, billing, SaaS invoicing), developers usually maintain two separate templates:

1. An HTML email template for payment reminders or receipts.
2. A separate PDF or print document template for formal accounting.

This leads to duplicated logic, inconsistent styling, and high maintenance overhead.

**This project solves that problem** using **Unlayer Elements**:

- **Single Source of Truth**: A single invoice JavaScript data model (`src/data/invoiceData.js`).
- **Single Component Tree**: One shared React component tree (`src/components/InvoiceContent.jsx`) built with Elements primitives (`Row`, `Column`, `Table`, `Heading`, `Paragraph`, `Divider`, `Button`).
- **Dual Output**:
  - **Payment Reminder Email**: Wrapped in `<Email>`, rendered to email-safe production HTML with `renderToHtml()`.
  - **PDF Invoice**: Wrapped in `<Document>`, rendered to print-optimized HTML and printed directly via the browser's native `window.print()` engine using `@media print` rules.

---

## 🛠️ Architecture & Key Rules

1. **Tailwind CSS Boundary**:
   - Tailwind CSS (v4) is strictly isolated to the outer application shell (header, view switcher, action toolbar, side-by-side containers, code modal).
   - The invoice content tree uses **zero** Tailwind classes. Everything inside `<Email>` and `<Document>` uses Unlayer Elements' native style props (`backgroundColor`, `color`, `fontSize`, `padding`, `border`, etc.) to ensure HTML output survives email client rendering and print engines without relying on external CSS frameworks.

2. **Strict Structural Layout Compliance**:
   - Unlayer Elements enforces exact column matching. Every `<Row layout={ColumnLayouts...}>` in `InvoiceContent.jsx` contains the precise number of `<Column>` children required by that layout configuration (e.g. `ColumnLayouts.TwoEqual` strictly contains 2 `<Column>` components).

3. **Zero Heavy Heavyweight PDF Dependencies**:
   - Uses Elements' `<Document>` root wrapper paired with native `@media print` CSS for instant, lightweight print-to-PDF output via `window.print()`.

---

## 🚦 Installation & Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Quickstart

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

   Open your browser at `http://localhost:5173`.

3. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
invoice-elements/
├── src/
│   ├── data/
│   │   └── invoiceData.js      # Central invoice data model & financial calculations
│   ├── components/
│   │   ├── InvoiceContent.jsx  # Shared Unlayer Elements component tree
│   │   ├── EmailWrapper.jsx    # <Email> root wrapper + getEmailHtml()
│   │   └── DocumentWrapper.jsx # <Document> root wrapper + getDocumentHtml()
│   ├── App.jsx                 # App shell UI, view modes, Copy HTML, Print PDF
│   ├── main.jsx                # App entrypoint
│   └── index.css               # Tailwind CSS v4 setup & @media print stylesheet
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚡ Tech Stack

- **Core**: React 19 + Vite 6
- **Template System**: `@unlayer/react-elements`
- **Shell Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Icons**: `lucide-react`
