"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useShopStore } from "@/store/useShopStore";
import { useAdminStore } from "@/store/useAdminStore";
import { businessConfig, siteConfig } from "@/config";

export default function CartClient() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    appliedVoucher,
    setAppliedVoucher,
  } = useShopStore();
  const vouchers = useAdminStore((s) => s.vouchers) || [];
  const settings = useAdminStore((s) => s.settings);

  const [coupon, setCoupon] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.price ?? item.product.price) * item.quantity,
    0
  );

  const isMinOrderMet =
    !appliedVoucher?.minOrderAmount ||
    subtotal >= appliedVoucher.minOrderAmount;

  const discountAmount =
    appliedVoucher && isMinOrderMet
      ? appliedVoucher.discountType === "PERCENTAGE"
        ? (subtotal * appliedVoucher.discountValue) / 100
        : Math.min(subtotal, appliedVoucher.discountValue)
      : 0;

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    const cleanCode = coupon.trim().toUpperCase();
    if (!cleanCode) {
      toast.error("Please enter a voucher code.");
      return;
    }

    const found = vouchers.find(
      (v) => v.code.trim().toUpperCase() === cleanCode && v.isActive
    );

    if (found) {
      if (found.minOrderAmount > 0 && subtotal < found.minOrderAmount) {
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
      toast.success(
        `Voucher "${found.code}" applied! ${
          found.discountType === "PERCENTAGE"
            ? `${found.discountValue}% off`
            : `${settings.currency} ${found.discountValue} off`
        }`
      );
    } else if (
      cleanCode === (settings.promoCode || businessConfig.promo.defaultCode).toUpperCase() ||
      businessConfig.promo.aliasCodes.includes(cleanCode)
    ) {
      setAppliedVoucher({
        code: cleanCode,
        discountType: "PERCENTAGE",
        discountValue: businessConfig.promo.defaultDiscountPercent,
      });
      toast.success(
        `Promo code "${cleanCode}" applied! ${businessConfig.promo.defaultDiscountPercent}% discount.`
      );
    } else {
      toast.error("Invalid or expired voucher code.");
    }
  };

  return (
    <div className="site-content">
      <main className="site-main main-container no-sidebar">
        <div className="container">
          <Breadcrumb items={[{ label: "Shopping Cart" }]} />
          <div className="row">
            <div className="main-content-cart main-content col-sm-12">
              <h3 className="custom_blog_title">Shopping Cart</h3>
              <div className="page-main-content">
                <div className="shoppingcart-content">
                  {cart.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "50px 20px",
                        border: "1px solid #eee",
                        marginBottom: "30px",
                      }}
                    >
                      <h4>Your shopping bag is currently empty.</h4>
                      <p style={{ margin: "15px 0 25px" }}>
                        Explore our signature {siteConfig.brand.name} {siteConfig.brand.productNoun}{" "}
                        collections.
                      </p>
                      <Link href="/shop" className="button">
                        {businessConfig.labels.emptyCartCta}
                      </Link>
                    </div>
                  ) : (
                    <form
                      className="cart-form"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <table className="shop_table">
                        <thead>
                          <tr>
                            <th className="product-remove"></th>
                            <th className="product-thumbnail"></th>
                            <th className="product-name">Product</th>
                            <th className="product-price">Price</th>
                            <th className="product-quantity">Quantity</th>
                            <th className="product-subtotal">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item) => {
                            const unitPrice =
                              item.price ?? item.product.price;
                            return (
                              <tr
                                key={`${item.product.id}-${item.selectedSize}`}
                                className="cart_item"
                              >
                                <td className="product-remove">
                                  <a
                                    href="#remove"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      removeFromCart(
                                        item.product.id,
                                        item.selectedSize
                                      );
                                      toast.success(
                                        `${item.product.name} (${item.selectedSize}) removed from bag.`
                                      );
                                    }}
                                    className="remove"
                                  ></a>
                                </td>
                                <td className="product-thumbnail">
                                  <Link href={`/product/${item.product.slug}`}>
                                    <img
                                      src={
                                        item.product.cartThumb ||
                                        item.product.image
                                      }
                                      alt={item.product.name}
                                      className="attachment-shop_thumbnail size-shop_thumbnail wp-post-image"
                                    />
                                  </Link>
                                </td>
                                <td className="product-name" data-title="Product">
                                  <Link
                                    href={`/product/${item.product.slug}`}
                                    className="title"
                                  >
                                    {item.product.name}
                                  </Link>
                                  <span
                                    className="attributes-select attributes-size"
                                    style={{
                                      display: "block",
                                      color: "#888",
                                      fontSize: "12px",
                                      marginTop: "4px",
                                    }}
                                  >
                                    {businessConfig.variant.label}: {item.selectedSize}
                                  </span>
                                </td>
                                <td
                                  className="product-quantity"
                                  data-title="Quantity"
                                >
                                  <div className="quantity">
                                    <div className="control">
                                      <a
                                        className="btn-number qtyminus quantity-minus"
                                        href="#minus"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          updateQuantity(
                                            item.product.id,
                                            item.quantity - 1,
                                            item.selectedSize
                                          );
                                        }}
                                      >
                                        -
                                      </a>
                                      <input
                                        type="text"
                                        value={item.quantity}
                                        readOnly
                                        title="Qty"
                                        className="input-qty qty"
                                        size={4}
                                      />
                                      <a
                                        className="btn-number qtyplus quantity-plus"
                                        href="#plus"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          updateQuantity(
                                            item.product.id,
                                            item.quantity + 1,
                                            item.selectedSize
                                          );
                                        }}
                                      >
                                        +
                                      </a>
                                    </div>
                                  </div>
                                </td>
                                <td className="product-price" data-title="Price">
                                  <div
                                    style={{
                                      fontSize: "12px",
                                      color: "#888",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    {settings.currency || "Rs"}{" "}
                                    {unitPrice.toLocaleString()} each
                                  </div>
                                  <span className="woocommerce-Price-amount amount">
                                    <span className="woocommerce-Price-currencySymbol">
                                      {settings.currency || "Rs"}{" "}
                                    </span>
                                    {(unitPrice * item.quantity).toLocaleString()}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td className="actions" colSpan={6}>
                              <div className="coupon">
                                <label className="coupon_code">
                                  Voucher Code:
                                </label>
                                <input
                                  type="text"
                                  value={coupon}
                                  onChange={(e) => setCoupon(e.target.value)}
                                  className="input-text"
                                  placeholder={`e.g. ${settings.promoCode || businessConfig.promo.defaultCode}`}
                                />
                                <a
                                  href="#coupon"
                                  onClick={handleApplyCoupon}
                                  className="button"
                                ></a>
                              </div>
                              <div className="order-total" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                                {appliedVoucher && (
                                  <div style={{ fontSize: "13px", color: "#28a745", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span>
                                      Voucher &quot;{appliedVoucher.code}&quot; (-{settings.currency} {discountAmount.toFixed(0)})
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setAppliedVoucher(null);
                                        toast.success("Voucher removed.");
                                      }}
                                      title="Remove voucher"
                                      style={{
                                        border: "none",
                                        background: "transparent",
                                        color: "#dc3545",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        padding: "0 4px",
                                        fontSize: "15px",
                                        lineHeight: 1,
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                )}
                                <div>
                                  <span className="title">Total Price: </span>
                                  <span className="total-price">
                                    {settings.currency} {finalTotal.toFixed(0)}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </form>
                  )}
                  <div className="control-cart">
                    <button
                      type="button"
                      onClick={() => router.push("/shop")}
                      className="button btn-continue-shopping"
                    >
                      Continue Shopping
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/checkout")}
                      className="button btn-cart-to-checkout"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
