<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessageStore } from '@/shared/store/messageStore'

const messageStore = useMessageStore()
const { items } = storeToRefs(messageStore)

const timeouts = new Map<number, number>()

watch(
  items,
  (newItems) => {
    for (const msg of newItems) {
      if (msg.duration && msg.duration > 0 && !timeouts.has(msg.id)) {
        const id = setTimeout(() => {
          messageStore.remove(msg.id)
          timeouts.delete(msg.id)
        }, msg.duration)
        timeouts.set(msg.id, id)
      }
    }
  },
  { immediate: true, deep: true }
)

onBeforeUnmount(() => {
  timeouts.forEach((id) => clearTimeout(id))
  timeouts.clear()
})

function dismiss(id: number) {
  const t = timeouts.get(id)
  if (t) {
    clearTimeout(t)
    timeouts.delete(id)
  }
  messageStore.remove(id)
}
</script>

<template>
  <div
    class="toast-container"
    aria-live="polite"
  >
    <TransitionGroup
      name="toast"
      tag="div"
      class="toast-list"
    >
      <div
        v-for="msg in items"
        :key="msg.id"
        class="toast"
        :class="`toast--${msg.type}`"
        role="alert"
      >
        <span class="toast__text">{{ msg.text }}</span>
        <button
          type="button"
          class="toast__close"
          aria-label="Fechar"
          @click="dismiss(msg.id)"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 28rem;
  min-width: 20rem;
  width: 100%;
  pointer-events: none;
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
  white-space: pre-wrap;
  word-break: break-word;
  min-width: 0;
}

.toast--error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.toast--success {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.toast--warning {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}

.toast--info {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.toast__text {
  flex: 1;
  min-width: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.toast__close {
  flex-shrink: 0;
  flex-grow: 0;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1;
  color: inherit;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.toast__close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
