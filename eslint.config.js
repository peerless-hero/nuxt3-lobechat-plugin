/*
 * @Author: peerless_hero peerless_hero@outlook.com
 * @Date: 2024-12-24 00:25:56
 * @LastEditors: peerless_hero peerless_hero@outlook.com
 * @LastEditTime: 2025-03-01 00:15:02
 * @FilePath: \nuxt3-lobechat-plugin\eslint.config.js
 * @Description: 
 * 
 */
// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt(
  await antfu(
    {
      unocss: true,
      formatters: true,
    },
  ),
)
