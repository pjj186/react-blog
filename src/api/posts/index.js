import Router from "koa-router";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as postsCtrl from "./postsCtrl";

const posts = new Router();

posts.get("/", postsCtrl.list);
posts.post("/", checkLoggedIn, postsCtrl.write);
posts.get("/:id", postsCtrl.getPostById, postsCtrl.read);
posts.delete(
  "/:id",
  postsCtrl.getPostById,
  checkLoggedIn,
  checkOwnPost,
  postsCtrl.remove
);
posts.patch(
  "/:id",
  postsCtrl.getPostById,
  checkLoggedIn,
  checkOwnPost,
  postsCtrl.update
);

export default posts;
