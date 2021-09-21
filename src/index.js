const Koa = require("koa");

const app = new Koa();

app.use(async (ctx, next) => {
  console.log(ctx.url);
  console.log(1);
  if (ctx.query.authorized !== "1") {
    ctx.status = 401; // Unauthorized
    return;
  }
  // next가 반환하는 Promise는 다음에 처리해야 할 미들웨어가 끝나야 완료됨!
  // 즉 아래에 console.log(2)를 해주는 미들웨어의 작업이 끝난 후 END가 호출됨
  await next();
  console.log("END");
});

app.use((ctx, next) => {
  console.log(2);
  next();
});

app.use((ctx) => {
  ctx.body = "hello world";
});

app.listen(5000, () => {
  console.log("Listening to port 5000");
});
