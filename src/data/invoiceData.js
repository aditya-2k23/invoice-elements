export const invoiceData = {
  invoiceNumber: "INV-2026-0892",
  issueDate: "July 23, 2026",
  dueDate: "August 06, 2026",
  status: "Pending Payment",
  currency: "$",

  company: {
    name: "Apex Digital Solutions",
    monogram: "AD",
    tagline: "Software & Design Engineering",
    address: "100 Innovation Way, Suite 400",
    cityStateZip: "San Francisco, CA 94105",
    email: "billing@apexdigital.io",
    phone: "+1 (415) 890-2341",
    website: "https://apexdigital.io",
    taxId: "US-948201948"
  },

  client: {
    name: "Elena Rostova",
    company: "Acme Cloud Dynamics",
    address: "750 Market Street, Floor 12",
    cityStateZip: "San Francisco, CA 94103",
    email: "elena.rostova@acmecloud.com",
    phone: "+1 (415) 555-0198"
  },

  items: [
    {
      id: 1,
      title: "React UI Component System",
      details: "Email/PDF template suite",
      quantity: 1,
      unitPrice: 3200.00
    },
    {
      id: 2,
      title: "Unlayer Integration",
      details: "Dual rendering pipeline",
      quantity: 1,
      unitPrice: 1850.00
    },
    {
      id: 3,
      title: "Performance Tuning",
      details: "Cross-client testing",
      quantity: 8,
      unitPrice: 150.00
    }
  ],

  taxRatePercent: 8.5,
  discountAmount: 0.00,

  notes: "Thank you for partnering with Apex Digital Solutions. Please submit payment within 14 days of invoice issue date.",

  paymentMethod: {
    bankName: "First National Tech Bank",
    accountName: "Apex Digital Solutions LLC",
    accountNumber: "**** **** 4892",
    routingNumber: "121000358",
    swiftCode: "FNTBUS6S"
  }
};

export function formatCurrency(amount, currency = "$") {
  const num = typeof amount === "number" ? amount : parseFloat(amount) || 0;
  return `${currency}${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function calculateTotals(invoice) {
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = (subtotal - invoice.discountAmount) * (invoice.taxRatePercent / 100);
  const totalAmount = subtotal - invoice.discountAmount + taxAmount;

  return {
    subtotalNum: subtotal,
    taxAmountNum: taxAmount,
    totalAmountNum: totalAmount,
    subtotal: formatCurrency(subtotal, invoice.currency),
    taxAmount: formatCurrency(taxAmount, invoice.currency),
    discountAmount: formatCurrency(invoice.discountAmount, invoice.currency),
    totalAmount: formatCurrency(totalAmount, invoice.currency)
  };
}
