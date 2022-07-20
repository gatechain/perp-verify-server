'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 地址验证
  router.post('/address/verify', controller.verify.verifyAddress);
  // 验证签名
  router.post('/verify', controller.verify.verify);
};
