import { getAccessToken, getUploadFileInfo, uploadFile, batchDownloadFile } from './wx';
import picgo from 'picgo'
import { PluginConfig } from 'picgo/dist/src/utils/interfaces'
import { userConfig } from './interface'

const handle = async (ctx: picgo): Promise<picgo> => {
  const userConfig: userConfig = ctx.getConfig('picBed.wxcloud-uploader')
  if (!userConfig) { throw new Error('找不到微信小程序云存储图床配置文件') }
  const { env, path, appId, appSecret } = userConfig
  try {
    let imgList = ctx.output
    for (let i in imgList) {
      const realPath = `${path}${imgList[i].fileName}`
      let image = imgList[i].buffer
      if (!image && imgList[i].base64Image) {
        image = Buffer.from(imgList[i].base64Image, 'base64')
      }
      const accessToken = await getAccessToken(appId,appSecret, ctx)
      const uploadInfo = await getUploadFileInfo(accessToken, env, realPath, ctx)
      const body = await uploadFile(uploadInfo.url, realPath, uploadInfo.authorization,uploadInfo.token,uploadInfo.cos_file_id, image, ctx)
      const imgUrl = await batchDownloadFile(accessToken, env, uploadInfo.file_id, ctx)
      
      delete imgList[i].base64Image
      delete imgList[i].buffer
      imgList[i].imgUrl = imgUrl
    }
    return ctx
  } catch (error) {
    ctx.log.error(error)
    ctx.emit('notification', {
      title: '上传失败',
      body: error.message
    })
  }
}

const config = (ctx: picgo): PluginConfig[] => {
  let userConfig: userConfig = ctx.getConfig('picBed.wxcloud-uploader')
  if (!userConfig) {
    userConfig = {
      appId: '',
      appSecret: '',
      env: '',
      path: ''
    }
  }
  const config = [
    {
      name: 'appId',
      type: 'input',
      default: userConfig.appId,
      message: 'appId 不能为空',
      required: true,
      alias: '小程序appId'
    },
    {
      name: 'appSecret',
      type: 'password',
      default: userConfig.appSecret,
      message: 'appSecret 不能为空',
      required: true,
      alias: '小程序appSecret'
    },
    {
      name: 'env',
      type: 'input',
      default: userConfig.env,
      message: '云环境ID不能为空',
      required: true,
      alias: '云开发环境ID'
    },
    {
      name: 'path',
      type: 'input',
      default: userConfig.path,
      message: '上传路径目录不能为空(不能以/开头，需要以/结尾)',
      required: true,
      alias: 'images/'
    }
  ]
  return config
}

export = (ctx: picgo) => {
  const register = () => {
    ctx.helper.uploader.register('wxcloud-uploader', {
      handle,
      name: '微信小程序云存储',
      config
    })
  }
  return {
    uploader: 'wxcloud-uploader',
    register
  }
}
