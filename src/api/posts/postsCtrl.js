import Post from "../../models/post";

export const write = async (ctx) => {
  // 블로그 포스트를 작성하는 API
  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
  });
  try {
    await post.save(); // save() 함수를 실행시켜야 데이터베이스에 저장됨
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const list = (ctx) => {};

export const read = (ctx) => {};

export const remove = (ctx) => {};

export const update = (ctx) => {};
