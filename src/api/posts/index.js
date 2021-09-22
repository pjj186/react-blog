const Router = require("koa-router");
const postsCtrl = require("./postsCtrl");

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
posts.put("/:id", postsCtrl.replace);
posts.patch("/:id", postsCtrl.update);
module.exports = posts;
