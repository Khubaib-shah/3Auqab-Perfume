import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readDbAsync, writeDbAsync, OrderRecord, OrderStatus } from "@/lib/db";

function formatTimestamp(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await readDbAsync();

    const nextSeq = 1001 + db.orders.length;
    const orderNumber = `3AUQ-2026-${nextSeq}`;
    const nowStr = formatTimestamp();

    const cleanWhatsapp = String(body.phone || body.whatsapp || "").replace(
      /[^0-9]/g,
      ""
    );

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber,
      firstName: body.firstName || "Guest",
      lastName: body.lastName || "Customer",
      email: body.email || "customer@3uqab.com",
      phone: body.phone || "+92 300 0000000",
      whatsapp: cleanWhatsapp || "923000000000",
      state: body.state || "Sindh",
      city: body.city || "Karachi",
      address: body.address || "",
      items: Array.isArray(body.items) ? body.items : [],
      subtotal: Number(body.subtotal) || 0,
      shippingCost: Number(body.shippingCost) || 0,
      discountAmount: Number(body.discountAmount) || 0,
      totalAmount: Number(body.totalAmount) || 0,
      paymentMethod: body.paymentMethod === "CARD" ? "CARD" : "COD",
      paymentStatus: body.paymentMethod === "CARD" ? "PAID" : "UNPAID",
      status: "PENDING",
      courierName: "",
      trackingNumber: "",
      trackingUrl: "",
      adminNotes: body.adminNotes || "",
      statusHistory: [
        {
          status: "PENDING",
          note: `Order placed on 3Uqab Storefront (${
            body.paymentMethod === "CARD" ? "Card Paid" : "Cash on Delivery"
          }).`,
          timestamp: nowStr,
        },
      ],
      createdAt: nowStr,
      updatedAt: nowStr,
    };

    // Decrement product stock quantities
    for (const item of newOrder.items) {
      const prodIdx = db.products.findIndex((p) => p.id === item.productId);
      if (prodIdx > -1) {
        const nextStock = Math.max(
          0,
          (db.products[prodIdx].stockQuantity || 20) - (item.quantity || 1)
        );
        db.products[prodIdx].stockQuantity = nextStock;
        db.products[prodIdx].inStock = nextStock > 0;
      }
    }

    db.orders = [newOrder, ...db.orders];
    await writeDbAsync(db);
    revalidatePath("/", "layout");

    return NextResponse.json({ order: newOrder, db });
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, paymentStatus, courierName, trackingNumber, trackingUrl, adminNotes, statusNote } = body;

    const db = await readDbAsync();
    const idx = db.orders.findIndex((o) => o.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const existing = db.orders[idx];
    const nowStr = formatTimestamp();
    const nextStatus = (status || existing.status) as OrderStatus;

    const updatedHistory = [...existing.statusHistory];
    if (status && status !== existing.status) {
      updatedHistory.push({
        status: nextStatus,
        note:
          statusNote ||
          `Status updated to ${nextStatus}${
            courierName || existing.courierName
              ? ` (${courierName || existing.courierName}${
                  trackingNumber ? ` - ${trackingNumber}` : ""
                })`
              : ""
          }.`,
        timestamp: nowStr,
      });
    } else if (statusNote) {
      updatedHistory.push({
        status: nextStatus,
        note: statusNote,
        timestamp: nowStr,
      });
    }

    const updatedOrder: OrderRecord = {
      ...existing,
      status: nextStatus,
      paymentStatus: paymentStatus ?? existing.paymentStatus,
      courierName: courierName ?? existing.courierName,
      trackingNumber: trackingNumber ?? existing.trackingNumber,
      trackingUrl: trackingUrl ?? existing.trackingUrl,
      adminNotes: adminNotes ?? existing.adminNotes,
      statusHistory: updatedHistory,
      updatedAt: nowStr,
    };

    db.orders[idx] = updatedOrder;
    await writeDbAsync(db);
    revalidatePath("/", "layout");

    return NextResponse.json({ order: updatedOrder, db });
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
