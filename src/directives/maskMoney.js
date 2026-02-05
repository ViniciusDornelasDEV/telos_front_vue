export default {
  beforeMount(el, binding, vnode) {
    let lastValue = ''

    function formatMoney(value) {
      let n = value.replace(/\D/g, '')
      if (!n) return ''

      let integerPart = n.slice(0, -2)
      let decimalPart = n.slice(-2)

      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

      return `R$ ${integerPart},${decimalPart}`
    }

    function parseNumber(value) {
      if (!value) return 0
      let n = value.replace(/\D/g, '')
      if (!n) return 0
      return parseFloat(n.slice(0, -2) + '.' + n.slice(-2))
    }

    function onInput(e) {
      const formatted = formatMoney(e.target.value)
      if (formatted !== lastValue) {
        lastValue = formatted
        e.target.value = formatted

        e.target.dispatchEvent(new Event('input', { bubbles: true }))
        if (vnode.component) {
          vnode.component.exposed.value = parseNumber(formatted)
        } else if (binding.instance) {
          binding.instance.$data[el.getAttribute('v-model')] = parseNumber(formatted)
        }
      }
    }

    el.addEventListener('input', onInput)
    el.__maskMoney__ = onInput

    if (el.value) {
      lastValue = formatMoney(el.value)
      el.value = lastValue
    }
  },

  unmounted(el) {
    if (el.__maskMoney__) {
      el.removeEventListener('input', el.__maskMoney__)
      delete el.__maskMoney__
    }
  }
}
