import { Elysia, t } from "elysia";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "./handlers";

const postsRouter = new Elysia({ prefix: "/posts" })
  .get("/", getPosts)
  .get("/:id", getPostById, {
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .post("/", createPost, {
    body: t.Object({
      title: t.String({
        minLength: 3,
        maxLength: 50,
      }),
      content: t.String({
        minLength: 3,
        maxLength: 255,
      }),
    }),
  })
  .patch("/:id", updatePost, {
    params: t.Object({
      id: t.Numeric(),
    }),
    body: t.Object({
      title: t.String({
        minLength: 3,
        maxLength: 50,
      }),
      content: t.String({
        minLength: 3,
        maxLength: 255,
      }),
    }),
  })
  .delete("/:id", deletePost, {
    params: t.Object({
      id: t.Numeric(),
    }),
  });
// .get("/", () => getPosts())
// .get(
//   "/:id",
//   ({ params: { id } }) => getPostById({ params: { id: String(id) } }),
//   {
//     params: t.Object({
//       id: t.Numeric(),
//     }),
//   }
// )
// .post("/", ({ body }) => createPost({ body }), {
//   body: t.Object({
//     title: t.String({
//       minLength: 3,
//       maxLength: 50,
//     }),
//     content: t.String({
//       minLength: 3,
//       maxLength: 255,
//     }),
//   }),
// })
// .patch(
//   "/:id",
//   ({ params: { id }, body }) =>
//     updatePost({ params: { id: String(id) }, body }),
//   {
//     params: t.Object({
//       id: t.Numeric(),
//     }),
//     body: t.Object({
//       title: t.String({
//         minLength: 3,
//         maxLength: 50,
//       }),
//       content: t.String({
//         minLength: 3,
//         maxLength: 255,
//       }),
//     }),
//   }
// )
// .delete(
//   "/:id",
//   ({ params: { id } }) => deletePost({ params: { id: String(id) } }),
//   {
//     params: t.Object({
//       id: t.Numeric(),
//     }),
//   }
// );

export default postsRouter;
