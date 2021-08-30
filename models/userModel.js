const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const UserSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  decks: [{
    type: Schema.Types.ObjectId,
    ref: 'Deck'
  }],
});
// trước khi lưu vào đây để chuyển đối mật khẩu để bảo mật
UserSchema.pre('save',async function (next){
  try {
    // Generate a salt (tạo ra 1 đoạn ramdom kết hợp mới mật khẩu )
    console.log('🔥 password',this.password);
    const salt = await bcrypt.genSalt(10);
    console.log('🔥salt',salt)
    // Generate a password hash(salt+hash)
    const passwordHashed=await bcrypt.hash(this.password,salt);
    console.log('🔥passwordHashed',passwordHashed);
    // Re-assign password hashed
    this.password=passwordHashed;
    next();
  } catch (error) {
    next(error);
  }
})
//khi người dùng gửi mật khẩu lên thì vào đây so sánh với mật khẩu ở database
//=> hàm này được sử dụng ở  passport.js
UserSchema.methods.isValidPassword = async function(newPassword) {
  try {
    /*
    newPassword: password của người dùng nhập
    this.password: password trong csdl
    trả về true or false
    */
    return await  bcrypt.compare(newPassword,this.password);
  } catch (error) {
    // Nếu có lỗi thì bắn ra luôn
    throw new Error(error)
  }
}
const User = mongoose.model('User', UserSchema);
module.exports = User;