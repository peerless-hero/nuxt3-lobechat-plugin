/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2025-03-01 00:51:43
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2025-03-01 02:56:15
 * @FilePath: \nuxt3-lobechat-plugin\server\api\excel\xlsx.post.ts
 * @Description:
 *
 */
import process from 'node:process'
import { AwsClient } from 'aws4fetch'
// nuxt3 环境下，xlsx 需要使用 xlsx.mjs
import * as XLSX from 'xlsx/xlsx.mjs'

// 初始化 AwsClient
const aws = new AwsClient({
  accessKeyId: process.env.S3_ACCESS_KEY_ID!,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  service: 's3', // 很重要，必须是 's3' 或其他您使用的 AWS 服务
})

interface RequestBody {
  data: any[][] // Excel 数据，二维数组
  expire?: number // 可选：链接有效期（秒）
  filename?: string // 可选: excel 文件名
}

interface ResponseBody {
  url: string
  expire: number
}

export default defineEventHandler(async (event) => {
  try {
    const body: RequestBody = await readBody(event)
    const { data, expire = 3600, filename = 'generated' } = body
    if (!data || !Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid request body: data is required and must be a non-empty 2D array.' })
    }
    const columnCount = data[0].length
    for (let i = 1; i < data.length; i++) {
      if (!Array.isArray(data[i]) || data[i].length !== columnCount) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid request body: All rows must have the same number of columns as the header row.' })
      }
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // 构建 S3 对象 URL
    const s3Key = `excel/${filename}-${Date.now()}.xlsx`
    const s3Url = `${process.env.S3_ENDPOINT}/${s3Key}`

    // 使用 aws4fetch 上传
    const uploadRequest = await aws.fetch(s3Url, {
      method: 'PUT',
      body: excelBuffer,
    })

    if (!uploadRequest.ok) { // 检查上传是否成功
      const errorText = await uploadRequest.text()
      console.error('S3 Upload failed:', uploadRequest.status, errorText)
      throw createError({ statusCode: 500, statusMessage: `S3 upload failed: ${uploadRequest.status} - ${errorText}` })
    }

    // 使用 aws4fetch 获取预签名 URL (GET 请求)
    const signedUrl = await aws.sign(`${s3Url}?X-Amz-Expires=${expire}`, {
      aws: {
        signQuery: true, // 生成预签名
      },
    })

    const response: ResponseBody = {
      url: signedUrl.url,
      expire,
    }

    setResponseStatus(event, 201)
    return response
  }
  catch (error: any) {
    console.error('生成excel 失败:', error)
    throw createError({ statusCode: error.statusCode, statusMessage: error.statusMessage })
  }
})
