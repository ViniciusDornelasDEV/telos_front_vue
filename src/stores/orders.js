import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useProductsStore } from './products'
import { useSuppliersStore } from './suppliers'

export const useOrdersStore = defineStore('orders', () => {
  const items = ref([
    {
      id: 1,
      date: '2024-10-01',
      supplier: {
        id: 1,
        name: 'Fornecedor Alpha'
      },
      products: [
        {
          id: 1,
          unitPrice: 25.90,
          quantity: 3
        },
        {
          id: 2,
          unitPrice: 12.50,
          quantity: 2
        }
      ],
      observation: 'Pedido inicial do fornecedor 1',
      status: 'Pendente'
    },
    {
      id: 2,
      date: '2024-10-05',
      supplier: {
        id: 2,
        name: 'Fornecedor Beta'
      },
      products: [
        {
          id: 3,
          unitPrice: 99.90,
          quantity: 1
        }
      ],
      observation: 'Compra pontual',
      status: 'Concluído'
    }
  ])

  const loading = ref(false)

  const productsStore = useProductsStore()
  const suppliersStore = useSuppliersStore()

  function create(order) {
    const id = items.value.length
      ? Math.max(...items.value.map(o => o.id)) + 1
      : 1

    items.value.push({ id, ...order })
  }

  function update(order) {
    const index = items.value.findIndex(o => o.id === order.id)
    if (index !== -1) {
      items.value[index] = { ...order }
    }
  }

  function remove(id) {
    items.value = items.value.filter(o => o.id !== id)
  }

  function getProductsBySupplier(supplierId) {
    return productsStore.items.filter(p => p.supplierId === supplierId)
  }

  function totalValue(order) {
    return order.products.reduce(
      (acc, p) => acc + p.unitPrice * p.quantity,
      0
    )
  }

  return {
    items,
    loading,
    create,
    update,
    remove,
    getProductsBySupplier,
    totalValue
  }
})
