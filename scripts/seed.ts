import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const postToCreate = [
  {
    id: 1,
    title: "My first post",
    content: "This is my first post",
  },
  {
    id: 2,
    title: "My second post",
    content: "This is my second post",
  },
  {
    id: 3,
    title: "My third post",
    content: "This is my third post",
  },
  {
    id: 4,
    title: "My fourth post",
    content: "This is my fourth post",
  },
  {
    id: 5,
    title: "My fifth post",
    content: "This is my fifth post",
  },
];

const seed = async (posts: typeof postToCreate) => {
  console.log("Creating posts...");
  for (let i = 0; i < posts.length; i++) {
    console.log("Creating post", posts[i]);
    await prisma.post.upsert({
      where: { id: posts[i].id },
      update: posts[i],
      create: posts[i],
    });
  }
};

seed(postToCreate)
  .then(() => {
    console.log("Posts created!");
  })
  .catch((e) => {
    console.error("error", e);
  })
  .finally(() => {
    prisma.$disconnect();
    console.log("Database connection closed");
  });
