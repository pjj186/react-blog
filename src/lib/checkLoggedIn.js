const checkLoggedIn = (ctx, next) => {
  // 로그인 상태가 아니라면 404 HTTP status를 반환하고, 그렇지 않으면 그 다음 미들웨어를 실행
  if (!ctx.state.user) {
    ctx.status = 401; // Unauthorized
    return;
  }
  return next();
};

export default checkLoggedIn;
