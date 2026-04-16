import React, { useState, useEffect, useRef } from 'react'

const emptyItem = () => ({ drug_name: '', strength: '', quantity: '', instructions: '' })

export default function PrescriptionModal({ categories, initial, onSave, onClose }) {
  const isEdit = !!initial?.id
  const [name, setName] = useState(initial?.name || '')
  const [categoryId, setCategoryId] = useState(initial?.category_id || categories[0]?.id || '')
  const [notes, setNotes] = useState(initial?.notes || '')
  const [items, setItems] = useState(initial?.items?.length ? initial.items : [emptyItem()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const firstRef = useRef(null)

  useEffect(() => {
    firstRef.current?.focus()
    // Fechar com ESC
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function updateItem(i, field, value) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: value } : it))
  }

  function addItem() {
    setItems(prev => [...prev, emptyItem()])
  }

  function removeItem(i) {
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }

  function moveItem(i, dir) {
    setItems(prev => {
      const next = [...prev]
      const j = i + dir
      if (j < 0 || j >= next.length) return prev
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return setError('Informe o nome da receita')
    if (!categoryId) return setError('Selecione uma categoria')
    const validItems = items.filter(it => it.drug_name.trim())
    if (validItems.length === 0) return setError('Adicione pelo menos um medicamento')

    setSaving(true)
    setError('')
    try {
      await onSave({ name: name.trim(), category_id: categoryId, notes: notes.trim(), items: validItems })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-8 px-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mb-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? 'Editar receita' : 'Nova receita'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome e categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da receita *</label>
              <input
                ref={firstRef}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Tratamento HAS leve"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <input
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Opcional — ex: apenas para adultos"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Medicamentos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Medicamentos *</label>
              <button
                type="button"
                onClick={addItem}
                className="text-blue-600 text-sm hover:text-blue-800 font-medium"
              >
                + Adicionar linha
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {items.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="grid grid-cols-12 gap-2 mb-2">
                    <div className="col-span-5">
                      <input
                        value={item.drug_name}
                        onChange={e => updateItem(i, 'drug_name', e.target.value)}
                        placeholder="Medicamento *"
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        value={item.strength}
                        onChange={e => updateItem(i, 'strength', e.target.value)}
                        placeholder="Ex: 500 mg"
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        value={item.quantity}
                        onChange={e => updateItem(i, 'quantity', e.target.value)}
                        placeholder="Qtd (20 comp.)"
                        className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-0.5">
                      {items.length > 1 && (
                        <>
                          <button type="button" onClick={() => moveItem(i, -1)} className="text-gray-400 hover:text-gray-600 text-xs" title="Subir">▲</button>
                          <button type="button" onClick={() => moveItem(i, 1)} className="text-gray-400 hover:text-gray-600 text-xs" title="Descer">▼</button>
                          <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-sm ml-0.5" title="Remover">×</button>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    value={item.instructions}
                    onChange={e => updateItem(i, 'instructions', e.target.value)}
                    placeholder="Posologia — ex: 1 comprimido de 8/8 h por 7 dias"
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 font-mono text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
          )}

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-200">
            <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar receita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
