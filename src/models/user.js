import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

// 인스턴스 메서드를 작성할 때는 화살표 함수가 아닌 function 키워드를 사용하여 구현해야한다.
// 함수 내부에서 this에 접근해야 하기 때문인데, this는 문서 인스턴스를 가르킨다. 화살표 함수를 사용하면 this는 문서 인스턴스를 가리키지 못하게 된다.
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword); // 입력된 패스워드와, 해싱된 패스워드를 비교하여 참, 거짓 리턴
  return result; // true / false
};

UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username }); // 스테틱 함수에서의 this는 모델을 가르킨다. 따라서 지금 여기서는 User를 가르킴!
};

UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    // 첫 번째 파라미터에는 토큰 안에 집어넣고 싶은 데이터를 넣습니다.
    {
      _id: this.id,
      username: this.username,
    },
    process.env.JWT_SECRET, // 두 번째 파라미터에는 JWT 암호를 넣습니다.
    {
      expiresIn: "7d", // 토큰 유효기간이 7일 동안 유효함
    }
  );
  return token;
};

const User = mongoose.model("User", UserSchema);

export default User;
