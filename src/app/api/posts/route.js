import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import connect from "@/utils/db";
import Post from "@/models/Post";

const isDbUnavailable = (err) => err?.message === "Database unavailable";

const errorResponse = (err) => {
  const status = isDbUnavailable(err) ? 503 : 500;
  return new NextResponse(JSON.stringify({ error: status === 503 ? "db-unavailable" : "server-error" }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export const GET = async (request) => {
  const url = new URL(request.url);

  const username = url.searchParams.get("username");

  try {
    await connect();

    const posts = await Post.find(username && { username });

    return new NextResponse(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    console.error("GET /api/posts:", err.message);
    return errorResponse(err);
  }
};

export const POST = async (request) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();

  const newPost = new Post({ ...body, username: session.user.name });

  try {
    await connect();

    await newPost.save();

    return new NextResponse("Post has been created", { status: 201 });
  } catch (err) {
    console.error("POST /api/posts:", err.message);
    return errorResponse(err);
  }
};