import Post from "../../models/post";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
  // id 값이 올바른 ObjectId 값인지 검증하는 미들웨어
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  return next();
};

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

export const remove = async (ctx) => {
  // 데이터 삭제
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.statue = 204; // No Content (성공하기는 했지만 응답할 데이터 X)
  } catch (e) {
    ctx.throw(e);
  }
};

export const update = async (ctx) => {
  // 데이터 수정
  const { id } = ctx.params;
  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환합니다.
      // false일 때는 업데이트되기 전의 데이터를 반환.
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
