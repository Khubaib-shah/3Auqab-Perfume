import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readDbAsync, writeDbAsync, ContactMessageRecord } from "@/lib/db";

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

    const newMsg: ContactMessageRecord = {
      id: `msg-${Date.now()}`,
      name: body.name || "Visitor",
      email: body.email || "",
      phone: body.phone || "",
      subject: body.subject || "General Perfume Inquiry",
      message: body.message || "",
      status: "UNREAD",
      createdAt: formatTimestamp(),
    };

    db.messages = [newMsg, ...db.messages];
    await writeDbAsync(db);
    revalidatePath("/", "layout");

    return NextResponse.json({ message: newMsg, db });
  } catch (error) {
    console.error("Failed to save contact message:", error);
    return NextResponse.json(
      { error: "Failed to save contact message" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status, action } = await request.json();
    const db = await readDbAsync();

    if (action === "delete") {
      db.messages = db.messages.filter((m) => m.id !== id);
    } else {
      db.messages = db.messages.map((m) =>
        m.id === id ? { ...m, status: status || "READ" } : m
      );
    }

    await writeDbAsync(db);
    revalidatePath("/", "layout");
    return NextResponse.json({ db });
  } catch (error) {
    console.error("Failed to update contact message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}
