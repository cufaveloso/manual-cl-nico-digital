import React, { useState } from 'react'

const MODULES = [
  { id: 'prescriptions', label: 'Receitas',    icon: '📋' },
  { id: 'scores',        label: 'Scores',      icon: '🧮' },
  { id: 'emergencies',   label: 'Emergência',  icon: '🚨' },
  { id: 'calculators',   label: 'Doses',       icon: '💊' },
  { id: 'summaries',     label: 'Resumos',     icon: '📖' },
]

function PrescriptionNav({ categories, selectedCategoryId, onSelectCategory, onAddCategory, onEditCategory, onDeleteCategory }) {
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState('disease')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editType, setEditType] = useState('disease')

  function handleAdd(e) {
    e.preventDefault()
    if (!newName.trim()) return
    onAddCategory({ name: newName.trim(), type: newType })
    setNewName('')
    setAdding(false)
  }

  function startEdit(cat) {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditType(cat.type)
  }

  function handleEdit(e) {
    e.preventDefault()
    onEditCategory(editingId, { name: editName.trim(), type: editType })
    setEditingId(null)
  }

  const typeIcon = t => t === 'disease' ? '🏥' : '💊'

  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Categorias</span>
        <button
          onClick={() => setAdding(a => !a)}
          className="text-blue-500 hover:text-blue-700 text-lg leading-none font-light"
          title="Nova categoria"
        >{adding ? '×' : '+'}</button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="px-3 pb-2">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Nome da categoria"
            className="w-full text-sm border border-gray-300 rounded px-2 py-1 mb-1 focus:outline-none focus:border-blue-400"
          />
          <div className="flex gap-1">
            <select
              value={newType}
              onChange={e => setNewType(e.target.value)}
              className="flex-1 text-xs border border-gray-300 rounded px-1 py-1 focus:outline-none"
            >
              <option value="disease">Por doença</option>
              <option value="drug_class">Por classe</option>
            </select>
            <button type="submit" className="btn-primary text-xs px-2 py-1">OK</button>
          </div>
        </form>
      )}

      <ul className="flex-1 overflow-y-auto">
        {categories.map(cat => (
          <li key={cat.id}>
            {editingId === cat.id ? (
              <form onSubmit={handleEdit} className="px-3 py-1">
                <input
                  autoFocus
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1 mb-1 focus:outline-none focus:border-blue-400"
                />
                <div className="flex gap-1">
                  <select
                    value={editType}
                    onChange={e => setEditType(e.target.value)}
                    className="flex-1 text-xs border border-gray-300 rounded px-1 py-1"
                  >
                    <option value="disease">Por doença</option>
                    <option value="drug_class">Por classe</option>
                  </select>
                  <button type="submit" className="btn-primary text-xs px-2 py-1">OK</button>
                  <button type="button" onClick={() => setEditingId(null)} className="btn-ghost text-xs px-1 py-1">×</button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 group hover:bg-blue-50 transition-colors
                  ${selectedCategoryId === cat.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}
              >
                <span className="text-base">{typeIcon(cat.type)}</span>
                <span className={`flex-1 text-sm truncate ${selectedCategoryId === cat.id ? 'text-blue-700 font-semibold' : 'text-gray-700'}`}>
                  {cat.name}
                </span>
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {cat.prescription_count}
                </span>
                <span className="hidden group-hover:flex gap-0.5">
                  <button
                    onClick={e => { e.stopPropagation(); startEdit(cat) }}
                    className="text-gray-400 hover:text-blue-500 p-0.5 rounded text-xs"
                  >✎</button>
                  <button
                    onClick={e => { e.stopPropagation(); if (confirm(`Excluir "${cat.name}"?`)) onDeleteCategory(cat.id) }}
                    className="text-gray-400 hover:text-red-500 p-0.5 rounded text-xs"
                  >×</button>
                </span>
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="p-3 border-t border-gray-100 bg-gray-50 shrink-0">
        <p className="text-xs text-gray-400 text-center">
          {categories.length} {categories.length === 1 ? 'categoria' : 'categorias'}
        </p>
      </div>
    </div>
  )
}

export default function Sidebar({
  activeModule, onModuleChange,
  categories, selectedCategoryId,
  onSelectCategory, onAddCategory, onEditCategory, onDeleteCategory
}) {
  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-blue-700 text-white shrink-0">
        <h1 className="text-base font-bold tracking-tight">MedDesk</h1>
        <p className="text-blue-200 text-xs">Referência clínica</p>
      </div>

      {/* Module tabs */}
      <div className="grid grid-cols-5 border-b border-gray-200 shrink-0">
        {MODULES.map(m => (
          <button
            key={m.id}
            onClick={() => onModuleChange(m.id)}
            title={m.label}
            className={`flex flex-col items-center py-2 px-0.5 transition-colors
              ${activeModule === m.id
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
          >
            <span className="text-sm">{m.icon}</span>
            <span className="mt-0.5 leading-tight text-center" style={{ fontSize: '0.58rem' }}>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Module sub-nav */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeModule === 'prescriptions' && (
          <PrescriptionNav
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onSelectCategory}
            onAddCategory={onAddCategory}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
          />
        )}

        {activeModule === 'scores' && (
          <div className="p-3 text-xs text-gray-500 text-center pt-6">
            Selecione um score no painel principal
          </div>
        )}

        {activeModule === 'emergencies' && (
          <div className="p-3 text-xs text-gray-500 text-center pt-6">
            Selecione uma emergência no painel
          </div>
        )}

        {activeModule === 'calculators' && (
          <div className="p-3 text-xs text-gray-500 text-center pt-6">
            Selecione um calculador no painel
          </div>
        )}

        {activeModule === 'summaries' && (
          <div className="p-3 text-xs text-gray-500 text-center pt-6">
            Resumos de referência rápida
          </div>
        )}
      </div>
    </aside>
  )
}
