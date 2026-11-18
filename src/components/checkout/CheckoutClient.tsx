"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { useShopStore } from "@/store/useShopStore";
import { useAdminStore } from "@/store/useAdminStore";
import { siteConfig } from "@/data/siteConfig";
import { OrderRecord } from "@/data/initialStoreSeed";
import { businessConfig } from "@/config";
import pakistanLocations from "@/data/pakistanLocations.json";

interface ShippingFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  address: string;
  adminNotes: string;
}

export default function CheckoutClient() {
  const { cart, clearCart, appliedVoucher, setAppliedVoucher } = useShopStore();
  const settings = useAdminStore((s) => s.settings);
  const vouchers = useAdminStore((s) => s.vouchers) || [];
  const createOrderOnServer = useAdminStore((s) => s.createOrderOnServer);

  const [step, setStep] = useState<"shipping" | "completed">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("cod");
  const [couponInput, setCouponInput] = useState("");
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue } =
    useForm<ShippingFormValues>({
      defaultValues: {
        state: "Sindh",
        city: "Karachi",
      },
    });

  const selectedProvince = watch("state");
  const selectedCity = watch("city");
  const provinceNames = pakistanLocations.provinces.map((p) => p.name);
  const availableCities =
    pakistanLocations.provinces.find((p) => p.name === selectedProvince)
      ?.cities || pakistanLocations.provinces[0].cities;

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price ?? item.product.price) * item.quantity,
    0
  );

  const isMinOrderMet =
    !appliedVoucher?.minOrderAmount ||
    totalPrice >= appliedVoucher.minOrderAmount;

  const discountAmount =
    appliedVoucher && isMinOrderMet
      ? appliedVoucher.discountType === "PERCENTAGE"
        ? Math.round((totalPrice * appliedVoucher.discountValue) / 100)
        : Math.min(totalPrice, appliedVoucher.discountValue)
      : 0;

  const finalTotal = Math.max(0, totalPrice - discountAmount);

  const handleApplyCoupon = () => {
    const cleanCode = couponInput.trim().toUpperCase();
    if (!cleanCode) {
      toast.error("Please enter a promo code.");
      return;
    }

    const found = vouchers.find(
      (v) => v.code.trim().toUpperCase() === cleanCode && v.isActive
    );

    if (found) {
      if (found.minOrderAmount > 0 && totalPrice < found.minOrderAmount) {
        toast.error(
          `Minimum order of ${settings.currency} ${found.minOrderAmount} required for ${found.code}.`
        );
        return;
      }
      setAppliedVoucher({
        code: found.code,
        discountType: found.discountType,
        discountValue: found.discountValue,
        minOrderAmount: found.minOrderAmount,
      });
      setCouponInput("");
      toast.success(
        `Promo "${found.code}" applied! ${found.discountType === "PERCENTAGE"
          ? `${found.discountValue}% off`
          : `${settings.currency} ${found.discountValue} off`
        }`
      );
    } else if (
      cleanCode ===
      (settings.promoCode || businessConfig.promo.defaultCode).toUpperCase() ||
      businessConfig.promo.aliasCodes.includes(cleanCode)
    ) {
      setAppliedVoucher({
        code: cleanCode,
        discountType: "PERCENTAGE",
        discountValue: businessConfig.promo.defaultDiscountPercent,
      });
      setCouponInput("");
      toast.success(
        `Promo "${cleanCode}" applied! ${businessConfig.promo.defaultDiscountPercent}% discount.`
      );
    } else {
      toast.error("Invalid or expired promo code.");
    }
  };

  const onSubmitOrder = async (data: ShippingFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const itemsPayload = cart.map((item) => ({
      productId: item.product.id,
      productSlug: item.product.slug,
      productName: item.product.name,
      sku: item.product.sku,
      variantSize: item.selectedSize,
      variantFinish: item.selectedFinish || "Standard",
      unitPrice: item.price ?? item.product.price,
      quantity: item.quantity,
      image: item.product.orderThumb || item.product.image,
    }));

    const voucherNote =
      appliedVoucher && discountAmount > 0
        ? `[Promo: ${appliedVoucher.code} (-${settings.currency} ${discountAmount})]`
        : "";
    const combinedNotes = [data.adminNotes?.trim(), voucherNote]
      .filter(Boolean)
      .join(" | ");

    const orderRecord = await createOrderOnServer({
      firstName: data.firstName || "Guest",
      lastName: data.lastName || "Customer",
      email: data.email || siteConfig.contact.email,
      phone: data.phone || "+92 300 0000000",
      whatsapp: data.phone || "",
      state: data.state || "Sindh",
      city: data.city || "Karachi",
      address: data.address || "",
      adminNotes: combinedNotes,
      items: itemsPayload,
      subtotal: totalPrice,
      shippingCost: 0,
      discountAmount,
      totalAmount: finalTotal,
      paymentMethod: paymentMethod === "card" ? "CARD" : "COD",
    });

    setPlacedOrder(orderRecord);
    clearCart();
    setIsSubmitting(false);
    setStep("completed");
    toast.success(`Your ${siteConfig.name} order has been placed!`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderOrderSummary = () => (
    <div className="row-col-2 row-col">
      <div className="your-order">
        <h3 className="title-form">Your Order</h3>
        <ul className="list-product-order">
          {cart.map((item) => (
            <li
              key={`${item.product.id}-${item.selectedSize}`}
              className="product-item-order"
            >
              <div className="product-thumb">
                <Link href={`/product/${item.product.slug}`}>
                  <img
                    src={item.product.orderThumb || item.product.image}
                    alt={item.product.name}
                  />
                </Link>
              </div>
              <div className="product-order-inner">
                <h5 className="product-name">
                  <Link href={`/product/${item.product.slug}`}>
                    {item.product.name}
                  </Link>
                </h5>
                <span
                  className="attributes-select attributes-size"
                  style={{ display: "block", color: "#888", fontSize: "12px" }}
                >
                  Size: {item.selectedSize}
                </span>
                <div className="price">
                  {settings.currency}{" "}
                  {(item.price ?? item.product.price).toLocaleString()}
                  <span className="count"> x{item.quantity}</span>
                </div>
              </div>
              <div className="product-line-total">
                {settings.currency}{" "}
                {(
                  (item.price ?? item.product.price) * item.quantity
                ).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
        {/* Promo / Voucher Box */}
        <div
          style={{
            marginTop: "12px",
            marginBottom: "14px",
            paddingBottom: "14px",
            borderBottom: "1px solid #eeeeee",
          }}
        >
          {appliedVoucher && discountAmount > 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f2fbf5",
                border: "1px solid #c3e6cb",
                borderRadius: "20px",
                padding: "8px 14px",
                fontSize: "13px",
                color: "#1e7e34",
              }}
            >
              <span>
                Promo <strong>{appliedVoucher.code}</strong> (-{settings.currency}{" "}
                {discountAmount.toLocaleString()})
              </span>
              <button
                type="button"
                onClick={() => {
                  setAppliedVoucher(null);
                  toast.success("Promo code removed.");
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#dc3545",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "15px",
                  lineHeight: 1,
                }}
                title="Remove promo code"
              >
                ×
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                width: "100%",
              }}
            >
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyCoupon();
                  }
                }}
                placeholder={`Promo code (e.g. ${settings.promoCode || businessConfig.promo.defaultCode
                  })`}
                className="input-text"
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: "42px",
                  borderRadius: "30px",
                  padding: "0 16px",
                  fontSize: "13px",
                  border: "1px solid #eeeeee",
                  marginBottom: 0,
                  backgroundColor: "#ffffff",
                }}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                style={{
                  height: "42px",
                  borderRadius: "30px",
                  padding: "0 20px",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  backgroundColor: "var(--color-primary)",
                  color: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  margin: 0,
                }}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {discountAmount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              color: "#666666",
              marginBottom: "6px",
            }}
          >
            <span>Subtotal:</span>
            <span>
              {settings.currency} {totalPrice.toLocaleString()}
            </span>
          </div>
        )}
        {discountAmount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              color: "#28a745",
              marginBottom: "8px",
            }}
          >
            <span>Discount ({appliedVoucher?.code}):</span>
            <span>
              - {settings.currency} {discountAmount.toLocaleString()}
            </span>
          </div>
        )}

        <div className="order-total">
          <span className="title">Total Price:</span>
          <span className="total-price">
            {settings.currency} {finalTotal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  const storeWhatsappLink = placedOrder
    ? `https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
      `Assalam o Alaikum ${siteConfig.name}! I just placed Order #${placedOrder.orderNumber} for ${settings.currency} ${placedOrder.totalAmount} (${placedOrder.paymentMethod}). Please confirm my delivery.`
    )}`
    : "#";

  return (
    <div className="main-content main-content-checkout">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Breadcrumb items={[{ label: "Checkout" }]} />
          </div>
        </div>
        <h3 className="custom_blog_title">Checkout</h3>
        <div className="checkout-wrapp">
          {step === "shipping" && (
            <form
              onSubmit={handleSubmit(onSubmitOrder)}
              className="shipping-address-form-wrapp"
            >
              <div className="shipping-address-form checkout-form">
                <div className="row-col-1 row-col">
                  <div className="shipping-address">
                    <h3 className="title-form">Shipping & Contact Details</h3>
                    <p className="form-row form-row-first">
                      <label className="text">First name *</label>
                      <input
                        {...register("firstName", { required: true })}
                        title="first"
                        type="text"
                        className="input-text"
                        required
                      />
                    </p>
                    <p className="form-row form-row-last">
                      <label className="text">Last name *</label>
                      <input
                        {...register("lastName", { required: true })}
                        title="last"
                        type="text"
                        className="input-text"
                        required
                      />
                    </p>
                    <p className="form-row form-row-first">
                      <label className="text">Email Address *</label>
                      <input
                        {...register("email", { required: true })}
                        title="email"
                        type="email"
                        placeholder="you@example.com"
                        className="input-text"
                        required
                      />
                    </p>
                    <p className="form-row form-row-last">
                      <label className="text">Phone Number *</label>
                      <input
                        {...register("phone", { required: true })}
                        title="phone"
                        type="text"
                        placeholder="+92 314 9784156"
                        className="input-text"
                        required
                      />
                    </p>
                    <p className="form-row form-row-first">
                      <label className="text">Province / State</label>
                      <SearchableSelect
                        title="state"
                        options={provinceNames}
                        value={selectedProvince}
                        searchPlaceholder="Search province..."
                        onChange={(newProv) => {
                          setValue("state", newProv);
                          const prov = pakistanLocations.provinces.find(
                            (p) => p.name === newProv
                          );
                          if (prov && prov.cities.length > 0) {
                            setValue("city", prov.cities[0]);
                          }
                        }}
                        required
                      />
                    </p>
                    <p className="form-row form-row-last">
                      <label className="text">City</label>
                      <SearchableSelect
                        title="city"
                        options={availableCities}
                        value={selectedCity}
                        searchPlaceholder="Search city..."
                        onChange={(newCity) => setValue("city", newCity)}
                        required
                      />
                    </p>
                    <p
                      className="form-row"
                      style={{ width: "100%", clear: "both" }}
                    >
                      <label className="text">Complete Street Address *</label>
                      <textarea
                        {...register("address", { required: true })}
                        title="address"
                        rows={3}
                        placeholder="House #, Street, Area"
                        className="input-text"
                        required
                        style={{
                          width: "100%",
                          borderRadius: "20px",
                          padding: "12px 20px",
                          border: "1px solid #eeeeee",
                          resize: "vertical",
                        }}
                      />
                    </p>
                    <p
                      className="form-row"
                      style={{ width: "100%", clear: "both" }}
                    >
                      <label className="text">
                        Delivery Instructions Gift Note
                      </label>
                      <textarea
                        {...register("adminNotes")}
                        title="notes"
                        rows={3}
                        placeholder="Call before delivery or wrap as gift"
                        className="input-text"
                        style={{
                          width: "100%",
                          borderRadius: "20px",
                          padding: "12px 20px",
                          border: "1px solid #eeeeee",
                          resize: "vertical",
                        }}
                      />
                    </p>
                    {/* Payment Method directly on Checkout Form */}
                    <div
                      className="payment-method"
                      style={{
                        width: "100%",
                        clear: "both",
                        marginTop: "24px",
                        paddingTop: "20px",
                        borderTop: "1px solid #eeeeee",
                      }}
                    >
                      <h3 className="title-form" style={{ marginBottom: "14px" }}>
                        Payment Method
                      </h3>
                      <div
                        className="group-button-payment"
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "nowrap",
                          alignItems: "stretch",
                          width: "100%",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setPaymentMethod("cod")}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            borderRadius: "30px",
                            padding: "11px 12px",
                            border: "1px solid var(--color-primary)",
                            backgroundColor:
                              paymentMethod === "cod"
                                ? "var(--color-primary)"
                                : "#ffffff",
                            color:
                              paymentMethod === "cod" ? "#ffffff" : "#333333",
                            fontSize: "12px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                            margin: 0,
                          }}
                        >
                          Cash on Delivery
                        </button>

                        <div
                          style={{
                            position: "relative",
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                          }}
                        >
                          <span
                            style={{
                              position: "absolute",
                              top: "-10px",
                              right: "10px",
                              backgroundColor: "#222222",
                              color: "#ffffff",
                              fontSize: "9.5px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                              padding: "3px 8px",
                              borderRadius: "12px",
                              lineHeight: 1.2,
                              zIndex: 2,
                              pointerEvents: "none",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Coming Soon
                          </span>
                          <button
                            type="button"
                            disabled
                            style={{
                              width: "100%",
                              borderRadius: "30px",
                              padding: "11px 12px",
                              border: "1px solid #e0e0e0",
                              backgroundColor: "#f7f7f7",
                              color: "#999999",
                              fontSize: "12px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              cursor: "not-allowed",
                              opacity: 0.8,
                              whiteSpace: "nowrap",
                              textAlign: "center",
                              margin: 0,
                            }}
                          >
                            Card / Online
                          </button>
                        </div>
                      </div>
                      <p
                        style={{
                          marginTop: "12px",
                          marginBottom: 0,
                          fontSize: "13px",
                          color: "#666666",
                        }}
                      >
                        Pay in cash when your {siteConfig.name} package is
                        delivered to your doorstep.
                      </p>
                    </div>
                  </div>
                </div>
                {renderOrderSummary()}
              </div>
              <button
                type="submit"
                className="button button-payment"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Placing Order..." : "Place Order Now"}
              </button>
            </form>
          )}

          {step === "completed" && (
            <div className="end-checkout-wrapp" style={{ display: "block" }}>
              <div className="end-checkout checkout-form">
                <div className="icon"></div>
                <h3 className="title-checkend">
                  Congratulations! Your {siteConfig.name} order{" "}
                  {placedOrder ? `#${placedOrder.orderNumber}` : ""} has been
                  received.
                </h3>
                <div className="sub-title">
                  Thank you for choosing {siteConfig.name}. Our team has received
                  your order and will contact you on
                  WhatsApp or Email with tracking details shortly.
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginTop: "20px",
                  }}
                >
                  {placedOrder && (
                    <a
                      href={storeWhatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="button btn-return"
                      style={{
                        backgroundColor: "#1f7a4c",
                        borderColor: "#1f7a4c",
                        color: "#fff",
                      }}
                    >
                      <i
                        className="fa fa-whatsapp"
                        style={{ marginRight: "8px" }}
                      ></i>
                      Confirm on WhatsApp
                    </a>
                  )}
                  <Link href="/shop" className="button btn-return">
                    Return to Store
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
