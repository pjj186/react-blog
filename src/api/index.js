const Router = require("koa-router");
const api = new Router();

api.get("/text", (ctx) => {
  ctx.body = "test 성공";
});

// 라우터를 내보냅니다.
module.exports = api;
