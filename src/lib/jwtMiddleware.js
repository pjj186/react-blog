import jwt from "jsonwebtoken";

const jwtMiddleware = (ctx, next) => {
  const token = ctx.cookies.get("access_token"); // get
  if (!token) return next(); // 토큰이 없음
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 해석된 토큰을 미들웨어에서 사용할 수 있게 하려면 ctx 의 state 안에 넣어주면 된다.
    ctx.state.user = {
      _id: decoded._id,
      username: decoded.username,
    };
    console.log(decoded);
    return next();
  } catch (e) {
    // 토큰 검증 실패
    return next();
  }
};

export default jwtMiddleware;
