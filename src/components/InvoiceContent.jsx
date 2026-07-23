import React from 'react';
import {
  Row,
  Column,
  ColumnLayouts,
  Heading,
  Paragraph,
  Table,
  Divider,
  Button
} from '@unlayer/react-elements';
import { calculateTotals } from '../data/invoiceData';

/**
 * Shared InvoiceContent tree built strictly with @unlayer/react-elements components.
 * 
 * Rules applied:
 * 1. NO Tailwind CSS classes inside this file — only Elements' native style props.
 * 2. Every <Row layout={...}> contains EXACTLY the number of <Column> children matching layout.
 * 3. Rendered as both Email-safe HTML and Print-ready PDF.
 */
export function InvoiceContent({ invoice, mode = 'document' }) {
  const totals = calculateTotals(invoice);

  // Format line items for Elements <Table> (headers + 2D string matrix)
  const tableHeaders = ["Item Description", "Qty", "Unit Price", "Total Amount"];
  const tableRows = invoice.items.map(item => [
    `${item.description} - ${item.details}`,
    String(item.quantity),
    `${invoice.currency}${item.unitPrice.toFixed(2)}`,
    `${invoice.currency}${(item.quantity * item.unitPrice).toFixed(2)}`
  ]);

  const isEmail = mode === 'email';

  return (
    <>
      {/* 1. Optional Email Payment Reminder Banner */}
      {isEmail && (
        <Row layout={ColumnLayouts.OneColumn} backgroundColor="#eff6ff" padding="16px">
          <Column backgroundColor="#eff6ff" padding="12px">
            <Heading level="h4" color="#1e40af" fontSize="16px" fontWeight="bold" textAlign="center">
              Payment Reminder: Invoice #{invoice.invoiceNumber}
            </Heading>
            <Paragraph color="#1e3a8a" fontSize="14px" textAlign="center" lineHeight="1.5">
              Friendly notice: Your invoice from <strong>{invoice.company.name}</strong> is due on <strong>{invoice.dueDate}</strong>. 
              Please review the details below.
            </Paragraph>
          </Column>
        </Row>
      )}

      {/* 2. Header: Company Info & Invoice Metadata */}
      <Row layout={ColumnLayouts.TwoEqual} backgroundColor="#ffffff" padding="30px 24px 10px 24px">
        <Column padding="0px">
          <Heading level="h2" color="#0f172a" fontSize="24px" fontWeight="bold">
            {invoice.company.name}
          </Heading>
          <Paragraph color="#64748b" fontSize="13px" lineHeight="1.4">
            {invoice.company.tagline}
          </Paragraph>
          <Paragraph color="#475569" fontSize="12px" lineHeight="1.4">
            {invoice.company.address}<br />
            {invoice.company.cityStateZip}<br />
            Email: {invoice.company.email} | Tax ID: {invoice.company.taxId}
          </Paragraph>
        </Column>

        <Column padding="0px">
          <Heading level="h1" color={isEmail ? "#2563eb" : "#0f172a"} fontSize="28px" fontWeight="bold" textAlign="right">
            {isEmail ? "PAYMENT REMINDER" : "INVOICE"}
          </Heading>
          <Paragraph color="#334155" fontSize="13px" textAlign="right" lineHeight="1.6">
            <strong>Invoice #:</strong> {invoice.invoiceNumber}<br />
            <strong>Date Issued:</strong> {invoice.issueDate}<br />
            <strong>Due Date:</strong> {invoice.dueDate}<br />
            <strong>Status:</strong> <span style={{ color: '#d97706', fontWeight: 'bold' }}>{invoice.status}</span>
          </Paragraph>
        </Column>
      </Row>

      {/* 3. Divider */}
      <Row layout={ColumnLayouts.OneColumn} backgroundColor="#ffffff" padding="0px 24px">
        <Column padding="0px">
          <Divider borderTopWidth="2px" borderTopColor="#e2e8f0" borderTopStyle="solid" padding="10px 0px" />
        </Column>
      </Row>

      {/* 4. Client & Payment Target Details */}
      <Row layout={ColumnLayouts.TwoEqual} backgroundColor="#ffffff" padding="10px 24px">
        <Column padding="0px">
          <Heading level="h4" color="#0f172a" fontSize="13px" fontWeight="bold">
            BILLED TO:
          </Heading>
          <Paragraph color="#334155" fontSize="13px" lineHeight="1.5">
            <strong>{invoice.client.name}</strong><br />
            {invoice.client.company}<br />
            {invoice.client.address}<br />
            {invoice.client.cityStateZip}<br />
            {invoice.client.email}
          </Paragraph>
        </Column>

        <Column padding="0px">
          <Heading level="h4" color="#0f172a" fontSize="13px" fontWeight="bold" textAlign="right">
            PAYMENT INSTRUCTIONS:
          </Heading>
          <Paragraph color="#334155" fontSize="13px" lineHeight="1.5" textAlign="right">
            <strong>Bank:</strong> {invoice.paymentMethod.bankName}<br />
            <strong>Account Name:</strong> {invoice.paymentMethod.accountName}<br />
            <strong>Account #:</strong> {invoice.paymentMethod.accountNumber}<br />
            <strong>Routing #:</strong> {invoice.paymentMethod.routingNumber}
          </Paragraph>
        </Column>
      </Row>

      {/* 5. Divider */}
      <Row layout={ColumnLayouts.OneColumn} backgroundColor="#ffffff" padding="0px 24px">
        <Column padding="0px">
          <Divider borderTopWidth="1px" borderTopColor="#cbd5e1" borderTopStyle="solid" padding="15px 0px" />
        </Column>
      </Row>

      {/* 6. Itemized Table */}
      <Row layout={ColumnLayouts.OneColumn} backgroundColor="#ffffff" padding="0px 24px">
        <Column padding="0px">
          <Heading level="h4" color="#0f172a" fontSize="14px" fontWeight="bold">
            ITEMIZED SERVICES
          </Heading>
          <Table
            headers={tableHeaders}
            data={tableRows}
            padding="10px 12px"
            fontSize="13px"
            color="#334155"
            border={{
              borderTopWidth: "1px",
              borderTopColor: "#e2e8f0",
              borderBottomWidth: "1px",
              borderBottomColor: "#e2e8f0"
            }}
          />
        </Column>
      </Row>

      {/* 7. Divider */}
      <Row layout={ColumnLayouts.OneColumn} backgroundColor="#ffffff" padding="0px 24px">
        <Column padding="0px">
          <Divider borderTopWidth="1px" borderTopColor="#cbd5e1" borderTopStyle="solid" padding="15px 0px" />
        </Column>
      </Row>

      {/* 8. Financial Summary & Notes */}
      <Row layout={ColumnLayouts.TwoEqual} backgroundColor="#ffffff" padding="10px 24px 20px 24px">
        <Column padding="0px">
          <Heading level="h4" color="#0f172a" fontSize="13px" fontWeight="bold">
            NOTES & TERMS:
          </Heading>
          <Paragraph color="#64748b" fontSize="12px" lineHeight="1.5">
            {invoice.notes}
          </Paragraph>
        </Column>

        <Column padding="0px">
          <Paragraph color="#334155" fontSize="13px" lineHeight="1.8" textAlign="right">
            Subtotal: <strong>{invoice.currency}{totals.subtotal}</strong><br />
            Tax ({invoice.taxRatePercent}%): <strong>{invoice.currency}{totals.taxAmount}</strong><br />
            Discount: <strong>{invoice.currency}{invoice.discountAmount.toFixed(2)}</strong>
          </Paragraph>
          <Heading level="h3" color="#0f172a" fontSize="20px" fontWeight="bold" textAlign="right">
            Total Due: {invoice.currency}{totals.totalAmount}
          </Heading>
        </Column>
      </Row>

      {/* 9. Optional Email Action Button */}
      {isEmail && (
        <Row layout={ColumnLayouts.OneColumn} backgroundColor="#ffffff" padding="10px 24px 30px 24px">
          <Column padding="0px">
            <Button
              href={`mailto:${invoice.company.email}?subject=Payment%20Confirmation%20${invoice.invoiceNumber}`}
              backgroundColor="#2563eb"
              color="#ffffff"
              fontSize="15px"
              fontWeight="bold"
              padding="12px 28px"
              borderRadius="6px"
              width="100%"
              textAlign="center"
            >
              Pay Invoice Online ({invoice.currency}{totals.totalAmount})
            </Button>
          </Column>
        </Row>
      )}

      {/* 10. Footer Notice */}
      <Row layout={ColumnLayouts.OneColumn} backgroundColor="#f8fafc" padding="16px 24px">
        <Column padding="0px">
          <Paragraph color="#94a3b8" fontSize="11px" textAlign="center" lineHeight="1.4">
            Generated via Unlayer Elements ("Write Once, Render Many"). Questions? Contact {invoice.company.email}
          </Paragraph>
        </Column>
      </Row>
    </>
  );
}
