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

  <br>

## next 함수는 Promise를 반환

- next 함수를 호출하면 Promise를 반환한다. 이는 Koa가 Express와 차별화되는 부분
- next 함수가 반환하는 Promise는 다음에 처리해야 할 미들웨어가 끝나야 완료됨

  <br>

## async / await 사용하기

- Koa는 async / await를 정식으로 지원하기 때문에 해당 문법을 아주 편하게 사용할 수 있음

  <br>

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

  <br>

## 라우트 파라미터와 쿼리

- 라우터의 파라미터를 설정할 때는 /about/:name 형식으로 콜론(:)을 사용하여 라우트 경로를 설정한다.
- 파라미터가 있을수도 있고 없을 수도 있다면 /about/:name? 같은 형식으로 파라미터 이름 뒤에 물음표를 사용한다.
- 이렇게 설정한 파라미터는 함수의 ctx.params 객체에서 조회 할 수 있다.

- URL 쿼리의 경우, 예를 들어 /posts/?id=10 같은 형식으로 요청했다면 해당 값을 ctx.query에서 조회할 수 있다. 쿼리 문자열을 자동으로 객체 형태로 파싱해 주므로 별도로 파싱 함수를 돌릴 필요가 없다. (문자열 형태의 쿼리 문자열을 조회해야 할 때는 ctx.querystring을 사용)

- 파라미터와 쿼리는 둘 다 주소를 통해 특정 값을 받아 올 때 사용하지만, 용도가 서로 조금씩 다르다.

  - 정해진 규칙은 없지만, 일반적으로 파라미터는 처리할 작업의 카테고리르 받아 오거나, 고유 ID 혹은 이름으로 특정 데이터를 조회할 때 사용
  - 쿼리는 옵션에 관련된 정보를 받아온다. 예를 들어 여러 항목을 리스팅하는 API라면, 어떤 조건을 만족하는 항목을 보여 줄지 또는 어떤 기준으로 정렬할지를 정해야 할 때 쿼리를 사용

  <br>

## REST API

- 웹 애플리케이션을 만들려면 데이터베이스에 정보를 입력하고 읽어 와야 한다. 그런데 웹 브라우저에서 데이터베이스에 직접 접속하여 데이터를 변경한다면 보안상 문제가 된다. 그래서 REST API를 만들어서 사용한다!

- 클라이언트가 서버에 자신이 데이터를 조회, 생성, 삭제, 업데이트하겠다고 요청하면, 서버는 필요한 로직에 따라 데이터베이스에 접근하여 작업을 처리한다.
- REST API는 요청 종류에 따라 다른 HTTP 메서드를 사용한다. HTTP 메서드는 여러 종류가있으며, 주로 사용하는 메서드는 다음과 같다.

  - GET : 데이터를 조회할 때 사용
  - POST : 데이터를 등록할 때 사용한다. 인증 작업을 거칠 때 사용하기도 한다.
  - DELETE : 데이터를 지울 때 사용한다.
  - PUT : 데이터를 새 정보로 통째로 교체할 때 사용한다.
  - PATCH : 데이터의 특정 필드를 수정할 때 사용한다.

- 메서드의 종류에 따라 get, post, delete, put, patch를 사용하여 라우터에서 각 메서드의 요청을 처리한다.

  - 라우트를 작성할때, route.get 이런식으로 작성했었는데, 여기서 get이 바로 HTTP 메서드 GET이다. POST 요청을 받고싶다면, route.post 이런식으로 입력

- REST API를 설계할 때는 API 주소와 메서드에 따라 어떤 역할을 하는지 쉽게 파악할 수 있도록 작성해야 한다.
  - 블로그 포스트용 REST API 예시
    종류|기능
    ---|---
    POST /posts|포스트 작성
    GET /posts|포스트 목록 조회
    GET /posts/:id|특정 포스트 조회
    DELETE /posts/:id|특정 포스트 삭제
    PATCH /posts/:id|특정 포스트 업데이트(구현 방식에 따라 PUT으로도 사용 가능)
    POST /posts/:id/comments|특정 포스트에 덧글 등록
    GET /posts/:id/comments|특정 포스트의 덧글 목록 조회
    DELETE /posts/:id/comments/:commentId|특정 포스트의 특정 덧글 삭제

## koa-bodyparser

- API 기능을 본격적으로 구현하기 전에 먼저 koa-bodyparser 미들웨어를 적용해야함.
- 이 미들웨어는 POST/PUT/PATCH 같은 메서드의 Request Body에 JSON 형식으로 데이터를 넣어주면, 이를 파싱하여 서버에서 사용할 수 있게 해줌!
