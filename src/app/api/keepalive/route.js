import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/utils/db";

export const GET = async () => {
  try {
    await connect();
    await mongoose.connection.db.admin().command({ ping: 1 });
    return new NextResponse(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Keepalive error:", err.message);
    return new NextResponse(JSON.stringify({ ok: false }), { status: 500 });
  }
};