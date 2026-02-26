import axios from 'axios'

export interface ViaCepAddress {
  street: string
  district: string
  city: string
  state: string
}

interface ViaCepResponse {
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export async function fetchAddressByCep(cep: string): Promise<ViaCepAddress | null> {
  const cleanCep = cep.replace(/\D/g, '')

  if (cleanCep.length !== 8) {
    return null
  }

  const { data } = await axios.get<ViaCepResponse>(
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
