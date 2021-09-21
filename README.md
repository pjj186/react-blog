# Koa 기본 사용법

- Koa 애플리케이션은 미들웨어의 배열로 구성되어 있다.
- app.use 함수는 미들웨어 함수를 애플리케이션에 등록하는 역할
- 미들웨어 함수는 다음과 같은 구조를 가지고 있다.

```
(ctx, next) => {

}
```

- Koa의 미들웨어 함수는 ctx, next 두 개의 파라미터를 받는다.

  - ctx는 Context의 줄임말로 웹 요청과 응답에 관한 정보를 지니고 있다.
  - next는 현재 처리 중인 미들웨어의 다음 미들웨어를 호출하는 함수
  - 미들웨어를 등록하고 next 함수를 호출하지 않으면, 그 다음 미들웨어를 처리하지 않는다.
  - 만약 미들웨어에서 next를 사용하지 않으면 ctx => {} 와 같은 형태로 파라미터에 next를 설정하지 않아도 괜찮다.
    - 주로 다음 미들웨어를 처리할 필요가 없는 라우트 미들웨어를 나중에 설정할 때 이러한 구조로 next를 생략하여 미들웨어를 작성

- 미들웨어는 app.use를 사용하여 등록되는 순서대로 처리된다.

## next 함수는 Promise를 반환

- next 함수를 호출하면 Promise를 반환한다. 이는 Koa가 Express와 차별화되는 부분
- next 함수가 반환하는 Promise는 다음에 처리해야 할 미들웨어가 끝나야 완료됨

## async / await 사용하기

- Koa는 async / await를 정식으로 지원하기 때문에 해당 문법을 아주 편하게 사용할 수 있음

## koa-router 사용하기

다음과 같이 사용한다.

```
const Koa = require("koa");
const Router = require("koa-router");

const app = new Koa();
const router = new Router();

// 라우터 설정
router.get("/", (ctx) => {
  ctx.body = "홈";
});
router.get("/about", (ctx) => {
  ctx.body = "소개";
});

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(5000, () => {
  console.log("Listening to port 5000");
});

```

- router.get의 첫 번째 파라미터에는 라우트의 경로를 넣고, 두 번째 파라미터에는 해당 라우트에 적용할 미들웨어 함수를 넣는다.

- 여기서 get 키워드는 해당 라우트에서 사용할 HTTP 메서드를 의미하고, get 대신에 post,put,delete 등을 넣을 수 있다!

- Express와 유사한듯?
