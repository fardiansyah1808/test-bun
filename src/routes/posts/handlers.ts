import { NotFoundError } from "elysia";
import db from "../../lib/db";

export async function getPosts() {
  try {
    return await db.post.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function getPostById({ params }: { params: { id: string } }) {
  try {
    const post = await db.post.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!post) {
      throw new NotFoundError("Post not found!!");
    }
    return post;
  } catch (error) {
    throw error;
  }
}

export async function createPost({
  body,
}: {
  body: { title: string; content: string };
}) {
  try {
    const post = await db.post.create({ data: body });
    return `Post created with id: ${post.title}`;
  } catch (error) {
    throw error;
  }
}
export async function updatePost({
  params,
  body,
}: {
  params: { id: string };
  body: { title: string; content: string };
}) {
  try {
    const post = await db.post.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(body.title ? { title: body.title } : {}),
        ...(body.content ? { content: body.content } : {}),
      },
    });
    if (!post) {
      throw new NotFoundError("Post not found!!");
    }
    return `Post updated with id: ${post.id} with title: ${post.title}`;
  } catch (error) {
    throw error;
  }
}

export async function deletePost({ params }: { params: { id: string } }) {
  try {
    const post = await db.post.delete({ where: { id: parseInt(params.id) } });
    return `Post deleted with id: ${post.id} with title: ${post.title}`;
  } catch (error) {
    throw error;
  }
}
