import Router from "koa-router";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as postsCtrl from "./postsCtrl";

const posts = new Router();

posts.get("/", postsCtrl.list);
posts.post("/", checkLoggedIn, postsCtrl.write);
posts.get("/:id", postsCtrl.read);
posts.delete("/:id", checkLoggedIn, postsCtrl.remove);
posts.patch("/:id", checkLoggedIn, postsCtrl.update);

export default posts;
