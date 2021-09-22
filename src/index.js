const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");

const api = require("./api");

const app = new Koa();
const router = new Router();

// 라우터 설정
router.get("/", (ctx) => {
  ctx.body = "홈";
});

// 라우터 적용 전에 bodyParser 적용
app.use(bodyParser());

router.use("/api", api.routes()); // api 라우트 적용

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(5000, () => {
  console.log("Listening to port 5000");
});
