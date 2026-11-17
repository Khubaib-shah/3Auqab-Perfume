"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAdminStore } from "@/store/useAdminStore";
import { siteConfig } from "@/config";
import { ContactMessageRecord } from "@/data/initialStoreSeed";

export default function InboxModule() {
  const messages = useAdminStore((s) => s.messages);
  const subscribers = useAdminStore((s) => s.subscribers);
  const settings = useAdminStore((s) => s.settings);
  const updateMessageOnServer = useAdminStore((s) => s.updateMessageOnServer);
  const subscribeNewsletterOnServer = useAdminStore(
    (s) => s.subscribeNewsletterOnServer
  );
  const updateSubscriberOnServer = useAdminStore(
    (s) => s.updateSubscriberOnServer
  );

  const [activeTab, setActiveTab] = useState<"messages" | "newsletter">(
    "messages"
  );
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [newSubEmail, setNewSubEmail] = useState("");

  const handleMarkStatus = async (
    msg: ContactMessageRecord,
    status: "UNREAD" | "READ" | "REPLIED"
  ) => {
    await updateMessageOnServer({ id: msg.id, status });
    toast.success(`Marked as ${status}.`);
  };

  const handleDeleteMessage = async (msg: ContactMessageRecord) => {
    await updateMessageOnServer({ id: msg.id, action: "delete" });
    toast.success("Message deleted.");
  };

  const buildReplyWhatsApp = (msg: ContactMessageRecord) => {
    const cleanPhone = (msg.phone || settings.whatsappNumber).replace(
      /[^0-9]/g,
      ""
    );
    const text = `Assalam o Alaikum ${msg.name}, thank you for contacting *${settings.name}* regarding "${msg.subject}".\n\nHow can we help you today?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const buildReplyEmail = (msg: ContactMessageRecord) => {
    const subject = `Re: ${msg.subject || "Your Inquiry"} | ${settings.name}`;
    const body = `Hi ${msg.name},\n\nThank you for contacting ${settings.name}.\n\nRegarding your message:\n"${msg.message}"\n\nBest regards,\n${settings.name}\n${settings.contact.phone}`;
    return `mailto:${msg.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubEmail.trim()) return;
    await subscribeNewsletterOnServer(newSubEmail.trim(), "Admin Added");
    setNewSubEmail("");
    setSubModalOpen(false);
    toast.success("Email added!");
  };

  const handleExportCsv = () => {
    const header = "Email,Source,Status,Date\n";
    const rows = subscribers
      .map(
        (s) =>
          `"${s.email}","${s.source}","${
            s.isActive ? "ACTIVE" : "INACTIVE"
          }","${s.createdAt}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${siteConfig.brand.slug}-subscribers.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV downloaded!");
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-section-title">Messages & Emails</h1>
          <p className="admin-section-subtitle">
            Reply to customer messages on WhatsApp or Email and view newsletter
            subscribers
          </p>
        </div>
        {activeTab === "newsletter" && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setSubModalOpen(true)}
              className="btn-admin btn-admin-primary"
            >
              <i className="fa fa-plus"></i> Add Email
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              className="btn-admin btn-admin-dark"
            >
              <i className="fa fa-download"></i> Export CSV
            </button>
          </div>
        )}
      </div>

      <div className="admin-toolbar">
        <div className="admin-pill-tabs">
          <button
            type="button"
            onClick={() => setActiveTab("messages")}
            className={`admin-pill-tab ${
              activeTab === "messages" ? "active" : ""
            }`}
          >
            Contact Messages ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("newsletter")}
            className={`admin-pill-tab ${
              activeTab === "newsletter" ? "active" : ""
            }`}
          >
            Subscribers ({subscribers.length})
          </button>
        </div>
      </div>

      {activeTab === "messages" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {messages.length === 0 ? (
            <div className="admin-card" style={{ textAlign: "center" }}>
              No messages yet.
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="admin-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "12px",
                    paddingBottom: "12px",
                    marginBottom: "12px",
                    borderBottom: "1px solid #f1f1f1",
                  }}
                >
                  <div>
                    <strong
                      style={{
                        fontSize: "15px",
                        color: "#222222",
                        marginRight: "10px",
                      }}
                    >
                      {msg.subject || "Inquiry"}
                    </strong>
                    <span
                      className={
                        msg.status === "UNREAD"
                          ? "admin-badge admin-badge-pending"
                          : msg.status === "REPLIED"
                          ? "admin-badge admin-badge-delivered"
                          : "admin-badge admin-badge-confirmed"
                      }
                    >
                      {msg.status}
                    </span>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#888888",
                        marginTop: "4px",
                      }}
                    >
                      <strong style={{ color: "#222" }}>{msg.name}</strong> (
                      {msg.email}) {msg.phone && `| Phone: ${msg.phone}`} |{" "}
                      {msg.createdAt}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {msg.phone && (
                      <a
                        href={buildReplyWhatsApp(msg)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => handleMarkStatus(msg, "REPLIED")}
                        className="btn-admin btn-admin-sm btn-admin-whatsapp"
                      >
                        <i className="fa fa-whatsapp"></i> WhatsApp
                      </a>
                    )}
                    <a
                      href={buildReplyEmail(msg)}
                      onClick={() => handleMarkStatus(msg, "REPLIED")}
                      className="btn-admin btn-admin-sm btn-admin-dark"
                    >
                      <i className="fa fa-envelope-o"></i> Email
                    </a>
                    {msg.status === "UNREAD" && (
                      <button
                        type="button"
                        onClick={() => handleMarkStatus(msg, "READ")}
                        className="btn-admin btn-admin-sm btn-admin-outline"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteMessage(msg)}
                      className="btn-admin btn-admin-sm btn-admin-danger"
                    >
                      <i className="fa fa-trash-o"></i>
                    </button>
                  </div>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#444444",
                    lineHeight: 1.6,
                  }}
                >
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        /* FULL-WIDTH SUBSCRIBERS TABLE */
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email Address</th>
                <th>Source</th>
                <th>Subscribed Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <strong style={{ color: "#222222" }}>{sub.email}</strong>
                  </td>
                  <td>{sub.source}</td>
                  <td style={{ fontSize: "12px", color: "#888888" }}>
                    {sub.createdAt}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        updateSubscriberOnServer({
                          id: sub.id,
                          isActive: !sub.isActive,
                        })
                      }
                      className={
                        sub.isActive
                          ? "admin-badge admin-badge-delivered"
                          : "admin-badge admin-badge-cancelled"
                      }
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      {sub.isActive ? "Active" : "Paused"}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        updateSubscriberOnServer({
                          id: sub.id,
                          action: "delete",
                        })
                      }
                      className="btn-admin btn-admin-sm btn-admin-danger"
                    >
                      <i className="fa fa-trash-o"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL: ADD SUBSCRIBER EMAIL */}
      {subModalOpen && (
        <div
          className="admin-backdrop"
          onClick={() => setSubModalOpen(false)}
        >
          <div
            className="admin-modal"
            style={{ maxWidth: "460px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Add Subscriber Email</h3>
              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSubModalOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddSubscriber} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">Email Address *</label>
                <input
                  type="email"
                  className="admin-input"
                  required
                  value={newSubEmail}
                  onChange={(e) => setNewSubEmail(e.target.value)}
                  placeholder="customer@example.com"
                />
              </div>
              <div
                className="admin-modal-footer"
                style={{ padding: "14px 0 0" }}
              >
                <button
                  type="button"
                  className="btn-admin btn-admin-outline"
                  onClick={() => setSubModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-admin btn-admin-primary">
                  Save Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
