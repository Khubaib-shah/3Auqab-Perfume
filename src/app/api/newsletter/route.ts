import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readDbAsync, writeSliceAsync, NewsletterSubscriberRecord } from "@/lib/db";

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
    const { email, source } = await request.json();
    if (!email || !String(email).includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const normalized = String(email).trim().toLowerCase();
    const db = await readDbAsync();

    const existing = db.subscribers.find(
      (s) => s.email.toLowerCase() === normalized
    );

    if (!existing) {
      const newSub: NewsletterSubscriberRecord = {
        id: `sub-${Date.now()}`,
        email: normalized,
        source: source || "Storefront",
        isActive: true,
        createdAt: formatTimestamp(),
      };
      db.subscribers = [newSub, ...db.subscribers];
      await writeSliceAsync({ subscribers: db.subscribers });
      revalidatePath("/", "layout");
    }

    return NextResponse.json({ db });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, isActive, action } = await request.json();
    const db = await readDbAsync();

    if (action === "delete") {
      db.subscribers = db.subscribers.filter((s) => s.id !== id);
    } else {
      db.subscribers = db.subscribers.map((s) =>
        s.id === id ? { ...s, isActive: Boolean(isActive) } : s
      );
    }

    await writeSliceAsync({ subscribers: db.subscribers });
    revalidatePath("/", "layout");
    return NextResponse.json({ db });
  } catch (error) {
    console.error("Failed to update subscriber:", error);
    return NextResponse.json(
      { error: "Failed to update subscriber" },
      { status: 500 }
    );
  }
}
