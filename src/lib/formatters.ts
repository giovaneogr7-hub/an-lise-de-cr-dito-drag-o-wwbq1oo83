export const maskCPF = (value: string) => {
  let v = value.replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return v
}

export const maskPhone = (value: string) => {
  let v = value.replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
  v = v.replace(/(\d)(\d{4})$/, '$1-$2')
  return v
}

export const maskCurrency = (value: string) => {
  const num = value.replace(/\D/g, '')
  if (!num) return ''
  const amount = parseInt(num, 10) / 100
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)
}

export const maskDate = (value: string) => {
  let v = value.replace(/\D/g, '')
  if (v.length > 8) v = v.slice(0, 8)
  v = v.replace(/(\d{2})(\d)/, '$1/$2')
  v = v.replace(/(\d{2})(\d)/, '$1/$2')
  return v
}
