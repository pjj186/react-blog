import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

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

const User = mongoose.model("User", UserSchema);

export default User;
