import { defineStore } from 'pinia'

export type MessageType = 'success' | 'error' | 'warning' | 'info'

export interface Message {
  id: number
  type: MessageType
  text: string
  duration?: number
}

let nextId = 1

export const useMessageStore = defineStore('message', {
  state: () => ({
    items: [] as Message[]
  }),

  actions: {
    add(type: MessageType, text: string, duration = 5000) {
      const id = nextId++
      this.items.push({ id, type, text, duration })
      return id
    },

    remove(id: number) {
      const index = this.items.findIndex((m) => m.id === id)
      if (index !== -1) this.items.splice(index, 1)
    },

    success(text: string, duration?: number) {
      return this.add('success', text, duration)
    },
    error(text: string, duration?: number) {
      return this.add('error', text, duration ?? 7000)
    },
    warning(text: string, duration?: number) {
      return this.add('warning', text, duration)
    },
    info(text: string, duration?: number) {
      return this.add('info', text, duration)
    }
  }
})
