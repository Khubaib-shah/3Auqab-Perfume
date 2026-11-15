"use client";

import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useAdminStore } from "@/store/useAdminStore";
import {
  OrderRecord,
  OrderStatus,
  PaymentStatus,
} from "@/data/initialStoreSeed";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function getStatusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "admin-badge admin-badge-pending";
    case "CONFIRMED":
      return "admin-badge admin-badge-confirmed";
    case "PACKED":
      return "admin-badge admin-badge-packed";
    case "SHIPPED":
      return "admin-badge admin-badge-shipped";
    case "DELIVERED":
      return "admin-badge admin-badge-delivered";
    case "CANCELLED":
      return "admin-badge admin-badge-cancelled";
    default:
      return "admin-badge admin-badge-pending";
  }
}

export default function OrdersModule() {
  const orders = useAdminStore((s) => s.orders);
  const settings = useAdminStore((s) => s.settings);
  const updateOrderOnServer = useAdminStore((s) => s.updateOrderOnServer);

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<OrderRecord | null>(null);

  const [editStatus, setEditStatus] = useState<OrderStatus>("PENDING");
  const [editPaymentStatus, setEditPaymentStatus] =
    useState<PaymentStatus>("UNPAID");
  const [editNotes, setEditNotes] = useState<string>("");

  const openOrderDrawer = (order: OrderRecord) => {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditPaymentStatus(order.paymentStatus);
    setEditNotes(order.adminNotes || "");
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (statusFilter !== "ALL" && ord.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${ord.firstName} ${ord.lastName}`.toLowerCase();
        return (
          ord.orderNumber.toLowerCase().includes(q) ||
          fullName.includes(q) ||
          ord.phone.toLowerCase().includes(q) ||
          ord.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleSaveOrderUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const updated = await updateOrderOnServer({
      id: selectedOrder.id,
      status: editStatus,
      paymentStatus: editPaymentStatus,
      adminNotes: editNotes,
    });

    if (updated) {
      setSelectedOrder(updated);
      toast.success(`Order #${updated.orderNumber} saved!`);
    }
  };

  const buildWhatsAppUrl = (
    order: OrderRecord,
    template: "confirm" | "shipped" | "address"
  ) => {
    const cleanPhone = (order.whatsapp || order.phone).replace(/[^0-9]/g, "");
    const itemsList = order.items
      .map(
        (i) =>
          `• ${i.productName} (${i.variantSize}) x${i.quantity} - ${
            settings.currency
          } ${i.unitPrice * i.quantity}`
      )
      .join("\n");

    let text = "";
    if (template === "confirm") {
      text = `Assalam o Alaikum ${order.firstName}!\n\nThank you for your order at *${settings.name}*.\n\n*Order:* #${order.orderNumber}\n*Items:*\n${itemsList}\n*Total:* ${settings.currency} ${order.totalAmount} (${order.paymentMethod})\n*Address:* ${order.address}, ${order.city}\n\nPlease reply *YES* to confirm your order.`;
    } else if (template === "shipped") {
      text = `Assalam o Alaikum ${order.firstName}!\n\nYour *${settings.name}* order *#${order.orderNumber}* is out for delivery.\n\n*Total (${order.paymentMethod}):* ${settings.currency} ${order.totalAmount}\n*Address:* ${order.address}, ${order.city}\n\nThank you for shopping with ${settings.shortName}!`;
    } else {
      text = `Assalam o Alaikum ${order.firstName}, this is *${settings.name}* regarding Order *#${order.orderNumber}*.\n\nPlease confirm if this delivery address is complete:\n_${order.address}, ${order.city}_`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const buildEmailUrl = (order: OrderRecord) => {
    const itemsList = order.items
      .map(
        (i) =>
          `- ${i.productName} (${i.variantSize}) x${i.quantity}: ${
            settings.currency
          } ${i.unitPrice * i.quantity}`
      )
      .join("\n");

    const subject = `Order Update #${order.orderNumber} | ${settings.name}`;
    const body = `Dear ${order.firstName} ${order.lastName},\n\nThank you for your order #${order.orderNumber} at ${settings.name}.\n\nStatus: ${order.status}\nItems:\n${itemsList}\n\nTotal: ${settings.currency} ${order.totalAmount} (${order.paymentMethod})\nAddress: ${order.address}, ${order.city}\n\nBest regards,\n${settings.name}\n${settings.contact.phone}`;

    return `mailto:${order.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-section-title">Orders</h1>
          <p className="admin-section-subtitle">
            View orders, update status, and contact customers on WhatsApp or
            Email
          </p>
        </div>
      </div>

      <div className="admin-toolbar">
        <div className="admin-pill-tabs">
          {["ALL", ...STATUS_OPTIONS].map((st) => {
            const count =
              st === "ALL"
                ? orders.length
                : orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`admin-pill-tab ${
                  statusFilter === st ? "active" : ""
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
        <div style={{ minWidth: "260px" }}>
          <input
            type="text"
            className="admin-input"
            placeholder="Search order #, name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Customer</th>
              <th>City</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "28px" }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <strong style={{ color: "#222222" }}>
                      #{order.orderNumber}
                    </strong>
                  </td>
                  <td
                    style={{
                      fontSize: "12px",
                      color: "#888888",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {order.createdAt}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "#222222" }}>
                      {order.firstName} {order.lastName}
                    </div>
                    <div style={{ fontSize: "12px", color: "#888888" }}>
                      {order.phone}
                    </div>
                  </td>
                  <td>{order.city}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <strong style={{ color: "#222222" }}>
                      {settings.currency} {order.totalAmount}
                    </strong>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        color:
                          order.paymentStatus === "PAID"
                            ? "#1f7a4c"
                            : "#b56c00",
                      }}
                    >
                      {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        onClick={() => openOrderDrawer(order)}
                        className="btn-admin btn-admin-sm btn-admin-primary"
                      >
                        View / Edit
                      </button>
                      <a
                        href={buildWhatsAppUrl(order, "confirm")}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-admin btn-admin-sm btn-admin-whatsapp"
                        title="WhatsApp Customer"
                      >
                        <i className="fa fa-whatsapp"></i>
                      </a>
                      <button
                        type="button"
                        onClick={() => setInvoiceOrder(order)}
                        className="btn-admin btn-admin-sm btn-admin-outline"
                        title="Print Invoice"
                      >
                        <i className="fa fa-print"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div
          className="admin-drawer-backdrop"
          onClick={() => setSelectedOrder(null)}
        >
          <div className="admin-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <h3 className="admin-modal-title">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <span style={{ fontSize: "12px", color: "#888888" }}>
                  {selectedOrder.createdAt}
                </span>
              </div>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <div
                className="admin-card"
                style={{ marginBottom: "18px", padding: "18px" }}
              >
                <h4
                  className="admin-card-title"
                  style={{ marginBottom: "12px" }}
                >
                  <span>Customer Details</span>
                  <span className={getStatusBadgeClass(selectedOrder.status)}>
                    {selectedOrder.status}
                  </span>
                </h4>
                <div style={{ fontSize: "13px", lineHeight: 1.7 }}>
                  <div>
                    <strong style={{ color: "#222" }}>Name:</strong>{" "}
                    {selectedOrder.firstName} {selectedOrder.lastName}
                  </div>
                  <div>
                    <strong style={{ color: "#222" }}>Phone:</strong>{" "}
                    {selectedOrder.phone}
                  </div>
                  <div>
                    <strong style={{ color: "#222" }}>Email:</strong>{" "}
                    {selectedOrder.email}
                  </div>
                  <div>
                    <strong style={{ color: "#222" }}>Address:</strong>{" "}
                    {selectedOrder.address}, {selectedOrder.city},{" "}
                    {selectedOrder.state}, {selectedOrder.country}
                  </div>
                </div>
              </div>

              <div
                className="admin-card"
                style={{ marginBottom: "18px", padding: "18px" }}
              >
                <h4
                  className="admin-card-title"
                  style={{ marginBottom: "12px" }}
                >
                  <span>Contact Customer</span>
                  <i className="fa fa-whatsapp" style={{ color: "#1f7a4c" }}></i>
                </h4>
                <div className="admin-grid-2" style={{ gap: "10px" }}>
                  <a
                    href={buildWhatsAppUrl(selectedOrder, "confirm")}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-admin btn-admin-sm btn-admin-whatsapp"
                  >
                    <i className="fa fa-whatsapp"></i> Confirm Order
                  </a>
                  <a
                    href={buildWhatsAppUrl(selectedOrder, "shipped")}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-admin btn-admin-sm btn-admin-whatsapp"
                  >
                    <i className="fa fa-whatsapp"></i> Order Shipped
                  </a>
                  <a
                    href={buildWhatsAppUrl(selectedOrder, "address")}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-admin btn-admin-sm btn-admin-outline"
                  >
                    <i className="fa fa-map-marker"></i> Check Address
                  </a>
                  <a
                    href={buildEmailUrl(selectedOrder)}
                    className="btn-admin btn-admin-sm btn-admin-dark"
                  >
                    <i className="fa fa-envelope-o"></i> Send Email
                  </a>
                </div>
              </div>

              <div
                className="admin-card"
                style={{ marginBottom: "18px", padding: "18px" }}
              >
                <h4
                  className="admin-card-title"
                  style={{ marginBottom: "12px" }}
                >
                  <span>Items ({selectedOrder.items.length})</span>
                  <strong style={{ color: "#ab8e66" }}>
                    {settings.currency} {selectedOrder.totalAmount}
                  </strong>
                </h4>
                {selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom:
                        idx < selectedOrder.items.length - 1
                          ? "1px solid #f1f1f1"
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        style={{
                          width: "44px",
                          height: "44px",
                          objectFit: "cover",
                          border: "1px solid #eee",
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            color: "#222222",
                            fontSize: "13px",
                          }}
                        >
                          {item.productName}
                        </div>
                        <div style={{ fontSize: "12px", color: "#888888" }}>
                          Size: {item.variantSize}
                          {item.variantFinish &&
                          item.variantFinish !== "Standard"
                            ? ` | ${item.variantFinish}`
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#222222",
                        fontSize: "13px",
                      }}
                    >
                      {item.quantity} × {settings.currency} {item.unitPrice}
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSaveOrderUpdate}
                className="admin-card"
                style={{ padding: "18px" }}
              >
                <h4
                  className="admin-card-title"
                  style={{ marginBottom: "14px" }}
                >
                  Update Order Status
                </h4>

                <div className="admin-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-label">Order Status</label>
                    <select
                      className="admin-select"
                      value={editStatus}
                      onChange={(e) =>
                        setEditStatus(e.target.value as OrderStatus)
                      }
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-label">Payment Status</label>
                    <select
                      className="admin-select"
                      value={editPaymentStatus}
                      onChange={(e) =>
                        setEditPaymentStatus(e.target.value as PaymentStatus)
                      }
                    >
                      <option value="UNPAID">UNPAID</option>
                      <option value="PAID">PAID</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Delivery / Order Note</label>
                  <textarea
                    className="admin-textarea"
                    style={{ minHeight: "75px" }}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add a note about this order..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-admin btn-admin-primary"
                  style={{ width: "100%" }}
                >
                  Save Order
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {invoiceOrder && (
        <div
          className="admin-backdrop"
          onClick={() => setInvoiceOrder(null)}
        >
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                Invoice #{invoiceOrder.orderNumber}
              </h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setInvoiceOrder(null)}
              >
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "2px solid #222222",
                  paddingBottom: "16px",
                  marginBottom: "18px",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "22px",
                      fontWeight: 700,
                      color: "#111111",
                      textTransform: "uppercase",
                    }}
                  >
                    {settings.shortName}{" "}
                    <span style={{ color: "#ab8e66" }}>PERFUME</span>
                  </h2>
                  <div style={{ fontSize: "12px", color: "#666666" }}>
                    {settings.contact.phone} | {settings.contact.email}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#222" }}>
                    INVOICE #{invoiceOrder.orderNumber}
                  </div>
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    Date: {invoiceOrder.createdAt}
                  </div>
                  <div style={{ fontSize: "12px", color: "#222", fontWeight: 600 }}>
                    {invoiceOrder.paymentMethod} ({invoiceOrder.paymentStatus})
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "18px", fontSize: "13px" }}>
                <strong style={{ color: "#222" }}>Deliver To:</strong>
                <div>
                  {invoiceOrder.firstName} {invoiceOrder.lastName} (
                  {invoiceOrder.phone})
                </div>
                <div>
                  {invoiceOrder.address}, {invoiceOrder.city},{" "}
                  {invoiceOrder.state}, {invoiceOrder.country}
                </div>
              </div>

              <div className="admin-table-wrap" style={{ marginBottom: "18px" }}>
                <table className="admin-table" style={{ minWidth: "100%" }}>
                  <thead>
                    <tr>
                      <th>Perfume</th>
                      <th>Size</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <strong style={{ color: "#222" }}>
                            {item.productName}
                          </strong>
                        </td>
                        <td>{item.variantSize}</td>
                        <td>{item.quantity}</td>
                        <td>
                          {settings.currency} {item.unitPrice}
                        </td>
                        <td>
                          <strong>
                            {settings.currency} {item.unitPrice * item.quantity}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign: "right", fontSize: "16px" }}>
                <strong style={{ color: "#222222" }}>
                  Total: {settings.currency} {invoiceOrder.totalAmount}
                </strong>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn-admin btn-admin-outline"
                onClick={() => setInvoiceOrder(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-admin btn-admin-primary"
                onClick={() => window.print()}
              >
                <i className="fa fa-print"></i> Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
