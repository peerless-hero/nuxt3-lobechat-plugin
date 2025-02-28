/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-12-24 01:53:35
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2025-03-01 01:18:05
 * @FilePath: \nuxt3-lobechat-plugin\server\api\time\manifest.json.get.ts
 * @Description:
 *
 */

import { appAuthor } from '~/constants'

export default defineEventHandler(async (event) => {
  const requestURL = getRequestURL(event, { xForwardedProto: true })
  return {
    manifest_version: 1,
    version: '1.0.0',
    author: appAuthor,
    homepage_url: requestURL.origin,
    identifier: 'current-time',
    api: [
      {
        url: `${requestURL.origin}/api/time/now`,
        name: 'get_time',
        description: 'Retrieves the current system time.',
        parameters: {
          properties: {},
          type: 'object',
        },
        responses: {
          200: {
            description: 'Current time',
            schema: {
              type: 'object',
              properties: {
                time: {
                  type: 'string',
                  description: 'The current time in ISO 8601 format.',
                  example: '2025-02-28T14:54:54Z',
                },
              },
            },
          },
        },
      },
    ],
    meta: {
      title: 'Current Time',
      description: 'Gets the current system time.',
      avatar: `${requestURL.origin}/favicon.ico`,
    },
  }
})
