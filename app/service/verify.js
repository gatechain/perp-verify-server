'use strict';

const circomlib = require('circomlib');
const { utils, Scalar } = require('ffjavascript');
const ethers = require('ethers')

const Service = require('egg').Service;

class VerifyService extends Service {
  /**
 * 验证签名
 * @param {*} msg
 * @param {*} signature => 签名对象
 * @param {*} pubKey => 公钥
 */
  toVerify(msg, signature, pubKey) {
    const isVerify = circomlib.eddsa.verifyPoseidon(msg, signature, pubKey);
    console.log('isVerify', isVerify)
    return isVerify;
  }

  /**
  * hex 转 buffer
  * @param {*} hexString => eg: 0x
  * @returns 
  */
  hexToBuffer(hexString) {
    return Buffer.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)))
  }

  /**
  * 解压签名
  * @param {*} signature 交易签名
  * @returns 
  */
  unPackSign(signature) {
    signature = this.hexToBuffer(signature.slice(2))
    const packedSignature = circomlib.eddsa.unpackSignature(signature);
    return packedSignature;
  }

  /**
  * 解压公钥
  * @param {*} bjjKey 公钥
  * @returns 
  */
  unpackPoint(bjjKey) {
    const bjjScalar = Scalar.fromString(bjjKey.slice(2), 16);
    const bjjBuff = utils.leInt2Buff(bjjScalar, 32);

    const pubKey = circomlib.babyJub.unpackPoint(bjjBuff)
    return pubKey;
  }

  unAddress(BJJKey, chainId, signature) {
    const { ctx } = this;
    const value = {
      "Provider": "GateChain Network",
      "Authorisation": "Account creation",
      "BJJKey": BJJKey,
    }

    const domain = {
      name: value.Provider,
      version: '1',
      chainId: chainId,
      verifyingContract: ctx.app.config.perpContract[chainId].GateChain
    }
    const types = {
      Authorise: [
        { name: 'Provider', type: 'string' },
        { name: 'Authorisation', type: 'string' },
        { name: 'BJJKey', type: 'bytes32' }
      ]
    }

    const address = ethers.utils.verifyTypedData(domain, types, value, signature)
    console.log(address, 'address')
    return address;
  }

}
module.exports = VerifyService;