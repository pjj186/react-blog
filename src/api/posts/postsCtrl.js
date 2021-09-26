import Post from "../../models/post";
import mongoose from "mongoose";
import Joi from "joi";
// Joi : 검증을 수월하게 해 주는 라이브러리

const { ObjectId } = mongoose.Types;

export const getPostById = async (ctx, next) => {
  // id 값이 올바른 ObjectId 값인지 검증하는 미들웨어
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try {
    const post = await Post.findById(id);
    // 포스트가 존재하지 않을 때
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  if (post.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }
  return next();
};

export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(), // required가 있으면 필수 항목 이라는 의미
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.String()).required(),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }
  // 블로그 포스트를 작성하는 API
  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
    user: ctx.state.user,
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

  // query는 문자열이기 때문에 숫자로 변환
  // 값이 주어지지 않았다면 1을 기본으로 사용
  const page = parseInt(ctx.query.page || "1", 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }
  const { tag, username } = ctx.query;
  // tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지 않음
  // 특정 사용자가 작성한 포스트만 조회하거나 특정 태그가 있는 포스트만 조회하는 기능을 위해 query 객체를 다음과같이 만들고 find함수, countDocuments함수의 파라미터로 전달해줌
  const query = {
    ...(username ? { "user.username": username } : {}),
    ...(tag ? { tags: tag } : {}),
  };
  console.log(query);
  try {
    // 데이터를 역순으로 조회하려면 exec()를 하기전에 sort() 구문을 넣어준다.
    // sort 함수의 파라미터는 {key : 1} 형식으로 넣는데, key는 정렬할 필드를 설정하는 부분이고 오른쪽 값을 1로 섲렁하면 오름차순, -1로 설정하면 내림차순으로 정렬한다.
    // _id를 내림차순으로 정렬하고싶으니 _id 필드를 -1로 설정
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    // find() 함수를 호출한 후에는 exec()를 붙여 주어야 서버에 쿼리를 요청함!
    const postCount = await Post.countDocuments(query).exec(); // countDocuments 메서드는 데이터베이스 컬렉션에 있는 데이터의 수를 세준다.
    ctx.set("Last-page", Math.ceil(postCount / 10)); // Last-page 라는 커스텀 HTTP 헤더를 설정
    ctx.body = posts.map((post) => ({
      ...post,
      body:
        post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const read = async (ctx) => {
  // 특정 포스트 조회
  ctx.body = ctx.state.post;
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
  // write에서 사용한 schema와 비슷한데, required()가 없습니다.
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Bad
    ctx.body = result.error;
    return;
  }
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
