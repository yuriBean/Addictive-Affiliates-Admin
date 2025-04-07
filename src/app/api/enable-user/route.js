import { disableUser } from "@/app/firebase/adminServices";
import admin from "@/app/firebase/firebaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {

  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await admin.auth().updateUser(userId, { disabled: false });

    await disableUser(userId, true);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error enabling user:", error);
    return NextResponse.json({ error: "Failed to enable user" }, { status: 500 });
  }
}
