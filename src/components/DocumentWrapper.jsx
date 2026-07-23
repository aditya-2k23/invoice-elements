import React from 'react';
import { Document, renderToHtml } from '@unlayer/react-elements';
import { InvoiceContent } from './InvoiceContent';

export function DocumentWrapper({ invoice }) {
  return (
    <Document
      backgroundColor="#ffffff"
      contentWidth="800px"
    >
      <InvoiceContent invoice={invoice} mode="document" />
    </Document>
  );
}

export function getDocumentHtml(invoice) {
  return renderToHtml(<DocumentWrapper invoice={invoice} />);
}
