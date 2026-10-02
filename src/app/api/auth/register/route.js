import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const badRequest = (error) =>
  new NextResponse(JSON.stringify({ error }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST = async (request) => {
  const { name, email, password } = await request.json();

  if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
    return badRequest("Invalid input");
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (trimmedName.length < 1 || trimmedName.length > 50) {
    return badRequest("Username must be 1-50 characters");
  }

  if (!EMAIL_PATTERN.test(trimmedEmail) || trimmedEmail.length > 254) {
    return badRequest("Invalid email");
  }

  if (password.length < 8 || password.length > 128) {
    return badRequest("Password must be 8-128 characters");
  }

  await connect();

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = new User({
    name: trimmedName,
    email: trimmedEmail,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return new NextResponse("User has been created", {
      status: 201,
    });
  } catch (err) {
    console.error("Register error:", err);
    return new NextResponse(
      JSON.stringify({ error: "Registration failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
