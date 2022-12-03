import { message } from 'antd';

export default {
  //获取token并组成headers的方法
  headers: (json = true) => {
    const token = localStorage.getItem('pityToken');
    const headers = { token };
    if (json) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  },
  //针对token过期，权限不够的code码进行不同的处理的方法
  response: (res, info = false) => {
    console.log(res);
    console.log(res.code);
    if (res.code === 0) {
      if (info) {
        message.info(res.msg);
      }
      return true;
    }
    if (res.code === 401) {
      //说明用户未认证
      message.info(res.msg);
      localStorage.setItem('pityToken', null);
      localStorage.setItem('pityUser', null);
      window.location.href = '/user/login';
      return false;
    }
    message.error(res.msg);
    return false;
  },
};
