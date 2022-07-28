'use strict';
const gatewallet = require('gatewallet');

/**
 * @controller
 */
const Controller = require('egg').Controller;

class VerifyController extends Controller {

    verifyAddress() {
        const { ctx, service } = this;
        const { signature, BJJKey, chainId, address } = ctx.request.body

        const address_ = service.verify.unAddress(BJJKey, chainId, signature);
        // TODO 比较 address 和 address_ 是否一致
        if (address.toLowerCase() !== address_.toLowerCase()) {
            return ctx.body = false
        }

        ctx.body = true
    }

    async verify() {
        const { ctx, service } = this;
        const user_id = parseInt(ctx.request.header['x-gate-user-id'])
        const { tx, type, signature } = ctx.request.body

        //TODO: 后续通过接口查询 bjj_key
        const domain = ctx.app.config.domain
        const path = `/userinfo/${user_id}`;
        const url = `${domain}${path}`;

        const data = await ctx.curl(url);
        if(data.status !== 200) {
            return ctx.body = false
        }
        const body = JSON.parse(data.data.toString())
        ctx.logger.info('body:', body)

        const bjjkey = body.data.key
        if (!bjjkey) {
            return ctx.body = false
        }

        const msg = gatewallet.default.buildTransactionHashMessage(tx, type, ctx.app.config.contract);

        const sign = service.verify.unPackSign(signature)

        const pubKey = service.verify.unpackPoint(bjjkey)

        const isVerify = service.verify.toVerify(msg, sign, pubKey);
        ctx.body = isVerify
    }

}

module.exports = VerifyController;