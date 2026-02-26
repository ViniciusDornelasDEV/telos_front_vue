import axios from 'axios'

export async function fetchAddressByCep(cep) {
  const cleanCep = cep.replace(/\D/g, '')

  if (cleanCep.length !== 8) {
    return null
  }

  const { data } = await axios.get(
    `https://viacep.com.br/ws/${cleanCep}/json/`
  )

  if (data.erro) {
    throw new Error('CEP não encontrado')
  }

  return {
    street: data.logradouro,
    district: data.bairro,
    city: data.localidade,
    state: data.uf
  }
}
