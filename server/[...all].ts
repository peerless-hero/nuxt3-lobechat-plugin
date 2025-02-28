/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2025-03-01 00:25:33
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2025-03-01 00:29:53
 * @FilePath: \nuxt3-lobechat-plugin\server\[...all].ts
 * @Description:
 *
 */
export default defineEventHandler((event) => {
  return sendRedirect(event, '/')
})
