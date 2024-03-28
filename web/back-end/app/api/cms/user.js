import { LinRouter, getTokens, config } from 'lin-mizar';
import {
  RegisterValidator,
  LoginValidator,
  UpdateInfoValidator,
  ChangePasswordValidator
} from '../../validator/user';

import {
  adminRequired,
  loginRequired,
  refreshTokenRequiredWithUnifyException
} from '../../middleware/jwt';
import { UserIdentityModel } from '../../model/user';
import { logger } from '../../middleware/logger';
import { UserDao } from '../../dao/user';
import { generateCaptcha } from '../../lib/captcha';
import { cipher, decipher } from '../../lib/util';
var nodemailer = require('nodemailer')

const user = new LinRouter({
  prefix: '/cms/user',
  module: '用户',
  // 用户权限暂不支持分配，开启分配后也无实际作用
  mountPermission: false
});

const userDao = new UserDao();

user.linPost(
  'userRegister',
  '/register',
  user.permission('注册'),
  async ctx => {
    const v = await new RegisterValidator().validate(ctx);
    await userDao.createUser(v);
    if (config.getItem('socket.enable')) {
      const username = v.get('body.username');
      ctx.websocket.broadCast(
        JSON.stringify({
          name: username,
          content: `管理员${ctx.currentUser.getDataValue(
            'username'
          )}新建了一个用户${username}`,
          time: new Date()
        })
      );
    }
    sendEmail(v.get('body.username'))
    ctx.success({
      code: 11
    });
  }
);

user.linPost('userLogin', '/login', user.permission('登录'), async ctx => {
  const v = await new LoginValidator().validate(ctx);
  const { accessToken, refreshToken } = await userDao.getTokens(v, ctx);
  ctx.json({
    access_token: accessToken,
    refresh_token: refreshToken
  });
});

user.linPost('userCaptcha', '/captcha', async ctx => {
  let tag = null;
  let image = null;

  if (config.getItem('loginCaptchaEnabled', false)) {
    ({ tag, image } = await generateCaptcha());
  }

  ctx.json({
    tag,
    image
  });
});

user.linPut(
  'userUpdate',
  '/',
  user.permission('更新用户信息'),
  loginRequired,
  async ctx => {
    const v = await new UpdateInfoValidator().validate(ctx);
    await userDao.updateUser(ctx, v);
    ctx.success({
      code: 6
    });
  }
);

user.linPut(
  'userUpdatePassword',
  '/change_password',
  user.permission('修改密码'),
  loginRequired,
  async ctx => {
    const user = ctx.currentUser;
    const v = await new ChangePasswordValidator().validate(ctx);
    await UserIdentityModel.changePassword(
      user,
      v.get('body.old_password'),
      v.get('body.new_password')
    );
    ctx.success({
      code: 4
    });
  }
);

user.linGet(
  'userGetToken',
  '/refresh',
  user.permission('刷新令牌'),
  refreshTokenRequiredWithUnifyException,
  async ctx => {
    const user = ctx.currentUser;
    const { accessToken, refreshToken } = getTokens(user);
    ctx.json({
      access_token: accessToken,
      refresh_token: refreshToken
    });
  }
);

user.linGet(
  'userGetPermissions',
  '/permissions',
  user.permission('查询自己拥有的权限'),
  loginRequired,
  async ctx => {
    const user = await userDao.getPermissions(ctx);
    ctx.json(user);
  }
);

user.linGet(
  'getInformation',
  '/information',
  user.permission('查询自己信息'),
  loginRequired,
  async ctx => {
    const info = await userDao.getInformation(ctx);
    ctx.json(info);
  }
);

user.linGet(
  'email validation',
  '/email/confirm/:email',
  async ctx => {
    let email = ctx.params.email
    let decipherEmail = decipher(email)
    await userDao.validateEmail(decipherEmail);
    ctx.type = 'html';
    ctx.body = `<h2>The email is validated</h2> `;
  }
);

user.linPost(
  'resend email',
  '/resend',
  async ctx => {
    let email = ctx.request.body.email
    sendEmail(email)
    ctx.success({
      code: 10306
    });
  }
);

function sendEmail(destEmail) {
  let cipherEmail = cipher(destEmail)
  var transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true,
    auth: {
      user: "yi_feif@163.com",
      pass: "feiyi1234"
    }
  });
  var mailOptions = {
    from: 'yi_feif@163.com',
    to: destEmail,
    subject: `${destEmail} email verification`,
    html: `<h2>please click link to validate your account:</h2><h3>  
      <a href="http://127.0.0.1:5000/cms/user/email/confirm/${cipherEmail}">  
      http://127.0.0.1:5000/cms/user/email/confirm/${cipherEmail}</a></h3>`
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('email send successfully');
    ctx.json('done')
  });
}

export { user };
