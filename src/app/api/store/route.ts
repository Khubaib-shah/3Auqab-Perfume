import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readDbAsync, writeSliceAsync, DatabaseSchema } from "@/lib/db";

export async function GET() {
  const db = await readDbAsync();
  return NextResponse.json(db);
}

export async function PUT(request: Request) {
  try {
    const partial = (await request.json()) as Partial<DatabaseSchema>;
    await writeSliceAsync(partial);
    const updated = await readDbAsync();
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
