import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await sql`DELETE FROM chats WHERE id = ${id} AND user_id = ${userId}`;
  return NextResponse.json({ ok: true });
}
