const BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }))
    throw new Error(err.error || `Erro ${res.status}`)
  }
  return res.json()
}

export const api = {
  // Categorias
  getCategories: () => request('/categories'),
  createCategory: (data) => request('/categories', { method: 'POST', body: data }),
  updateCategory: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: data }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Receitas
  getPrescriptions: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/prescriptions${qs ? '?' + qs : ''}`)
  },
  createPrescription: (data) => request('/prescriptions', { method: 'POST', body: data }),
  updatePrescription: (id, data) => request(`/prescriptions/${id}`, { method: 'PUT', body: data }),
  deletePrescription: (id) => request(`/prescriptions/${id}`, { method: 'DELETE' })
}
