# Invoice Elements

A dual-mode invoice generator built with [Unlayer Elements](https://github.com/unlayer/elements) — one React component tree, rendered as both a payment reminder email and a print-ready PDF invoice.

Built for Unlayer's **Build with Elements Challenge**.

## The problem this solves

Most invoicing systems maintain two separate templates: an HTML email for reminders and receipts, and a separate PDF or print layout for the actual document. Same data, same branding, two codebases to keep in sync.

Unlayer Elements renders the same JSX tree to email-safe HTML, responsive web HTML, or print-ready HTML. This project uses that to define the invoice once and generate both outputs from it. It's also a use case you won't currently find in Unlayer's own [template gallery](https://unlayer.com/templates) — that gallery is entirely HTML email templates, with nothing showing the document/PDF side of Elements.

## Screenshots

_Add screenshot or GIF here before submitting — side-by-side of the email view and PDF view is the clearest way to show what this does._

## How it works

- `src/data/invoiceData.js` — the single source of truth. Company info, client info, line items, tax, totals. Everything downstream reads from this one object.
- `src/components/InvoiceContent.jsx` — the shared component tree, built entirely with Elements primitives (`Row`, `Column`, `Table`, `Heading`, `Paragraph`, `Divider`, `Button`). This file doesn't know or care which output mode it ends up in.
- `src/components/EmailWrapper.jsx` — wraps `InvoiceContent` in Elements' `<Email>` root and calls `renderToHtml()` to produce email-safe markup.
- `src/components/DocumentWrapper.jsx` — wraps the same `InvoiceContent` in Elements' `<Document>` root and produces print-ready HTML.
- `src/App.jsx` — the app shell: view switcher, copy-HTML button, print/download button. This is the only part of the app that uses Tailwind.

Two rules kept the content tree honest during development:

1. **No Tailwind inside `<Email>` or `<Document>`.** Everything in the invoice content uses Elements' own style props (`backgroundColor`, `fontSize`, `padding`, etc.), because that markup has to survive actual email clients and print engines — Tailwind classes don't make it through that pipeline. Tailwind is scoped to the app shell only.
2. **Row/Column counts have to match exactly.** Elements enforces this — a `Row` with `layout={ColumnLayouts.TwoEqual}` needs exactly 2 `Column` children, no more, no less.

PDF export doesn't use a PDF library. `<Document>` produces print-ready HTML, and the "Download PDF" button just triggers the browser's native `window.print()` against that view, with `@media print` rules in `index.css` hiding the app chrome and isolating the invoice.

## Running it

```powershell
npm install
npm run dev
```

Opens at `http://localhost:5173`.

```powershell
npm run build     # production build
npm run preview   # preview the production build locally
```

## Stack

React 19, Vite, `@unlayer/react-elements`, Tailwind CSS v4, lucide-react for icons.
