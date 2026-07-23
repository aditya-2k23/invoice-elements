import {
  Row,
  Column,
  ColumnLayouts,
  Heading,
  Paragraph,
  Table,
  Divider,
  Button,
} from "@unlayer/react-elements";
import { calculateTotals } from "../data/invoiceData";

/**
 * Shared InvoiceContent tree built strictly with @unlayer/react-elements components.
 *
 * Rules applied:
 * 1. NO Tailwind CSS classes inside this file — only Elements' native style props.
 * 2. Every <Row layout={...}> contains EXACTLY the number of <Column> children matching layout.
 * 3. Multi-line content uses explicit html prop with <br> tags for proper line break rendering.
 * 4. Itemized table uses official Table values prop for exact column width ratios & cell alignments.
 */
export function InvoiceContent({ invoice, mode = "document" }) {
  const totals = calculateTotals(invoice);
  const isEmail = mode === "email";

  // Typography selection: Serif headers + sans-serif body for Document (PDF); Email-safe Arial for Email
  const headingFont = isEmail
    ? "Arial, Helvetica, sans-serif"
    : 'Georgia, "Times New Roman", serif';
  const bodyFont = isEmail
    ? "Arial, Helvetica, sans-serif"
    : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const monoFont = isEmail
    ? "Arial, Helvetica, sans-serif"
    : '"Courier New", Courier, monospace';

  // Formatted HTML strings for multi-line Paragraphs with explicit <br> tags
  const emailReminderHtml = `Friendly notice: Your invoice from <strong>${invoice.company.name}</strong> is due on <strong>${invoice.dueDate}</strong>. Please review the details below.`;
  const companyAddressHtml = `${invoice.company.address}<br>${invoice.company.cityStateZip}<br>Email: ${invoice.company.email} | Tax ID: ${invoice.company.taxId}`;
  const metadataHtml = `<strong>Invoice #:</strong> ${invoice.invoiceNumber}<br><strong>Date Issued:</strong> ${invoice.issueDate}<br><strong>Due Date:</strong> ${invoice.dueDate}<br><strong>Status:</strong> <span style="color:#d97706;font-weight:bold">${invoice.status}</span>`;
  const billedToHtml = `<strong>${invoice.client.name}</strong><br>${invoice.client.company}<br>${invoice.client.address}<br>${invoice.client.cityStateZip}<br>${invoice.client.email}`;
  const paymentInstructionsHtml = `<strong>Bank:</strong> ${invoice.paymentMethod.bankName}<br><strong>Account Name:</strong> ${invoice.paymentMethod.accountName}<br><strong>Account #:</strong> ${invoice.paymentMethod.accountNumber}<br><strong>Routing #:</strong> ${invoice.paymentMethod.routingNumber}`;
  const financialSummaryHtml = `Subtotal: <span style="font-family:${monoFont};font-weight:600">${invoice.currency}${totals.subtotal}</span><br>Tax (${invoice.taxRatePercent}%): <span style="font-family:${monoFont};font-weight:600">${invoice.currency}${totals.taxAmount}</span><br>Discount: <span style="font-family:${monoFont};font-weight:600">${invoice.currency}${invoice.discountAmount.toFixed(2)}</span>`;

  return (
    <>
      {/* 1. Optional Email Payment Reminder Banner */}
      {isEmail && (
        <Row
          layout={ColumnLayouts.OneColumn}
          backgroundColor="#eff6ff"
          padding="16px"
        >
          <Column backgroundColor="#eff6ff" padding="12px">
            <Heading
              level="h4"
              color="#1e40af"
              fontSize="16px"
              fontWeight="bold"
              textAlign="center"
              fontFamily={headingFont}
            >
              Payment Reminder: Invoice #{invoice.invoiceNumber}
            </Heading>
            <Paragraph
              html={emailReminderHtml}
              color="#1e3a8a"
              fontSize="14px"
              textAlign="center"
              lineHeight="1.6"
              fontFamily={bodyFont}
            />
          </Column>
        </Row>
      )}

      {/* 2. Header: Company Info & Invoice Metadata */}
      <Row
        layout={ColumnLayouts.TwoEqual}
        backgroundColor="#ffffff"
        padding="32px 28px 12px 28px"
      >
        <Column padding="0px">
          <Heading
            level="h2"
            color="#0f172a"
            fontSize="24px"
            fontWeight="bold"
            fontFamily={headingFont}
          >
            {invoice.company.name}
          </Heading>
          <Paragraph
            color="#64748b"
            fontSize="13px"
            lineHeight="1.4"
            fontFamily={bodyFont}
          >
            {invoice.company.tagline}
          </Paragraph>
          <Paragraph
            html={companyAddressHtml}
            color="#475569"
            fontSize="12px"
            lineHeight="1.6"
            fontFamily={bodyFont}
          />
        </Column>

        <Column padding="0px">
          <Heading
            level="h1"
            color={isEmail ? "#2563eb" : "#0f172a"}
            fontSize="28px"
            fontWeight="bold"
            textAlign="right"
            fontFamily={headingFont}
          >
            {isEmail ? "PAYMENT REMINDER" : "INVOICE"}
          </Heading>
          <Paragraph
            html={metadataHtml}
            color="#334155"
            fontSize="13px"
            textAlign="right"
            lineHeight="1.7"
            fontFamily={bodyFont}
          />
        </Column>
      </Row>

      {/* 3. Divider */}
      <Row
        layout={ColumnLayouts.OneColumn}
        backgroundColor="#ffffff"
        padding="0px 28px"
      >
        <Column padding="0px">
          <Divider
            borderTopWidth="2px"
            borderTopColor="#e2e8f0"
            borderTopStyle="solid"
            padding="12px 0px"
          />
        </Column>
      </Row>

      {/* 4. Client & Payment Target Details */}
      <Row
        layout={ColumnLayouts.TwoEqual}
        backgroundColor="#ffffff"
        padding="12px 28px"
      >
        <Column padding="0px">
          <Heading
            level="h4"
            color="#0f172a"
            fontSize="13px"
            fontWeight="bold"
            fontFamily={headingFont}
          >
            BILLED TO:
          </Heading>
          <Paragraph
            html={billedToHtml}
            color="#334155"
            fontSize="13px"
            lineHeight="1.6"
            fontFamily={bodyFont}
          />
        </Column>

        <Column padding="0px">
          <Heading
            level="h4"
            color="#0f172a"
            fontSize="13px"
            fontWeight="bold"
            textAlign="right"
            fontFamily={headingFont}
          >
            PAYMENT INSTRUCTIONS:
          </Heading>
          <Paragraph
            html={paymentInstructionsHtml}
            color="#334155"
            fontSize="13px"
            lineHeight="1.6"
            textAlign="right"
            fontFamily={bodyFont}
          />
        </Column>
      </Row>

      {/* 5. Divider */}
      <Row
        layout={ColumnLayouts.OneColumn}
        backgroundColor="#ffffff"
        padding="0px 28px"
      >
        <Column padding="0px">
          <Divider
            borderTopWidth="1px"
            borderTopColor="#cbd5e1"
            borderTopStyle="solid"
            padding="16px 0px"
          />
        </Column>
      </Row>

      {/* 6. Itemized Table with Width Ratios (45% Description, 15% Qty, 20% Price, 20% Total) */}
      <Row
        layout={ColumnLayouts.OneColumn}
        backgroundColor="#ffffff"
        padding="0px 28px"
      >
        <Column padding="0px">
          <Heading
            level="h4"
            color="#0f172a"
            fontSize="14px"
            fontWeight="bold"
            fontFamily={headingFont}
          >
            ITEMIZED SERVICES
          </Heading>
          <Table
            values={{
              table: {
                headers: [
                  {
                    cells: [
                      {
                        text: "Item Description",
                        width: 45,
                        textAlign: "left",
                      },
                      { text: "Qty", width: 15, textAlign: "center" },
                      { text: "Unit Price", width: 20, textAlign: "right" },
                      { text: "Total Amount", width: 20, textAlign: "right" },
                    ],
                  },
                ],
                rows: invoice.items.map((item) => ({
                  cells: [
                    {
                      text: `${item.description} — ${item.details}`,
                      width: 45,
                      textAlign: "left",
                    },
                    {
                      text: String(item.quantity),
                      width: 15,
                      textAlign: "center",
                    },
                    {
                      text: `${invoice.currency}${item.unitPrice.toFixed(2)}`,
                      width: 20,
                      textAlign: "right",
                    },
                    {
                      text: `${invoice.currency}${(item.quantity * item.unitPrice).toFixed(2)}`,
                      width: 20,
                      textAlign: "right",
                    },
                  ],
                })),
              },
              enableHeader: true,
              headerBackgroundColor: "#f8fafc",
              headerColor: "#0f172a",
              headerFontWeight: 700,
              headerPadding: isEmail ? "10px 12px" : "14px 16px",
              contentPadding: isEmail ? "10px 12px" : "14px 16px",
              contentColor: "#334155",
              contentFontSize: "13px",
              contentFontFamily: { label: "Font", value: bodyFont },
              headerFontFamily: { label: "Font", value: bodyFont },
              border: {
                borderTopWidth: "1px",
                borderTopColor: "#e2e8f0",
                borderBottomWidth: "1px",
                borderBottomColor: "#e2e8f0",
                borderLeftWidth: "0px",
                borderRightWidth: "0px",
              },
            }}
          />
        </Column>
      </Row>

      {/* 7. Divider */}
      <Row
        layout={ColumnLayouts.OneColumn}
        backgroundColor="#ffffff"
        padding="0px 28px"
      >
        <Column padding="0px">
          <Divider
            borderTopWidth="1px"
            borderTopColor="#cbd5e1"
            borderTopStyle="solid"
            padding="16px 0px"
          />
        </Column>
      </Row>

      {/* 8. Financial Summary & Notes */}
      <Row
        layout={ColumnLayouts.TwoEqual}
        backgroundColor="#ffffff"
        padding="12px 28px 24px 28px"
      >
        <Column padding="0px">
          <Heading
            level="h4"
            color="#0f172a"
            fontSize="13px"
            fontWeight="bold"
            fontFamily={headingFont}
          >
            NOTES & TERMS:
          </Heading>
          <Paragraph
            color="#64748b"
            fontSize="12px"
            lineHeight="1.6"
            fontFamily={bodyFont}
          >
            {invoice.notes}
          </Paragraph>
        </Column>

        <Column padding="0px">
          <Paragraph
            html={financialSummaryHtml}
            color="#334155"
            fontSize="13px"
            lineHeight="1.8"
            textAlign="right"
            fontFamily={bodyFont}
          />
          <Heading
            level="h3"
            color="#0f172a"
            fontSize="20px"
            fontWeight="bold"
            textAlign="right"
            fontFamily={headingFont}
          >
            Total Due:{" "}
            <span style={{ fontFamily: monoFont }}>
              {invoice.currency}
              {totals.totalAmount}
            </span>
          </Heading>
        </Column>
      </Row>

      {/* 9. Optional Email Action Button */}
      {isEmail && (
        <Row
          layout={ColumnLayouts.OneColumn}
          backgroundColor="#ffffff"
          padding="12px 28px 32px 28px"
        >
          <Column padding="0px">
            <Button
              href={`https://pay.apexdigital.io/invoice/${invoice.invoiceNumber}`}
              backgroundColor="#2563eb"
              color="#ffffff"
              fontSize="15px"
              fontWeight="bold"
              padding="14px 28px"
              borderRadius="6px"
              width="100%"
              textAlign="center"
            >
              Pay Invoice Online ({invoice.currency}
              {totals.totalAmount})
            </Button>
          </Column>
        </Row>
      )}

      {/* 10. Footer Notice */}
      <Row
        layout={ColumnLayouts.OneColumn}
        backgroundColor="#f8fafc"
        padding="18px 28px"
      >
        <Column padding="0px">
          <Paragraph
            color="#94a3b8"
            fontSize="11px"
            textAlign="center"
            lineHeight="1.5"
            fontFamily={bodyFont}
          >
            Generated via Unlayer Elements ("Write Once, Render Many").
            Questions? Contact {invoice.company.email}
          </Paragraph>
        </Column>
      </Row>
    </>
  );
}
