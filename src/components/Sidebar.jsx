import React, { useState } from 'react'

const MODULES = [
  { id: 'prescriptions', label: 'Receitas',   icon: '📋' },
  { id: 'scores',        label: 'Scores',     icon: '🧮' },
  { id: 'emergencies',   label: 'Emergência', icon: '🚨' },
  { id: 'calculators',   label: 'Doses',      icon: '💊' },
  { id: 'summaries',     label: 'Resumos',    icon: '📖' },
]

// ─── Nav data (mirrors page definitions) ────────────────────────────────────

const SCORE_NAV = [
  { id: 'cardio',  label: 'Cardiologia',   icon: '❤️', items: [
    { id: 'chads_vasc',  name: 'CHA₂DS₂-VASc' },
    { id: 'has_bled',    name: 'HAS-BLED' },
    { id: 'heart_score', name: 'HEART Score' },
  ]},
  { id: 'sepsis',  label: 'Sépsis / UCI',  icon: '🏥', items: [
    { id: 'qsofa', name: 'qSOFA' },
    { id: 'sofa',  name: 'SOFA' },
  ]},
  { id: 'monitor', label: 'Monitorização', icon: '📊', items: [
    { id: 'news2',   name: 'NEWS2' },
    { id: 'glasgow', name: 'Glasgow' },
  ]},
  { id: 'pulmo',   label: 'Pneumologia',   icon: '🫁', items: [
    { id: 'curb65', name: 'CURB-65' },
  ]},
  { id: 'hepato',  label: 'Hepatologia',   icon: '🫀', items: [
    { id: 'meld',       name: 'MELD' },
    { id: 'child_pugh', name: 'Child-Pugh' },
  ]},
  { id: 'thrombo', label: 'Trombose',      icon: '🩸', items: [
    { id: 'wells_dvt', name: 'Wells TVP' },
    { id: 'wells_pe',  name: 'Wells TEP' },
  ]},
  { id: 'renal',   label: 'Nefrologia',    icon: '💧', items: [
    { id: 'ckd_epi', name: 'CKD-EPI 2021' },
  ]},
  { id: 'neuro',   label: 'Neurologia',    icon: '🧠', items: [
    { id: 'nihss', name: 'NIHSS' },
    { id: 'abcd2', name: 'ABCD²' },
  ]},
  { id: 'psych',   label: 'Psiquiatria',   icon: '🧩', items: [
    { id: 'phq9', name: 'PHQ-9' },
  ]},
]

const EMERGENCY_NAV = [
  { id: 'cardiac',  label: 'Cardiologia',  icon: '❤️', items: [
    { id: 'pcr',         name: 'PCR / ACLS' },
    { id: 'eap',         name: 'Edema Agudo Pulmão' },
    { id: 'crise_htn',   name: 'Crise Hipertensiva' },
    { id: 'tep_massivo', name: 'TEP Maciço' },
    { id: 'arritmia_fa', name: 'Fibrilhação Auricular' },
    { id: 'tv',          name: 'Taquicardia Ventricular' },
  ]},
  { id: 'neuro',    label: 'Neurologia',   icon: '🧠', items: [
    { id: 'avc_isquemico',   name: 'AVC Isquémico' },
    { id: 'avc_hemorragico', name: 'AVC Hemorrágico' },
    { id: 'status_epilepticus', name: 'Status Epilepticus' },
  ]},
  { id: 'metabolic',label: 'Metabólica',   icon: '🧪', items: [
    { id: 'cad',               name: 'CAD / CAH' },
    { id: 'hipercaliemia',     name: 'Hipercaliemia' },
    { id: 'hipoglicemia_grave',name: 'Hipoglicemia Grave' },
  ]},
  { id: 'sepsis',   label: 'Sépsis',       icon: '🦠', items: [
    { id: 'sepsis_bundle', name: 'Bundle de Sépsis' },
  ]},
  { id: 'resp',     label: 'Respiratório', icon: '🫁', items: [
    { id: 'broncoespasmo', name: 'Broncoespasmo Grave' },
    { id: 'pneumotorax',   name: 'Pneumotórax Hipertensivo' },
  ]},
  { id: 'allergic', label: 'Alérgico',     icon: '⚠️', items: [
    { id: 'anafilaxia', name: 'Anafilaxia' },
  ]},
  { id: 'intox',    label: 'Intoxicações', icon: '☠️', items: [
    { id: 'intox_paracetamol', name: 'Paracetamol' },
    { id: 'intox_opioides',    name: 'Opioides / BZD' },
  ]},
]

const CALC_NAV = [
  { id: 'dose',   label: 'Dose',          icon: '💊', items: [
    { id: 'dose_weight',    name: 'Dose por Peso' },
    { id: 'infusion_rate',  name: 'Velocidade de Perfusão' },
    { id: 'pediatric_dose', name: 'Doses Pediátricas' },
  ]},
  { id: 'renal',  label: 'Renal',         icon: '💧', items: [
    { id: 'cockcroft',    name: 'Cockcroft-Gault' },
    { id: 'renal_adjust', name: 'Ajuste Renal' },
  ]},
  { id: 'electro',label: 'Electrólitos',  icon: '🧪', items: [
    { id: 'na_correction', name: 'Correção do Sódio' },
    { id: 'ca_correction', name: 'Correção do Cálcio' },
    { id: 'osmolarity',    name: 'Osmolalidade' },
    { id: 'anion_gap',     name: 'Anion Gap' },
  ]},
  { id: 'cardio', label: 'Cardiologia',   icon: '❤️', items: [
    { id: 'qtc_calc', name: 'QTc (Bazett)' },
  ]},
  { id: 'other',  label: 'Outros',        icon: '📐', items: [
    { id: 'bmi',           name: 'IMC' },
    { id: 'ibw',           name: 'Peso Ideal' },
    { id: 'map_calc',      name: 'PAM e Pressão de Pulso' },
    { id: 'steroid_equiv', name: 'Equivalência Corticoides' },
  ]},
]

// ─── Generic nav renderer ─────────────────────────────────────────────────────

function GenericNav({ groups, activeId, onSelect, activeClass }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {groups.map(g => (
        <div key={g.id}>
          <div className="px-3 pt-3 pb-1 flex items-center gap-1.5">
            <span className="text-sm">{g.icon}</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{g.label}</span>
          </div>
          {g.items.map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                activeId === item.id ? activeClass : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Prescription sub-nav ─────────────────────────────────────────────────────

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

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar({
  activeModule, onModuleChange,
  categories, selectedCategoryId,
  onSelectCategory, onAddCategory, onEditCategory, onDeleteCategory,
  activeScore, onSelectScore,
  activeEmergency, onSelectEmergency,
  activeCalc, onSelectCalc,
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
          <GenericNav
            groups={SCORE_NAV}
            activeId={activeScore}
            onSelect={onSelectScore}
            activeClass="bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600"
          />
        )}
        {activeModule === 'emergencies' && (
          <GenericNav
            groups={EMERGENCY_NAV}
            activeId={activeEmergency}
            onSelect={onSelectEmergency}
            activeClass="bg-red-50 text-red-700 font-semibold border-r-2 border-red-500"
          />
        )}
        {activeModule === 'calculators' && (
          <GenericNav
            groups={CALC_NAV}
            activeId={activeCalc}
            onSelect={onSelectCalc}
            activeClass="bg-teal-50 text-teal-700 font-semibold border-r-2 border-teal-600"
          />
        )}
        {activeModule === 'summaries' && (
          <div className="p-4 text-center pt-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Resumos</p>
            <p className="text-xs text-gray-400">Referência rápida por tema</p>
          </div>
        )}
      </div>
    </aside>
  )
}
