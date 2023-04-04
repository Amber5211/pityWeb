export const CONFIG = {
  URL: 'http://localhost:7777',
  ROLE: {
    0: 'user',
    1: 'admin',
    2: 'superAdmin',
  },
  PROJECT_ROLE_MAP: {
    1: '组长',
    2: '组员',
    // 2: "负责人"
  },
  PRIORITY: ['P0', 'P1', 'P2', 'P3', 'P4'],
  // 用例状态
  CASE_STATUS: {
    1: '调试中',
    2: '暂时关闭',
    3: '正常运行',
  },
  REQUEST_TYPE: {
    1: 'Http',
    2: 'Grpc',
    3: 'Dubbo',
  },
  CASE_BADGE: {
    1: {
      status: 'processing',
      text: '调试中',
    },
    2: {
      status: 'default',
      text: '暂时关闭',
    },
    3: {
      status: 'success',
      text: '正常运行',
    },
  },
  DEFAULT_AVATAR:
    'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn1.itc.cn%2Fimg8%2Fwb%2Frecom%2F2015%2F11%2F24%2F144832579376786755.jpeg&refer=http%3A%2F%2Fn1.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620401980&t=9ee0f5e56b90bb80cfde8f7cc81c81ae',
};
