'use strict';
module.exports = () => {
  return async function errorHandler(ctx, next) {
    const config = ctx.app.config.GateChain;
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);

      const status = err.status || 500;
      // 所有环境的错误内容不返回给客户端，因为可能包含敏感信息
      const error = err.message;

      if (status === 500) {
        ctx.logger.error('[- SYSTEM ERROR =====>>>', error);
        ctx.body = ctx.response.failByData(status, 'SYSTEM ERROR');
      } else {
        ctx.logger.error('err remind=====>>>', error);
        ctx.body = ctx.response.failByData(status, error);
      }
    }
  };
};
