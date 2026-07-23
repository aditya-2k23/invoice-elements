import React from "react";
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
import { calculateTotals, formatCurrency } from "../data/invoiceData";

/**
 * Shared InvoiceContent tree built strictly with @unlayer/react-elements components.
 *
 * Font Size & Layout Consistency Rules:
 * 1. Single consistent font family (Inter / system-ui stack for Document; Arial for Email).
 * 2. Uniform 12px font size for all body text, addresses, metadata blocks, section headers, and table cells (left & right).
 * 3. Exact 18px title font size for company name (Left) and INVOICE / STATEMENT (Right).
 * 4. Perfect vertical and font-size alignment between Left & Right header columns.
 * 5. Structured Financial Summary Table with matching 12px text & aligned right-side decimals.
 */
export function InvoiceContent({ invoice, mode = "document" }) {
  const totals = calculateTotals(invoice);
  const isEmail = mode === "email";

  // Consistent font family across both views (matching the email styling)
  const fontStack = "Arial, Helvetica, sans-serif";

  // Keep them different a little bit: document gets wider "printed page" margins
  const px = isEmail ? "24px" : "40px";

  // Company Brand Header with Monogram Identity Mark & non-wrapping title (height 26px, font 18px)
  const companyHeaderHtml = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:6px;"><tr><td style="padding-right:8px;vertical-align:middle;"><div style="width:26px;height:26px;background-color:#0f172a;color:#ffffff;font-size:11px;font-weight:700;line-height:26px;text-align:center;border-radius:5px;font-family:${fontStack}">AD</div></td><td style="vertical-align:middle;height:26px;white-space:nowrap;"><span style="font-size:18px;font-weight:700;color:#0f172a;font-family:${fontStack};letter-spacing:-0.3px;white-space:nowrap;">${invoice.company.name}</span></td></tr></table>`;

  // Formatted HTML strings for left & right header blocks (standardized 12px font size)
  const emailReminderHtml = `Payment Notice: Your invoice from <strong>${invoice.company.name}</strong> is due on <strong>${invoice.dueDate}</strong>. Please review the statement below.`;
  const companyAddressHtml = `${invoice.company.address}<br>${invoice.company.cityStateZip}<br>Email: ${invoice.company.email} &bull; Tax ID: ${invoice.company.taxId}`;

  // Right Header Block: Matching 18px Title & 12px Metadata for 100% layout consistency
  const metadataContentHtml = `<strong>Invoice #:</strong> ${invoice.invoiceNumber}<br><strong>Date Issued:</strong> ${invoice.issueDate}<br><strong>Due Date:</strong> ${invoice.dueDate}<br><strong>Status:</strong> <span style="color:#475569;background-color:#f1f5f9;padding:2px 6px;border-radius:4px;font-weight:600;font-size:12px">${invoice.status}</span>`;
  const rightHeaderHtml = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-bottom:6px;"><tr><td style="vertical-align:middle;height:26px;text-align:right;"><span style="font-size:18px;font-weight:700;color:#0f172a;font-family:${fontStack};letter-spacing:-0.3px;">${isEmail ? "STATEMENT" : "INVOICE"}</span></td></tr></table><div style="font-size:12px;line-height:1.6;color:#334155;font-family:${fontStack};text-align:right;">${metadataContentHtml}</div>`;

  const combinedLeftHtml = `${companyHeaderHtml}<div style="color:#64748b;font-size:12px;line-height:1.5;font-family:${fontStack};margin-bottom:12px;">${invoice.company.tagline}</div><div style="color:#475569;font-size:12px;line-height:1.6;font-family:${fontStack};">${companyAddressHtml}</div>`;
  const fullHeaderTableHtml = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="bottom" style="vertical-align:bottom;text-align:left;width:50%;">${combinedLeftHtml}</td><td valign="bottom" style="vertical-align:bottom;text-align:right;width:50%;">${rightHeaderHtml}</td></tr></table>`;

  const billedToHtml = `<strong>${invoice.client.name}</strong><br>${invoice.client.company}<br>${invoice.client.address}<br>${invoice.client.cityStateZip}<br>${invoice.client.email}`;
  const paymentInstructionsHtml = `<strong>Bank:</strong> ${invoice.paymentMethod.bankName}<br><strong>Account Name:</strong> ${invoice.paymentMethod.accountName}<br><strong>Account #:</strong> ${invoice.paymentMethod.accountNumber}<br><strong>Routing #:</strong> ${invoice.paymentMethod.routingNumber}`;

  // Structured Financial Summary Table for clean right-side alignment (12px standard text)
  const financialSummaryTableHtml = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-left:auto;max-width:240px;font-family:${fontStack}"><tr><td style="padding:3px 0;color:#64748b;font-size:12px">Subtotal:</td><td style="padding:3px 0;text-align:right;color:#0f172a;font-size:12px;font-weight:600">${totals.subtotal}</td></tr><tr><td style="padding:3px 0;color:#64748b;font-size:12px">Tax (${invoice.taxRatePercent}%):</td><td style="padding:3px 0;text-align:right;color:#0f172a;font-size:12px;font-weight:600">${totals.taxAmount}</td></tr><tr><td style="padding:3px 0;color:#64748b;font-size:12px">Discount:</td><td style="padding:3px 0;text-align:right;color:#0f172a;font-size:12px;font-weight:600">${totals.discountAmount}</td></tr><tr><td style="padding:8px 0 0 0;color:#0f172a;font-size:13px;font-weight:700;border-top:1px solid #e2e8f0">Total Due:</td><td style="padding:8px 0 0 0;text-align:right;color:#2563eb;font-size:15px;font-weight:700;border-top:1px solid #e2e8f0">${totals.totalAmount}</td></tr></table>`;

  // Footer notice HTML with Support CTA link for Email and small 10px text for Document
  const emailFooterHtml = `Generated with Unlayer Elements.<a href="mailto:${invoice.company.email}" style="color:#2563eb;text-decoration:underline;font-weight:600">Contact Support</a>`;
  const documentFooterHtml = `Generated with Unlayer Elements.<p style="color:#64748b;">Contact Support: ${invoice.company.email}</p>`;

  return (
    <>
      {/* 1. Optional Email Payment Reminder Banner */}
      {isEmail && (
        <Row
          layout={ColumnLayouts.OneColumn}
          backgroundColor="#f8fafc"
          padding="14px"
        >
          <Column backgroundColor="#f8fafc" padding="10px">
            <Heading
              level="h4"
              color="#0f172a"
              fontSize="14px"
              fontWeight="bold"
              textAlign="center"
              fontFamily={fontStack}
            >
              Statement Reminder: Invoice #{invoice.invoiceNumber}
            </Heading>
            <Paragraph
              html={emailReminderHtml}
              color="#334155"
              fontSize="12px"
              textAlign="center"
              lineHeight="1.5"
              fontFamily={fontStack}
            />
          </Column>
        </Row>
      )}

      {/* 2. Header: Monogram Identity Mark (Left) & Matching 18px/12px Document Metadata (Right) */}
      <Row
        layout={ColumnLayouts.OneColumn}
        backgroundColor="#ffffff"
        padding={`24px ${px} 8px ${px}`}
      >
        <Column padding="0px">
          <Paragraph
            html={fullHeaderTableHtml}
            fontFamily={fontStack}
          />
        </Column>
      </Row>

      {/* 3. Divider */}
      <Row
        layout={ColumnLayouts.OneColumn}
        backgroundColor="#ffffff"
        padding={`0px ${px}`}
      >
        <Column padding="0px">
          <Divider
            borderTopWidth="1px"
            borderTopColor="#e2e8f0"
            borderTopStyle="solid"
            padding="10px 0px"
          />
        </Column>
      </Row>

      {/* 4. Client & Payment Target Details */}
      <Row
        layout={ColumnLayouts.TwoEqual}
        backgroundColor="#ffffff"
        padding={`8px ${px}`}
      >
        <Column padding="0px">
          <Heading
            level="h4"
            color="#0f172a"
            fontSize="12px"
            fontWeight="bold"
            fontFamily={fontStack}
          >
            BILLED TO:
          </Heading>
          <Paragraph
            html={billedToHtml}
            color="#334155"
            fontSize="12px"
            lineHeight="1.6"
            fontFamily={fontStack}
          />
        </Column>

        <Column padding="0px">
          <Heading
            level="h4"
            color="#0f172a"
            fontSize="12px"
            fontWeight="bold"
            textAlign="right"
            fontFamily={fontStack}
          >
            PAYMENT DETAILS:
          </Heading>
          <Paragraph
            html={paymentInstructionsHtml}
            color="#334155"
            fontSize="12px"
            lineHeight="1.6"
            textAlign="right"
            fontFamily={fontStack}
          />
        </Column>
      </Row>

      {/* 5. Divider */}
      <Row
        layout={ColumnLayouts.OneColumn}
        backgroundColor="#ffffff"
        padding={`0px ${px}`}
      >
        <Column padding="0px">
          <Divider
            borderTopWidth="1px"
            borderTopColor="#e2e8f0"
            borderTopStyle="solid"
            padding="10px 0px"
          />
        </Column>
      </Row>

      {/* 6. Itemized Table: Standardized 12px content, hairline rules */}
      <Row
        layout={ColumnLayouts.OneColumn}
        backgroundColor="#ffffff"
        padding={`0px ${px}`}
      >
        <Column padding="0px">
          <Heading
            level="h4"
            color="#0f172a"
            fontSize="12px"
            fontWeight="bold"
            fontFamily={fontStack}
          >
            SERVICES RENDERED
          </Heading>
          <Table
            values={{
              table: {
                headers: [
                  {
                    cells: [
                      { text: "Description", width: 50, textAlign: "left" },
                      { text: "Qty", width: 10, textAlign: "center" },
                      { text: "Unit Price", width: 20, textAlign: "right" },
                      { text: "Amount", width: 20, textAlign: "right" },
                    ],
                  },
                ],
                rows: invoice.items.map((item) => ({
                  cells: [
                    {
                      text: `${item.title} (${item.details})`,
                      width: 50,
                      textAlign: "left",
                    },
                    {
                      text: String(item.quantity),
                      width: 10,
                      textAlign: "center",
                    },
                    {
                      text: formatCurrency(item.unitPrice, invoice.currency),
                      width: 20,
                      textAlign: "right",
                    },
                    {
                      text: formatCurrency(
                        item.quantity * item.unitPrice,
                        invoice.currency,
                      ),
                      width: 20,
                      textAlign: "right",
                    },
                  ],
                })),
              },
              enableHeader: true,
              headerBackgroundColor: "#f8fafc",
              headerColor: "#475569",
              headerFontWeight: 600,
              headerFontSize: "12px",
              headerPadding: "8px 10px",
              contentPadding: "10px 10px",
              contentColor: "#1e293b",
              contentFontSize: "12px",
              contentLineHeight: "1.6",
              contentFontFamily: { label: "Font", value: fontStack },
              headerFontFamily: { label: "Font", value: fontStack },
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
        padding={`0px ${px}`}
      >
        <Column padding="0px">
          <Divider
            borderTopWidth="1px"
            borderTopColor="#e2e8f0"
            borderTopStyle="solid"
            padding="10px 0px"
          />
        </Column>
      </Row>

      {/* 8. Financial Summary & Notes */}
      <Row
        layout={ColumnLayouts.TwoEqual}
        backgroundColor="#ffffff"
        padding={`8px ${px} 20px ${px}`}
      >
        <Column padding="0px">
          <Heading
            level="h4"
            color="#0f172a"
            fontSize="12px"
            fontWeight="bold"
            fontFamily={fontStack}
          >
            TERMS & NOTES:
          </Heading>
          <Paragraph
            color="#64748b"
            fontSize="12px"
            lineHeight="1.6"
            fontFamily={fontStack}
          >
            {invoice.notes}
          </Paragraph>
        </Column>

        <Column padding="0px">
          <Paragraph
            html={financialSummaryTableHtml}
            color="#334155"
            fontSize="12px"
            fontFamily={fontStack}
          />
        </Column>
      </Row>

      {/* 9. Optional Email Action Button */}
      {isEmail && (
        <Row
          layout={ColumnLayouts.OneColumn}
          backgroundColor="#ffffff"
          padding={`10px ${px} 24px ${px}`}
        >
          <Column padding="0px">
            <Button
              href={`https://pay.apexdigital.io/invoice/${invoice.invoiceNumber}`}
              backgroundColor="#2563eb"
              color="#ffffff"
              fontSize="13px"
              fontWeight="bold"
              padding="11px 22px"
              borderRadius="6px"
              width="100%"
              textAlign="center"
            >
              Pay Invoice Online ({totals.totalAmount})
            </Button>
          </Column>
        </Row>
      )}

      {/* 10. Footer Notice */}
      <Row
        layout={ColumnLayouts.OneColumn}
        backgroundColor="#f8fafc"
        padding={`14px ${px}`}
      >
        <Column padding="0px">
          <Paragraph
            html={isEmail ? emailFooterHtml : documentFooterHtml}
            color="#64748b"
            fontSize="11px"
            textAlign="center"
            lineHeight="1.4"
            fontFamily={fontStack}
          />
        </Column>
      </Row>
    </>
  );
}
