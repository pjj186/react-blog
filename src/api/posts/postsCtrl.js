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

export const list = async (ctx) => {
  // 데이터 조회
  try {
    const posts = await Post.find().exec();
    // find() 함수를 호출한 후에는 exec()를 붙여 주어야 서버에 쿼리를 요청함!
    ctx.body = posts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const read = async (ctx) => {
  // 특정 포스트 조회
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const remove = (ctx) => {};

export const update = (ctx) => {};
