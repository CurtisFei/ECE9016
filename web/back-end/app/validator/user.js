import { config, LinValidator, Rule } from 'lin-mizar';
import { isOptional } from '../lib/util';
import validator from 'validator';

class RegisterValidator extends LinValidator {
  constructor() {
    super();
    this.username = [
      new Rule('isNotEmpty', 'please enter an email'),
      new Rule('isEmail', 'please enter a valid e-mail')
    ];
    this.email = [
      new Rule('isNotEmpty', 'user name can not be null'),
      new Rule('isLength', 'length should be 2-20', 2, 20)
    ];
    this.password = [
      new Rule(
        'matches',
        'The password length must be between 6 and 22 characters, including characters, numbers and _',
        /^[A-Za-z0-9_*&$#@]{6,22}$/
      )
    ];
    this.confirm_password = new Rule('isNotEmpty', 'confirm password cannot be empty');
  }

  validateConfirmPassword(data) {
    if (!data.body.password || !data.body.confirm_password) {
      return [false, 'The passwords entered twice are inconsistent, please re-enter'];
    }
    const ok = data.body.password === data.body.confirm_password;
    if (ok) {
      return ok;
    } else {
      return [false, 'The passwords entered twice are inconsistent, please re-enter'];
    }
  }

  validateGroupIds(data) {
    const ids = data.body.group_ids;
    if (isOptional(ids)) {
      return true;
    }
    if (!Array.isArray(ids)) {
      return [false, '每个id值必须为正整数'];
    }
    for (let id of ids) {
      if (typeof id === 'number') {
        id = String(id);
      }
      if (!validator.isInt(id, { min: 1 })) {
        return [false, '每个id值必须为正整数'];
      }
    }
    return true;
  }
}

class LoginValidator extends LinValidator {
  constructor() {
    super();
    this.username = [
      new Rule('isNotEmpty', 'please enter an email'),
      new Rule('isEmail', 'please enter a valid e-mail')
    ];
    this.password = new Rule('isNotEmpty', 'please enter an password');
    if (config.getItem('loginCaptchaEnabled', false)) {
      this.captcha = new Rule('isNotEmpty', '验证码不能为空');
    }
  }
}

/**
 * 更新用户信息
 */
class UpdateInfoValidator extends LinValidator {
  constructor() {
    super();
    this.email = [
      new Rule('isOptional'),
      new Rule('isLength', 'length should be 2-20', 2, 20)
    ];
    this.nickname = [
      new Rule('isOptional'),
      new Rule('isLength', '昵称长度必须在2~10之间', 2, 24)
    ];
    this.username = [
      new Rule('isOptional'),
      new Rule('isEmail', 'please enter a valid e-mail')
    ];
    this.avatar = [
      new Rule('isOptional'),
      new Rule('isLength', '头像的url长度必须在0~500之间', {
        min: 0,
        max: 500
      })
    ];
  }
}

class ChangePasswordValidator extends LinValidator {
  constructor() {
    super();
    this.new_password = new Rule(
      'matches',
      'The password length must be between 6 and 22 characters, including characters, numbers and _',
      /^[A-Za-z0-9_*&$#@]{6,22}$/
    );
    this.confirm_password = new Rule('isNotEmpty', 'confirm password cannot be empty');
    this.old_password = new Rule('isNotEmpty', 'please enter old password');
  }

  validateConfirmPassword(data) {
    if (!data.body.new_password || !data.body.confirm_password) {
      return [false, 'The passwords entered twice are inconsistent, please re-enter'];
    }
    const ok = data.body.new_password === data.body.confirm_password;
    if (ok) {
      return ok;
    } else {
      return [false, 'The passwords entered twice are inconsistent, please re-enter'];
    }
  }
}

class AvatarUpdateValidator extends LinValidator {
  constructor() {
    super();
    this.avatar = new Rule('isNotEmpty', '必须传入头像的url链接');
  }
}

export {
  ChangePasswordValidator,
  UpdateInfoValidator,
  LoginValidator,
  RegisterValidator,
  AvatarUpdateValidator
};
