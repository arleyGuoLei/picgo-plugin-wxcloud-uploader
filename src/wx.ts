import picgo from 'picgo'

export const getAccessToken = async (appid: string, secret: string, ctx: picgo) => {
  const tokenKey = '_wxcloud-uploader-accessToken'
  const localToken = ctx[tokenKey]
  try {
    if (!localToken || Date.now() - localToken.createTime >= localToken.expiresIn) {
      const data = JSON.parse(await ctx.Request
      .request
      .get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`))
      if (!data.access_token) {
        throw new Error(data.errmsg)
      }
      const accessToken = data.access_token
      const expiresIn = data.expires_in * 1000
      ctx[tokenKey] = { accessToken, expiresIn, createTime: Date.now() }
      // ctx.log.success(`#wxcloud: 获取服务器accessToken: ${accessToken}`)
      return accessToken
    }
    // ctx.log.success(`#wxcloud: 获取本地accessToken: ${localToken.accessToken}`)
    return localToken.accessToken
  } catch (error) {
    ctx.log.warn('#wxcloud: 获取access_token失败...')
    throw error
  }
}

/**
 * 获取文件上传链接
 * doc: https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/storage/uploadFile.html
 */
export const getUploadFileInfo = async (accessToken: string, env: string, path: string, ctx: picgo) => {
  try {
    const data = await ctx.Request.request({
      method: 'POST',
      headers: {
        contentType: 'application/json;charset=UTF-8',
        'User-Agent': 'PicGo'
      },
      url: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${accessToken}`,
      json: {
        env,
        path
      }
    })
    if (data.errcode !== 0) {
      throw new Error(data.errmsg)
    }
    return data
  } catch (error) {
    ctx.log.warn('#wxcloud: 获取文件上传链接失败...')
    throw error
  }
}

/**
 * 上传文件
 * doc: https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/storage/uploadFile.html (最下面)
 */
export const uploadFile = async (url, requestPath, authorization, token, fileId, file, ctx: picgo) => {
  try {
    const data = await ctx.Request.request({
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        'User-Agent': 'PicGo'
      },
      url,
      formData: {
        key: requestPath,
        Signature: authorization,
        'x-cos-security-token': token,
        'x-cos-meta-fileid': fileId,
        file
      }
    })
    return data
  } catch (error) {
    ctx.log.warn('#wxcloud: 上传文件失败...')
    throw error
  }
}

/**
 * 文件id链接转下载链接
 * doc: https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/storage/batchDownloadFile.html
 */
export const batchDownloadFile = async (accessToken: string, env: string, fileid: string, ctx: picgo) => {
  try {
    const data = await ctx.Request.request({
      method: 'POST',
      headers: {
        contentType: 'application/json;charset=UTF-8',
        'User-Agent': 'PicGo'
      },
      url: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${accessToken}`,
      json: {
        env,
        file_list: [{
          fileid,
          // "max_age": Number.MAX_SAFE_INTEGER // 文档上写的必传，实际上可以不传。
        }]
      }
    })
    if (data.errcode !== 0) {
      throw new Error(data.errmsg)
    }
    return data.file_list[0].download_url
  } catch (error) {
    ctx.log.warn('#wxcloud: 获取图片链接失败...')
    throw error
  }
}