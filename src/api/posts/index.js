import Router from "koa-router";
import * as postsCtrl from "./postsCtrl";

const posts = new Router();

const printInfo = (ctx) => {
  ctx.body = {
    method: ctx.method, // 현재 요청의 메서드
    path: ctx.path, // 현재 요청의 경로
    params: ctx.params, // 현재 요청의 파라미터
  };
};

posts.get("/", postsCtrl.list);
posts.post("/", postsCtrl.write);
posts.get("/:id", postsCtrl.read);
posts.delete("/:id", postsCtrl.remove);
posts.patch("/:id", postsCtrl.update);

export default posts;
