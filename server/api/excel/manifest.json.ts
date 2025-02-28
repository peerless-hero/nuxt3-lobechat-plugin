/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-12-24 01:53:35
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2025-03-01 03:50:22
 * @FilePath: \nuxt3-lobechat-plugin\server\api\excel\manifest.json.ts
 * @Description:
 *
 */

import { appAuthor } from '~/constants'

export default defineEventHandler(async (event) => {
  const requestURL = getRequestURL(event, { xForwardedProto: true })
  return {
    manifest_version: 1,
    identifier: 'excel-generator',
    version: '1.1.0',
    author: appAuthor,

    homepage_url: requestURL.origin,
    api: [
      {
        url: `${requestURL.origin}/api/excel/xlsx`,
        name: 'create_excel',
        description: 'Generates an Excel file (xlsx) from provided data (2D array), uploads it to S3, and returns a pre-signed URL for download. Supports custom filename and URL expiration.',
        parameters: {
          properties: {
            data: {
              type: 'array',
              description: 'A 2D array representing the data for the Excel file.  The first array contains the headers (column names).  Subsequent arrays represent rows of data. All rows must have the same number of columns as the header row.',
              items: {
                type: 'array',
                items: {
                  type: 'string',
                  description: 'Value of a cell, can be string, number, boolean or null',
                },
              },
              example: [
                ['Name', 'Age', 'City'],
                ['John Doe', 30, 'New York'],
                ['Jane Smith', 25, 'Los Angeles'],
              ],
            },
            filename: {
              type: 'string',
              description: 'Optional. The desired filename for the generated Excel file (without the .xlsx extension). Defaults to \'generated\'.',
            },
            expire: {
              type: 'integer',
              description: 'Optional. The desired expiration time for the generated URL, in seconds. Defaults to 3600 (1 hour).',
              minimum: 60,
              maximum: 604800,
            },
          },
          type: 'object',
          required: ['data'],
        },
        responses: {
          201: {
            description: 'Excel file successfully generated and uploaded. Returns a pre-signed S3 URL and its expiration time.',
            schema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'A pre-signed URL to download the generated Excel file from S3.',
                },
                expire: {
                  type: 'integer',
                  description: 'The expiration time of the URL, in seconds.',
                },
              },
              required: [
                'url',
                'expire',
              ],
            },
          },
          400: {
            description: 'Bad Request.  Error caused by missing or invalid request parameters.',
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number',
                  description: 'http status code',
                },
                statusMessage: {
                  type: 'string',
                  description: 'Status message that describe the error ',
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error. An unexpected error occurred on the server.',
            schema: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'number',
                  description: 'http status code',
                },
                statusMessage: {
                  type: 'string',
                  description: 'Status message that describe the error ',
                },
              },
            },
          },
        },
      },
    ],
    meta: {
      title: 'Excel Generator',
      description: 'Help user to generate excel files',
      avatar: `${requestURL.origin}/favicon.ico`,
    },
  }
})
