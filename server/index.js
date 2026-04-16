import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import {
  getCategories, createCategory, updateCategory, deleteCategory,
  getPrescriptions, createPrescription, updatePrescription, deletePrescription
} from './database.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Em produção, servir o build do React
app.use(express.static(join(__dirname, '..', 'dist')))

// ───────── CATEGORIAS ─────────

app.get('/api/categories', (req, res) => {
  res.json(getCategories())
})

app.post('/api/categories', (req, res) => {
  const { name, type = 'disease' } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'Nome obrigatório' })
  try {
    res.status(201).json(createCategory(name.trim(), type))
  } catch (err) {
    res.status(409).json({ error: err.message })
  }
})

app.put('/api/categories/:id', (req, res) => {
  const { name, type } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'Nome obrigatório' })
  const updated = updateCategory(Number(req.params.id), name.trim(), type)
  if (!updated) return res.status(404).json({ error: 'Não encontrado' })
  res.json(updated)
})

app.delete('/api/categories/:id', (req, res) => {
  deleteCategory(Number(req.params.id))
  res.json({ ok: true })
})

// ───────── RECEITAS ─────────

app.get('/api/prescriptions', (req, res) => {
  const { categoryId, search } = req.query
  res.json(getPrescriptions({
    categoryId: categoryId ? Number(categoryId) : undefined,
    search: search?.trim() || undefined
  }))
})

app.post('/api/prescriptions', (req, res) => {
  const { category_id, name, notes = '', items = [] } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'Nome obrigatório' })
  if (!category_id) return res.status(400).json({ error: 'Categoria obrigatória' })
  const validItems = items.filter(it => it.drug_name?.trim())
  res.status(201).json(createPrescription(Number(category_id), name.trim(), notes, validItems))
})

app.put('/api/prescriptions/:id', (req, res) => {
  const { category_id, name, notes = '', items = [] } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'Nome obrigatório' })
  const validItems = items.filter(it => it.drug_name?.trim())
  const updated = updatePrescription(Number(req.params.id), Number(category_id), name.trim(), notes, validItems)
  if (!updated) return res.status(404).json({ error: 'Não encontrado' })
  res.json(updated)
})

app.delete('/api/prescriptions/:id', (req, res) => {
  deletePrescription(Number(req.params.id))
  res.json({ ok: true })
})

// Fallback para React Router em produção
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
