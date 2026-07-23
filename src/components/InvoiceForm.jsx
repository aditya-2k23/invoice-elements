import React from "react";
import { Plus, Trash2 } from "lucide-react";

export function InvoiceForm({ invoice, setInvoice }) {
  const handleChange = (section, field, value) => {
    setInvoice((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleRootChange = (field, value) => {
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    handleRootChange("items", newItems);
  };

  const addItem = () => {
    const newItems = [
      ...invoice.items,
      {
        id: Date.now(),
        title: "",
        details: "",
        quantity: 1,
        unitPrice: 0,
      },
    ];
    handleRootChange("items", newItems);
  };

  const removeItem = (index) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    handleRootChange("items", newItems);
  };

  const Input = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    required = false,
  }) => (
    <div className="flex flex-col gap-1.5 mb-3">
      <label className="text-xs font-semibold text-slate-400">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            type === "number"
              ? e.target.value === ""
                ? ""
                : parseFloat(e.target.value)
              : e.target.value,
          )
        }
        placeholder={placeholder}
        className="px-3 py-2 bg-slate-800  rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
      />
    </div>
  );

  const Textarea = ({ label, value, onChange, placeholder = "" }) => (
    <div className="flex flex-col gap-1.5 mb-3">
      <label className="text-xs font-semibold text-slate-400">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="px-3 py-2 bg-slate-800  rounded-md text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y"
      />
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
      <h3 className="text-sm font-bold text-slate-200 mb-4 border-b border-slate-800 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <Section title="Invoice Details">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Invoice Number"
            value={invoice.invoiceNumber}
            onChange={(v) => handleRootChange("invoiceNumber", v)}
          />
          <Input
            label="Status"
            value={invoice.status}
            onChange={(v) => handleRootChange("status", v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Issue Date"
            value={invoice.issueDate}
            onChange={(v) => handleRootChange("issueDate", v)}
          />
          <Input
            label="Due Date"
            value={invoice.dueDate}
            onChange={(v) => handleRootChange("dueDate", v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Currency Symbol"
            value={invoice.currency}
            onChange={(v) => handleRootChange("currency", v)}
          />
        </div>
      </Section>

      <Section title="Company Info (You)">
        <Input
          label="Company Name"
          value={invoice.company.name}
          onChange={(v) => handleChange("company", "name", v)}
        />
        <Input
          label="Tagline / Department"
          value={invoice.company.tagline}
          onChange={(v) => handleChange("company", "tagline", v)}
        />
        <Input
          label="Address"
          value={invoice.company.address}
          onChange={(v) => handleChange("company", "address", v)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City/State/Zip"
            value={invoice.company.cityStateZip}
            onChange={(v) => handleChange("company", "cityStateZip", v)}
          />
          <Input
            label="Tax ID"
            value={invoice.company.taxId}
            onChange={(v) => handleChange("company", "taxId", v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Email"
            value={invoice.company.email}
            onChange={(v) => handleChange("company", "email", v)}
          />
          <Input
            label="Phone"
            value={invoice.company.phone}
            onChange={(v) => handleChange("company", "phone", v)}
          />
        </div>
      </Section>

      <Section title="Client Info">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Client Name"
            required
            value={invoice.client.name}
            onChange={(v) => handleChange("client", "name", v)}
          />
          <Input
            label="Company Name"
            value={invoice.client.company}
            onChange={(v) => handleChange("client", "company", v)}
          />
        </div>
        <Input
          label="Address"
          value={invoice.client.address}
          onChange={(v) => handleChange("client", "address", v)}
        />
        <Input
          label="City/State/Zip"
          value={invoice.client.cityStateZip}
          onChange={(v) => handleChange("client", "cityStateZip", v)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Email"
            required
            value={invoice.client.email}
            onChange={(v) => handleChange("client", "email", v)}
          />
          <Input
            label="Phone"
            value={invoice.client.phone}
            onChange={(v) => handleChange("client", "phone", v)}
          />
        </div>
      </Section>

      <Section title="Line Items">
        {invoice.items.map((item, index) => (
          <div
            key={item.id || index}
            className="mb-4 bg-slate-950 p-3 rounded-lg border border-slate-800 relative group"
          >
            <div className="absolute right-2 top-2">
              <button
                onClick={() => removeItem(index)}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="pr-8">
              <Input
                label="Title/Description"
                required
                value={item.title}
                onChange={(v) => handleItemChange(index, "title", v)}
              />
              <Input
                label="Details"
                value={item.details}
                onChange={(v) => handleItemChange(index, "details", v)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Quantity"
                  type="number"
                  required
                  value={item.quantity}
                  onChange={(v) => handleItemChange(index, "quantity", v)}
                />
                <Input
                  label="Unit Price"
                  type="number"
                  required
                  value={item.unitPrice}
                  onChange={(v) => handleItemChange(index, "unitPrice", v)}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addItem}
          className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-500/20"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </Section>

      <Section title="Totals & Adjustments">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Tax Rate (%)"
            type="number"
            value={invoice.taxRatePercent}
            onChange={(v) => handleRootChange("taxRatePercent", v)}
          />
          <Input
            label="Discount Amount"
            type="number"
            value={invoice.discountAmount}
            onChange={(v) => handleRootChange("discountAmount", v)}
          />
        </div>
      </Section>

      <Section title="Payment Instructions">
        <Input
          label="Bank Name"
          value={invoice.paymentMethod.bankName}
          onChange={(v) => handleChange("paymentMethod", "bankName", v)}
        />
        <Input
          label="Account Name"
          value={invoice.paymentMethod.accountName}
          onChange={(v) => handleChange("paymentMethod", "accountName", v)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Account #"
            value={invoice.paymentMethod.accountNumber}
            onChange={(v) => handleChange("paymentMethod", "accountNumber", v)}
          />
          <Input
            label="Routing / Sort Code"
            value={invoice.paymentMethod.routingNumber}
            onChange={(v) => handleChange("paymentMethod", "routingNumber", v)}
          />
        </div>
      </Section>

      <Section title="Notes / Terms">
        <Textarea
          label="Terms & Notes"
          value={invoice.notes}
          onChange={(v) => handleRootChange("notes", v)}
        />
      </Section>
    </div>
  );
}
