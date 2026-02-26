export default {
  mounted(el, binding) {
    function format(value, mask) {
      let i = 0
      return mask.replace(/9/g, _ => value[i++] || '')
    }

    function onInput(e) {
      const input = e.target
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
