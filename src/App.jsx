import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar.jsx'
import PrescriptionCard from './components/PrescriptionCard.jsx'
import PrescriptionModal from './components/PrescriptionModal.jsx'
import ScoresPage from './pages/ScoresPage.jsx'
import EmergencyPage from './pages/EmergencyPage.jsx'
import CalculatorsPage from './pages/CalculatorsPage.jsx'
import SummariesPage from './pages/SummariesPage.jsx'
import { api } from './api.js'

export default function App() {
  const [activeModule, setActiveModule] = useState('prescriptions')

  // ── Prescription state ──
  const [categories, setCategories] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [search, setSearch] = useState('')
  const [searchDebounced, setSearchDebounced] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    api.getCategories().then(data => {
      setCategories(data)
      if (data.length > 0 && !selectedCategoryId) setSelectedCategoryId(data[0].id)
    })
  }, [])

  useEffect(() => {
    if (activeModule !== 'prescriptions') return
    setLoading(true)
    const params = searchDebounced
      ? { search: searchDebounced }
      : selectedCategoryId ? { categoryId: selectedCategoryId } : {}
    api.getPrescriptions(params).then(setPrescriptions).finally(() => setLoading(false))
  }, [selectedCategoryId, searchDebounced, activeModule])

  async function handleAddCategory(data) {
    const cat = await api.createCategory(data)
    setCategories(prev => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)))
    setSelectedCategoryId(cat.id)
  }

  async function handleEditCategory(id, data) {
    const updated = await api.updateCategory(id, data)
    setCategories(prev => prev.map(c => c.id === id ? updated : c))
  }

  async function handleDeleteCategory(id) {
    await api.deleteCategory(id)
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id)
      if (selectedCategoryId === id) setSelectedCategoryId(next[0]?.id || null)
      return next
    })
    setPrescriptions(prev => prev.filter(p => p.category_id !== id))
  }

  async function handleSavePrescription(data) {
    if (modal?.data?.id) {
      const updated = await api.updatePrescription(modal.data.id, data)
      setPrescriptions(prev => prev.map(p => p.id === updated.id ? updated : p))
    } else {
      const created = await api.createPrescription(data)
      if (!searchDebounced && (selectedCategoryId === created.category_id || !selectedCategoryId)) {
        setPrescriptions(prev => [...prev, created])
      }
    }
    api.getCategories().then(setCategories)
  }

  async function handleDeletePrescription(id) {
    await api.deletePrescription(id)
    setPrescriptions(prev => prev.filter(p => p.id !== id))
    api.getCategories().then(setCategories)
  }

  const selectedCategory = categories.find(c => c.id === selectedCategoryId)
  const title = searchDebounced
    ? `Resultado: "${searchDebounced}"`
    : selectedCategory?.name || 'Todas as receitas'

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        activeModule={activeModule}
        onModuleChange={m => { setActiveModule(m); setSearch('') }}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={id => { setSelectedCategoryId(id); setSearch('') }}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <div className="flex-1 overflow-hidden flex flex-col">

        {/* ── RECEITAS ── */}
        {activeModule === 'prescriptions' && (
          <>
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shrink-0">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por medicamento, posologia ou receita..."
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">×</button>
                )}
              </div>
              <button onClick={() => setModal({ mode: 'create' })} className="btn-primary whitespace-nowrap">
                + Nova receita
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
                <span className="text-sm text-gray-400">
                  {prescriptions.length} {prescriptions.length === 1 ? 'receita' : 'receitas'}
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                </div>
              ) : prescriptions.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-4xl mb-3">📋</p>
                  <p className="text-lg font-medium">
                    {searchDebounced ? 'Nenhum resultado encontrado' : 'Nenhuma receita nesta categoria'}
                  </p>
                  {!searchDebounced && (
                    <button onClick={() => setModal({ mode: 'create' })} className="mt-4 btn-primary">
                      Criar primeira receita
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 max-w-4xl">
                  {prescriptions.map(p => (
                    <PrescriptionCard
                      key={p.id}
                      prescription={p}
                      onEdit={pr => setModal({ mode: 'edit', data: pr })}
                      onDelete={handleDeletePrescription}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeModule === 'scores'       && <ScoresPage />}
        {activeModule === 'emergencies'  && <EmergencyPage />}
        {activeModule === 'calculators'  && <CalculatorsPage />}
        {activeModule === 'summaries'    && <SummariesPage />}
      </div>

      {modal && (
        <PrescriptionModal
          categories={categories}
          initial={modal.data}
          onSave={handleSavePrescription}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
