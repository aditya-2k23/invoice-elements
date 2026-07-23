import React from 'react';
import { Email, renderToHtml } from '@unlayer/react-elements';
import { InvoiceContent } from './InvoiceContent';

export function EmailWrapper({ invoice }) {
  return (
    <Email
      backgroundColor="#f1f5f9"
      contentWidth="640px"
      previewText={`Payment Reminder for Invoice #${invoice.invoiceNumber} from ${invoice.company.name}`}
    >
      <InvoiceContent invoice={invoice} mode="email" />
    </Email>
  );
}

export function getEmailHtml(invoice) {
  return renderToHtml(<EmailWrapper invoice={invoice} />);
}
