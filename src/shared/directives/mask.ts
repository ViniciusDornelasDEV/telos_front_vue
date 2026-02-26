import type { DirectiveBinding, ObjectDirective } from 'vue'

function format(value: string, mask: string): string {
  let i = 0
  return mask.replace(/9/g, () => value[i++] || '')
}

const maskDirective: ObjectDirective<HTMLInputElement, string> = {
  mounted(el: HTMLInputElement, binding: DirectiveBinding<string>) {
    function onInput(e: Event) {
      const input = e.target as HTMLInputElement
      const value = input.value.replace(/\D/g, '')
      const maskedValue = format(value, binding.value)

      if (maskedValue !== input.value) {
        input.value = maskedValue
        e.stopPropagation()
        input.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }

    el.addEventListener('input', onInput)
  }
}

export default maskDirective
