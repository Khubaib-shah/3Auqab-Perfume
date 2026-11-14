import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readDbAsync, writeDbAsync, DatabaseSchema } from "@/lib/db";

export async function GET() {
  const db = await readDbAsync();
  return NextResponse.json(db);
}

export async function PUT(request: Request) {
  try {
    const partial = (await request.json()) as Partial<DatabaseSchema>;
    const current = await readDbAsync();
    const updated: DatabaseSchema = {
      ...current,
      ...partial,
    };
    await writeDbAsync(updated);
    revalidatePath("/", "layout");
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating store data:", error);
    return NextResponse.json(
      { error: "Failed to update store data" },
      { status: 500 }
    );
  }
}
