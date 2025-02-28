/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2025-03-01 00:31:35
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2025-03-01 00:31:41
 * @FilePath: \nuxt3-lobechat-plugin\server\api\time\index.ts
 * @Description:
 *
 */
export default defineEventHandler((event) => {
  return sendRedirect(event, '/api/time/manifest.json')
})
