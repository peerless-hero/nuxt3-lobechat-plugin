/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-12-24 01:48:14
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2025-02-28 23:44:38
 * @FilePath: \nuxt3-lobechat-plugin\server\api\time\now.get.ts
 * @Description:
 *
 */
export default defineEventHandler(() => {
  const now = new Date()
  return {
    time: now.toISOString(),
  }
})
