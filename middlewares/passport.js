const passport = require('passport');
//passport-jwt là 1 cách thức được passport sử dụng
const jwtStrategy = require('passport-jwt').Strategy;
const {ExtractJwt} = require('passport-jwt');
const { JWT_SECRET } = require('../configs/index');
const User=require('../models/userModel');
/*
jwtFromRequest: truyền qua header kèm bearer bảo mật
secretOrKey: mật khẩu để đối chiếu encode decode
Authorization bắc buộc phải điền giống vậy
FIXME: lưu ý ExtractJwt.fromAuthHeaderAsBearerToken(Authorization) được truyền lên bằng AJAX thông qua header
để lấy đưuọc thì phải xử lỹ chuoix để tách Bearer ra mới lấy được mã token
*/
passport.use(new jwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
  secretOrKey: JWT_SECRET,
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub)//sub là id
    if (!user) return done(null, false)
    done(null, user)
  } catch (error) {
    done(error, false)
  }
}))
