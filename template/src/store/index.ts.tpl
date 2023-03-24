// 供其他 package 使用，路径不使用 @
import { alertMessage } from '@next/core'
import {
  getExampleUrl
} from '../service/api'
import {
  ExampleForm,
  ExampleLis
} from '../types'

export type State = {
  data: ExampleLis[]
}

export const useCarStore = defineStore('<%= projectName %>', {
  state: (): State => {
    return {
      data: [],
    }
  },
  actions: {
    async getExampleData(params: ExampleForm) {
      const { success, msg, data } = await getExampleUrl(params)
      alertMessage('获取xxx列表', success, msg, 'GET')
      this.data = data
        .reverse()
    }
  },
})
