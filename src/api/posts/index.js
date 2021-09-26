import Router from "koa-router";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as postsCtrl from "./postsCtrl";

const posts = new Router();

posts.get("/", postsCtrl.list);
posts.post("/", checkLoggedIn, postsCtrl.write);
posts.get("/:id", postsCtrl.checkObjectId, postsCtrl.read);
posts.delete("/:id", postsCtrl.checkObjectId, checkLoggedIn, postsCtrl.remove);
posts.patch("/:id", postsCtrl.checkObjectId, checkLoggedIn, postsCtrl.update);

export default posts;
