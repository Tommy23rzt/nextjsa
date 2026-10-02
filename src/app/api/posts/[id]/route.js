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

export const GET = async (request, { params }) => {
  const { id } = params;

  try {
    await connect();

    const post = await Post.findById(id);

    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (err) {
    console.error("GET /api/posts/[id]:", err.message);
    return errorResponse(err);
  }
};

export const DELETE = async (request, { params }) => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new NextResponse(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { id } = params;

  try {
    await connect();

    const deletedPost = await Post.findOneAndDelete({
      _id: id,
      username: session.user.name,
    });

    if (!deletedPost) {
      return new NextResponse(JSON.stringify({ error: "not-found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new NextResponse("Post has been deleted", { status: 200 });
  } catch (err) {
    console.error("DELETE /api/posts/[id]:", err.message);
    return errorResponse(err);
  }
};