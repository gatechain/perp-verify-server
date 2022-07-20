'use strict';
module.exports = () => {
    return async function request(ctx, next) {
        const { body, query, method, url, header } = ctx.request;
        // ctx.logger.info(`IP:${header['x-real-ip']}`, header)
        // const real_ip = header['x-real-ip'] || header['host'];

        if (method === 'GET') {
            ctx.logger.info('[ Request ]')
        }
        if (method === 'POST') {
            ctx.logger.info(`[ Request] \n${JSON.stringify(body)}\n`)
        }
        await next();
        ctx.logger.info(`[ Response ] -> [ status: ${ctx.body ? ctx.body.status : 0} message: ${ctx.body ? ctx.body.message : ''} ]`)
    };
};