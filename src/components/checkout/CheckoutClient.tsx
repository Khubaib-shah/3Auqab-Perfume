"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useShopStore } from "@/store/useShopStore";
import { useAdminStore } from "@/store/useAdminStore";
import { siteConfig } from "@/data/siteConfig";
import { OrderRecord } from "@/data/initialStoreSeed";

interface ShippingFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
  adminNotes: string;
}

export default function CheckoutClient() {
  const { cart, clearCart } = useShopStore();
  const settings = useAdminStore((s) => s.settings);
  const createOrderOnServer = useAdminStore((s) => s.createOrderOnServer);

  const [step, setStep] = useState<"shipping" | "payment" | "completed">(
    "shipping"
  );
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("cod");
  const [shippingData, setShippingData] = useState<ShippingFormValues | null>(
    null
  );
  const [placedOrder, setPlacedOrder] = useState<OrderRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<ShippingFormValues>({
    defaultValues: {
      country: "Pakistan",
      state: "Punjab",
      city: "Lahore",
    },
  });

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price ?? item.product.price) * item.quantity,
    0
  );

  const onProceedToPayment = (data: ShippingFormValues) => {
    setShippingData(data);
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCompleteOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
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

    const orderRecord = await createOrderOnServer({
      firstName: shippingData?.firstName || "Guest",
      lastName: shippingData?.lastName || "Customer",
      email: shippingData?.email || siteConfig.contact.email,
      phone: shippingData?.phone || "+92 300 0000000",
      whatsapp: shippingData?.phone || "",
      country: shippingData?.country || "Pakistan",
      state: shippingData?.state || "Punjab",
      city: shippingData?.city || "Lahore",
      zipCode: shippingData?.zipCode || "",
      address: shippingData?.address || "",
      adminNotes: shippingData?.adminNotes || "",
      items: itemsPayload,
      subtotal: totalPrice,
      shippingCost: 0,
      discountAmount: 0,
      totalAmount: totalPrice,
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
            <li key={item.product.id} className="product-item-order">
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
            </li>
          ))}
        </ul>
        <div className="order-total">
          <span className="title">Total Price:</span>
          <span className="total-price">
            {settings.currency} {totalPrice}
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
              onSubmit={handleSubmit(onProceedToPayment)}
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
                      <label className="text">Phone / WhatsApp Number *</label>
                      <input
                        {...register("phone", { required: true })}
                        title="phone"
                        type="text"
                        placeholder="+92 300 1234567"
                        className="input-text"
                        required
                      />
                    </p>
                    <p className="form-row forn-row-col forn-row-col-1">
                      <label className="text">Country</label>
                      <select
                        {...register("country")}
                        title="country"
                        className="chosen-select"
                        style={{
                          width: "100%",
                          height: "42px",
                          border: "1px solid #eee",
                          padding: "0 12px",
                        }}
                      >
                        <option value="Pakistan">Pakistan</option>
                        <option value="United Arab Emirates">
                          United Arab Emirates
                        </option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                      </select>
                    </p>
                    <p className="form-row forn-row-col forn-row-col-2">
                      <label className="text">Province / State</label>
                      <select
                        {...register("state")}
                        title="state"
                        className="chosen-select"
                        style={{
                          width: "100%",
                          height: "42px",
                          border: "1px solid #eee",
                          padding: "0 12px",
                        }}
                      >
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Islamabad Capital">
                          Islamabad Capital
                        </option>
                        <option value="KPK">KPK</option>
                        <option value="Dubai">Dubai</option>
                        <option value="Abu Dhabi">Abu Dhabi</option>
                        <option value="Riyadh">Riyadh</option>
                      </select>
                    </p>
                    <p className="form-row forn-row-col forn-row-col-3">
                      <label className="text">City</label>
                      <select
                        {...register("city")}
                        title="city"
                        className="chosen-select"
                        style={{
                          width: "100%",
                          height: "42px",
                          border: "1px solid #eee",
                          padding: "0 12px",
                        }}
                      >
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Dubai">Dubai</option>
                      </select>
                    </p>
                    <p className="form-row form-row-first">
                      <label className="text">Zip / Postal Code</label>
                      <input
                        {...register("zipCode")}
                        title="zip"
                        type="text"
                        className="input-text"
                      />
                    </p>
                    <p className="form-row form-row-last">
                      <label className="text">Complete Street Address *</label>
                      <input
                        {...register("address", { required: true })}
                        title="address"
                        type="text"
                        placeholder="House #, Street, Area"
                        className="input-text"
                        required
                      />
                    </p>
                    <p
                      className="form-row"
                      style={{ width: "100%", clear: "both" }}
                    >
                      <label className="text">
                        Delivery Instructions / Gift Note (Optional)
                      </label>
                      <input
                        {...register("adminNotes")}
                        title="notes"
                        type="text"
                        placeholder="e.g. Call before delivery or wrap as gift"
                        className="input-text"
                      />
                    </p>
                  </div>
                </div>
                {renderOrderSummary()}
              </div>
              <button type="submit" className="button button-payment">
                Proceed to Payment
              </button>
            </form>
          )}

          {step === "payment" && (
            <div
              className="payment-method-wrapp"
              style={{ display: "block" }}
            >
              <div className="payment-method-form checkout-form">
                <div className="row-col-1 row-col">
                  <div className="payment-method">
                    <h3 className="title-form">Payment Method</h3>
                    <div className="group-button-payment">
                      <a
                        href="#cod"
                        onClick={(e) => {
                          e.preventDefault();
                          setPaymentMethod("cod");
                        }}
                        className={`button btn-paypal ${
                          paymentMethod === "cod" ? "active" : ""
                        }`}
                      >
                        Cash on Delivery
                      </a>
                      <a
                        href="#card"
                        onClick={(e) => {
                          e.preventDefault();
                          setPaymentMethod("card");
                        }}
                        className={`button btn-credit-card ${
                          paymentMethod === "card" ? "active" : ""
                        }`}
                      >
                        Credit Card
                      </a>
                    </div>
                    {paymentMethod === "card" ? (
                      <>
                        <p className="form-row form-row-card-number">
                          <label className="text">Card number</label>
                          <input
                            type="text"
                            className="input-text"
                            placeholder="xxx - xxx - xxx - xxx"
                          />
                        </p>
                        <p className="form-row forn-row-col forn-row-col-1">
                          <label className="text">Month</label>
                          <select
                            title="month"
                            className="chosen-select"
                            style={{
                              width: "100%",
                              height: "42px",
                              border: "1px solid #eee",
                              padding: "0 12px",
                            }}
                          >
                            {Array.from({ length: 12 }, (_, i) =>
                              String(i + 1).padStart(2, "0")
                            ).map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </p>
                        <p className="form-row forn-row-col forn-row-col-2">
                          <label className="text">Year</label>
                          <select
                            title="Year"
                            className="chosen-select"
                            style={{
                              width: "100%",
                              height: "42px",
                              border: "1px solid #eee",
                              padding: "0 12px",
                            }}
                          >
                            {["2026", "2027", "2028", "2029", "2030"].map(
                              (y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              )
                            )}
                          </select>
                        </p>
                        <p className="form-row forn-row-col forn-row-col-3">
                          <label className="text">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="123"
                            className="input-text"
                          />
                        </p>
                      </>
                    ) : (
                      <p style={{ marginTop: "20px", color: "#555" }}>
                        Pay in cash when your {siteConfig.name} package is
                        delivered to your doorstep.
                      </p>
                    )}
                  </div>
                </div>
                {renderOrderSummary()}
              </div>
              <div className="button-control">
                <a
                  href="#back"
                  onClick={(e) => {
                    e.preventDefault();
                    setStep("shipping");
                  }}
                  className="button btn-back-to-shipping"
                >
                  Back to shipping
                </a>
                <a
                  href="#pay"
                  onClick={handleCompleteOrder}
                  className="button btn-pay-now"
                >
                  {isSubmitting ? "Placing Order..." : "Place Order Now"}
                </a>
              </div>
            </div>
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
                  your order in the Admin Dashboard and will contact you on
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
