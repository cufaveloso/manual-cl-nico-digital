import React, { useState } from 'react'

function formatItem(item) {
  const drug = item.strength ? `${item.drug_name} ${item.strength}` : item.drug_name
  return `${drug.padEnd(35, ' ')} ${item.quantity}\n   ${item.instructions}`
}

function formatAll(prescription) {
  return prescription.items.map(formatItem).join('\n\n')
}

function RxItemRow({ item, onCopy }) {
  const [copied, setCopied] = useState(false)
  const drugLabel = item.strength ? `${item.drug_name} ${item.strength}` : item.drug_name

  function copy() {
    navigator.clipboard.writeText(formatItem(item))
    setCopied(true)
    onCopy?.()
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div
      className={`group rounded px-2 py-1.5 -mx-2 transition-all ${copied ? 'copied-flash' : 'hover:bg-gray-50'}`}
    >
      <div className="rx-line">
        <span className="rx-drug">{drugLabel}</span>
        <span className="rx-dots" aria-hidden="true" />
        <span className="rx-qty">{item.quantity}</span>
        <button
          onClick={copy}
          title="Copiar linha"
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-blue-600 text-xs px-1.5 py-0.5 rounded hover:bg-blue-50"
        >
          {copied ? '✓' : '⧉'}
        </button>
      </div>
      <div className="rx-instructions">{item.instructions}</div>
    </div>
  )
}

function printPrescription(prescription) {
  const win = window.open('', '_blank', 'width=640,height=900')
  if (!win) return
  const rows = prescription.items.map(item => {
    const drug = item.strength ? `${item.drug_name} ${item.strength}` : item.drug_name
    return `<div class="item">
      <div class="drug">${drug} <span class="qty">· ${item.quantity}</span></div>
      <div class="ins">${item.instructions}</div>
    </div>`
  }).join('')
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>${prescription.name}</title>
    <style>
      body { font-family: 'Courier New', monospace; padding: 2.5cm 2cm; font-size: 11pt; color: #111; }
      h1 { font-size: 13pt; font-weight: bold; margin: 0 0 4px; }
      .sub { font-size: 9pt; color: #555; margin-bottom: 12px; }
      hr { border: none; border-top: 1px solid #aaa; margin: 8px 0 16px; }
      .item { margin-bottom: 1.4em; }
      .drug { font-weight: bold; font-size: 11pt; }
      .qty { font-weight: normal; color: #444; }
      .ins { margin-left: 1.2em; font-size: 10pt; color: #333; margin-top: 2px; }
      @media print { body { padding: 1.5cm 1.5cm; } }
    </style>
  </head><body>
    <h1>${prescription.name}</h1>
    ${prescription.notes ? `<div class="sub">${prescription.notes}</div>` : ''}
    <hr>
    ${rows}
  </body></html>`)
  win.document.close()
  setTimeout(() => { win.focus(); win.print() }, 250)
}

export default function PrescriptionCard({ prescription, onEdit, onDelete }) {
  const [copiedAll, setCopiedAll] = useState(false)

  function copyAll() {
    navigator.clipboard.writeText(formatAll(prescription))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{prescription.name}</h3>
          {prescription.notes && (
            <p className="text-xs text-gray-500 mt-0.5">{prescription.notes}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => printPrescription(prescription)}
            className="btn text-xs bg-white text-gray-600 border border-gray-300 hover:bg-gray-100 flex items-center gap-1"
            title="Imprimir receita"
          >
            🖨 Imprimir
          </button>
          <button
            onClick={copyAll}
            className={`btn text-xs flex items-center gap-1 ${
              copiedAll
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
            }`}
            title="Copiar receita completa"
          >
            {copiedAll ? '✓ Copiado!' : '⧉ Copiar tudo'}
          </button>
          <button
            onClick={() => onEdit(prescription)}
            className="btn-ghost text-sm px-2"
            title="Editar"
          >✎</button>
          <button
            onClick={() => { if (confirm(`Excluir "${prescription.name}"?`)) onDelete(prescription.id) }}
            className="btn-danger text-sm px-2"
            title="Excluir"
          >×</button>
        </div>
      </div>

      {/* Medicamentos */}
      <div className="px-4 py-3 space-y-1">
        {prescription.items.length === 0 ? (
          <p className="text-xs text-gray-400 italic">Nenhum medicamento cadastrado.</p>
        ) : (
          prescription.items.map(item => (
            <RxItemRow key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  )
}
