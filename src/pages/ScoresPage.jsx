import React, { useState } from 'react'

// ─── Score definitions ──────────────────────────────────────────────────────

const SCORE_GROUPS = [
  { id: 'cardio',   label: 'Cardiologia',      icon: '❤️',  items: ['chads_vasc', 'has_bled', 'heart_score'] },
  { id: 'sepsis',   label: 'Sépsis / UCI',     icon: '🏥',  items: ['qsofa', 'sofa'] },
  { id: 'monitor',  label: 'Monitorização',    icon: '📊',  items: ['news2', 'glasgow'] },
  { id: 'pulmo',    label: 'Pneumologia',      icon: '🫁',  items: ['curb65'] },
  { id: 'hepato',   label: 'Hepatologia',      icon: '🫀',  items: ['meld', 'child_pugh'] },
  { id: 'thrombo',  label: 'Trombose',         icon: '🩸',  items: ['wells_dvt', 'wells_pe'] },
  { id: 'renal',    label: 'Nefrologia',       icon: '💧',  items: ['ckd_epi'] },
]

// ── field types: 'check' | 'select' | 'number' ──────────────────────────────

const SCORES = {

  // ── CHA₂DS₂-VASc ──────────────────────────────────────────────────────────
  chads_vasc: {
    name: 'CHA₂DS₂-VASc',
    desc: 'Risco tromboembólico na fibrilhação auricular',
    ref: 'ESC 2020',
    fields: [
      { id: 'hf',       type: 'check', label: 'Insuficiência cardíaca / FEVE reduzida',              pts: 1 },
      { id: 'htn',      type: 'check', label: 'Hipertensão arterial',                                pts: 1 },
      { id: 'age75',    type: 'check', label: 'Idade ≥ 75 anos',                                     pts: 2 },
      { id: 'dm',       type: 'check', label: 'Diabetes mellitus',                                   pts: 1 },
      { id: 'stroke',   type: 'check', label: 'AVC / AIT / Tromboembolismo prévio',                  pts: 2 },
      { id: 'vasc',     type: 'check', label: 'Doença vascular (IAM, DAP, placa aórtica)',            pts: 1 },
      { id: 'age65',    type: 'check', label: 'Idade 65–74 anos',                                    pts: 1 },
      { id: 'female',   type: 'check', label: 'Sexo feminino',                                       pts: 1 },
    ],
    calculate(v) {
      const score = this.fields.reduce((s, f) => s + (v[f.id] ? f.pts : 0), 0)
      const onlyFemale = score === 1 && v.female && !v.hf && !v.htn && !v.age75 && !v.dm && !v.stroke && !v.vasc && !v.age65
      let color, interp, rec
      if (score === 0 || onlyFemale) {
        color = 'green'; interp = 'Baixo risco'
        rec = 'Anticoagulação não recomendada'
      } else if (score === 1 && !v.female) {
        color = 'yellow'; interp = 'Risco intermédio'
        rec = 'Considerar anticoagulação (avaliar HAS-BLED)'
      } else {
        color = 'red'; interp = `Alto risco`
        rec = 'Anticoagulação oral indicada (NOAC preferível a AVK)'
      }
      return { score, max: 9, color, interp, rec }
    }
  },

  // ── HAS-BLED ───────────────────────────────────────────────────────────────
  has_bled: {
    name: 'HAS-BLED',
    desc: 'Risco hemorrágico sob anticoagulação',
    ref: 'ESC 2020',
    fields: [
      { id: 'htn',      type: 'check', label: 'H — Hipertensão não controlada (PAS > 160 mmHg)',     pts: 1 },
      { id: 'renal',    type: 'check', label: 'A — Disfunção renal (Cr > 200 µmol/L ou diálise)',    pts: 1 },
      { id: 'liver',    type: 'check', label: 'A — Disfunção hepática (cirrose ou bilirrubina > 2×)',pts: 1 },
      { id: 'stroke',   type: 'check', label: 'S — AVC prévio',                                      pts: 1 },
      { id: 'bleed',    type: 'check', label: 'B — Hemorragia prévia ou predisposição (anemia)',      pts: 1 },
      { id: 'inr',      type: 'check', label: 'L — INR lábil (TTR < 60%)',                           pts: 1 },
      { id: 'elderly',  type: 'check', label: 'E — Idade > 65 anos',                                 pts: 1 },
      { id: 'drugs',    type: 'check', label: 'D — Antiagregantes plaquetários / AINEs',              pts: 1 },
      { id: 'alcohol',  type: 'check', label: 'D — Álcool (≥ 8 bebidas/semana)',                     pts: 1 },
    ],
    calculate(v) {
      const score = this.fields.reduce((s, f) => s + (v[f.id] ? f.pts : 0), 0)
      let color, interp, rec
      if (score <= 2) {
        color = 'green'; interp = 'Risco baixo a moderado'
        rec = 'Anticoagulação geralmente segura. Corrigir fatores modificáveis.'
      } else {
        color = 'red'; interp = 'Risco elevado de hemorragia'
        rec = 'Precaução — não é contraindicação absoluta. Corrigir fatores modificáveis (H, A, L, D).'
      }
      return { score, max: 9, color, interp, rec }
    }
  },

  // ── HEART Score ────────────────────────────────────────────────────────────
  heart_score: {
    name: 'HEART Score',
    desc: 'Risco de evento cardíaco major na dor torácica',
    ref: 'Six 2008',
    fields: [
      { id: 'history', type: 'select', label: 'História', options: [
        { label: 'Ligeiramente suspeita', value: 0 },
        { label: 'Moderadamente suspeita', value: 1 },
        { label: 'Altamente suspeita', value: 2 },
      ]},
      { id: 'ecg', type: 'select', label: 'ECG', options: [
        { label: 'Normal', value: 0 },
        { label: 'Alterações inespecíficas', value: 1 },
        { label: 'Desvio ST significativo', value: 2 },
      ]},
      { id: 'age', type: 'select', label: 'Idade', options: [
        { label: '< 45 anos', value: 0 },
        { label: '45–64 anos', value: 1 },
        { label: '≥ 65 anos', value: 2 },
      ]},
      { id: 'rf', type: 'select', label: 'Fatores de risco (HTA, DM, hipercolesterolemia, obesidade, tabagismo, FHx)', options: [
        { label: 'Sem fatores conhecidos', value: 0 },
        { label: '1–2 fatores ou antecedentes de aterosclerose', value: 1 },
        { label: '≥ 3 fatores ou aterosclerose conhecida', value: 2 },
      ]},
      { id: 'troponin', type: 'select', label: 'Troponina (múltiplos do LSN)', options: [
        { label: '≤ LSN', value: 0 },
        { label: '1–3 × LSN', value: 1 },
        { label: '> 3 × LSN', value: 2 },
      ]},
    ],
    calculate(v) {
      const score = this.fields.reduce((s, f) => s + (Number(v[f.id]) || 0), 0)
      let color, interp, rec
      if (score <= 3) {
        color = 'green'; interp = 'Baixo risco (MACE < 2%)'
        rec = 'Alta precoce com seguimento ambulatório em 1–2 semanas'
      } else if (score <= 6) {
        color = 'yellow'; interp = 'Risco intermédio (MACE ~12–17%)'
        rec = 'Internamento, monitorização, repetir troponina, avaliação cardiológica'
      } else {
        color = 'red'; interp = 'Alto risco (MACE > 50%)'
        rec = 'Internamento urgente, coronariografia precoce'
      }
      return { score, max: 10, color, interp, rec }
    }
  },

  // ── qSOFA ──────────────────────────────────────────────────────────────────
  qsofa: {
    name: 'qSOFA',
    desc: 'Triagem rápida de sépsis fora da UCI',
    ref: 'Sepsis-3 2016',
    fields: [
      { id: 'rr',   type: 'check', label: 'Frequência respiratória ≥ 22 rpm',            pts: 1 },
      { id: 'ms',   type: 'check', label: 'Alteração do estado mental (GCS < 15)',        pts: 1 },
      { id: 'sbp',  type: 'check', label: 'Pressão arterial sistólica ≤ 100 mmHg',       pts: 1 },
    ],
    calculate(v) {
      const score = this.fields.reduce((s, f) => s + (v[f.id] ? f.pts : 0), 0)
      let color, interp, rec
      if (score < 2) {
        color = 'green'; interp = 'Baixo risco imediato'
        rec = 'Reavaliar se deterioração clínica'
      } else {
        color = 'red'; interp = 'Alto risco de disfunção orgânica (sépsis provável)'
        rec = 'Calcular SOFA completo. Hemoculturas + ATB em < 1h. Avaliação UCI.'
      }
      return { score, max: 3, color, interp, rec }
    }
  },

  // ── SOFA ───────────────────────────────────────────────────────────────────
  sofa: {
    requiresInteraction: true,
    name: 'SOFA',
    desc: 'Disfunção orgânica na sépsis (Sequential Organ Failure Assessment)',
    ref: 'Sepsis-3 2016',
    fields: [
      { id: 'resp', type: 'select', label: 'Respiração — PaO₂/FiO₂ (mmHg)', options: [
        { label: '≥ 400', value: 0 },
        { label: '300–399', value: 1 },
        { label: '200–299', value: 2 },
        { label: '100–199 (com suporte ventilatório)', value: 3 },
        { label: '< 100 (com suporte ventilatório)', value: 4 },
      ]},
      { id: 'plt', type: 'select', label: 'Coagulação — Plaquetas (× 10³/µL)', options: [
        { label: '≥ 150', value: 0 },
        { label: '100–149', value: 1 },
        { label: '50–99', value: 2 },
        { label: '20–49', value: 3 },
        { label: '< 20', value: 4 },
      ]},
      { id: 'bili', type: 'select', label: 'Fígado — Bilirrubina (mg/dL)', options: [
        { label: '< 1,2', value: 0 },
        { label: '1,2–1,9', value: 1 },
        { label: '2,0–5,9', value: 2 },
        { label: '6,0–11,9', value: 3 },
        { label: '≥ 12,0', value: 4 },
      ]},
      { id: 'cardio', type: 'select', label: 'Cardiovascular — PAM ou vasopressores', options: [
        { label: 'PAM ≥ 70 mmHg', value: 0 },
        { label: 'PAM < 70 mmHg', value: 1 },
        { label: 'Dopamina ≤ 5 ou Dobutamina (qualquer dose)', value: 2 },
        { label: 'Dopamina 5,1–15 ou Noradrenalina / Adrenalina ≤ 0,1', value: 3 },
        { label: 'Dopamina > 15 ou Noradrenalina / Adrenalina > 0,1', value: 4 },
      ]},
      { id: 'gcs', type: 'select', label: 'SNC — Glasgow Coma Scale', options: [
        { label: '15', value: 0 },
        { label: '13–14', value: 1 },
        { label: '10–12', value: 2 },
        { label: '6–9', value: 3 },
        { label: '< 6', value: 4 },
      ]},
      { id: 'renal', type: 'select', label: 'Renal — Creatinina (mg/dL) ou diurese', options: [
        { label: '< 1,2', value: 0 },
        { label: '1,2–1,9', value: 1 },
        { label: '2,0–3,4', value: 2 },
        { label: '3,5–4,9 ou diurese < 500 mL/dia', value: 3 },
        { label: '≥ 5,0 ou diurese < 200 mL/dia', value: 4 },
      ]},
    ],
    calculate(v) {
      const score = this.fields.reduce((s, f) => s + (Number(v[f.id]) || 0), 0)
      let color, interp, rec
      if (score <= 6)       { color = 'green';  interp = 'Disfunção leve';    rec = 'Mortalidade < 10%' }
      else if (score <= 9)  { color = 'yellow'; interp = 'Disfunção moderada';rec = 'Mortalidade ~15–20%' }
      else if (score <= 12) { color = 'orange'; interp = 'Disfunção grave';   rec = 'Mortalidade ~40–50%' }
      else                  { color = 'red';    interp = 'Falência orgânica múltipla'; rec = 'Mortalidade > 50%' }
      return { score, max: 24, color, interp, rec }
    }
  },

  // ── NEWS2 ──────────────────────────────────────────────────────────────────
  news2: {
    name: 'NEWS2',
    desc: 'National Early Warning Score 2 — deterioração clínica',
    ref: 'RCP 2017',
    fields: [
      { id: 'rr', type: 'select', label: 'Frequência respiratória (rpm)', options: [
        { label: '12–20 (normal)', value: 0 },
        { label: '9–11', value: 1 }, { label: '21–24', value: 2 },
        { label: '≤ 8', value: 3 }, { label: '≥ 25', value: 3 },
      ]},
      { id: 'spo2', type: 'select', label: 'SpO₂ — Escala 1 (sem hipercápnia habitual)', options: [
        { label: '≥ 96% (normal)', value: 0 },
        { label: '94–95%', value: 1 }, { label: '92–93%', value: 2 }, { label: '≤ 91%', value: 3 },
      ]},
      { id: 'o2', type: 'select', label: 'Oxigênio suplementar', options: [
        { label: 'Não (ar ambiente)', value: 0 }, { label: 'Sim (qualquer O₂)', value: 2 },
      ]},
      { id: 'temp', type: 'select', label: 'Temperatura (°C)', options: [
        { label: '36,1–38,0 (normal)', value: 0 },
        { label: '35,1–36,0', value: 1 }, { label: '38,1–39,0', value: 1 },
        { label: '≥ 39,1', value: 2 }, { label: '≤ 35,0', value: 3 },
      ]},
      { id: 'sbp', type: 'select', label: 'Pressão arterial sistólica (mmHg)', options: [
        { label: '111–219 (normal)', value: 0 },
        { label: '101–110', value: 1 }, { label: '91–100', value: 2 },
        { label: '≤ 90', value: 3 }, { label: '≥ 220', value: 3 },
      ]},
      { id: 'hr', type: 'select', label: 'Frequência cardíaca (bpm)', options: [
        { label: '51–90 (normal)', value: 0 },
        { label: '41–50', value: 1 }, { label: '91–110', value: 1 },
        { label: '111–130', value: 2 }, { label: '≤ 40', value: 3 }, { label: '≥ 131', value: 3 },
      ]},
      { id: 'avpu', type: 'select', label: 'Nível de consciência (AVPU)', options: [
        { label: 'A — Alerta', value: 0 }, { label: 'V / P / U — Confuso, à Dor ou Inconsciente', value: 3 },
      ]},
    ],
    calculate(v) {
      const score = this.fields.reduce((s, f) => s + (Number(v[f.id]) || 0), 0)
      const hasRedFlag = Object.values(v).some(val => Number(val) === 3)
      let color, interp, rec
      if (score <= 4 && !hasRedFlag) {
        color = 'green'; interp = `Baixo risco (${score})`
        rec = 'Monitorização de rotina (a cada 12 h)'
      } else if (score <= 6 || (score <= 4 && hasRedFlag)) {
        color = 'yellow'; interp = `Risco médio (${score})`
        rec = 'Escalar para equipa médica. Monitorização a cada 1 h.'
      } else {
        color = 'red'; interp = `Alto risco (${score})`
        rec = 'Resposta de emergência imediata. Considerar UCI.'
      }
      return { score, max: 20, color, interp, rec }
    }
  },

  // ── Glasgow ────────────────────────────────────────────────────────────────
  glasgow: {
    requiresInteraction: true,
    name: 'Escala de Glasgow',
    desc: 'Nível de consciência e gravidade do coma',
    ref: 'Teasdale & Jennett 1974',
    fields: [
      { id: 'eyes', type: 'select', label: 'Abertura ocular', options: [
        { label: '4 — Espontânea', value: 4 },
        { label: '3 — À voz / estímulo verbal', value: 3 },
        { label: '2 — À dor', value: 2 },
        { label: '1 — Sem resposta', value: 1 },
      ]},
      { id: 'verbal', type: 'select', label: 'Resposta verbal', options: [
        { label: '5 — Orientado', value: 5 },
        { label: '4 — Confuso', value: 4 },
        { label: '3 — Palavras inapropriadas', value: 3 },
        { label: '2 — Sons incompreensíveis', value: 2 },
        { label: '1 — Sem resposta', value: 1 },
      ]},
      { id: 'motor', type: 'select', label: 'Resposta motora', options: [
        { label: '6 — Obedece a ordens', value: 6 },
        { label: '5 — Localiza a dor', value: 5 },
        { label: '4 — Retirada à dor', value: 4 },
        { label: '3 — Flexão anormal (decorticação)', value: 3 },
        { label: '2 — Extensão (descerebração)', value: 2 },
        { label: '1 — Sem resposta', value: 1 },
      ]},
    ],
    calculate(v) {
      const e = Number(v.eyes) || 4
      const vb = Number(v.verbal) || 5
      const m = Number(v.motor) || 6
      const score = e + vb + m
      let color, interp, rec
      if (score >= 13)      { color = 'green';  interp = `GCS ${score} — Leve / Normal` ; rec = 'Monitorização. Repetir avaliação.' }
      else if (score >= 9)  { color = 'yellow'; interp = `GCS ${score} — Moderado`      ; rec = 'Internamento. Vigilância neurológica. TC crânio.' }
      else                  { color = 'red';    interp = `GCS ${score} — Grave (coma)`  ; rec = 'Proteger via aérea. UCI. TC crânio urgente.' }
      return { score, max: 15, color, interp, rec, detail: `O:${e} V:${vb} M:${m}` }
    }
  },

  // ── CURB-65 ────────────────────────────────────────────────────────────────
  curb65: {
    name: 'CURB-65',
    desc: 'Gravidade da pneumonia comunitária',
    ref: 'BTS 2009',
    fields: [
      { id: 'conf',  type: 'check', label: 'C — Confusão mental (novo ou acima do basal)',            pts: 1 },
      { id: 'urea',  type: 'check', label: 'U — Ureia > 7 mmol/L (BUN > 19 mg/dL)',                  pts: 1 },
      { id: 'rr',    type: 'check', label: 'R — Frequência respiratória ≥ 30 rpm',                   pts: 1 },
      { id: 'bp',    type: 'check', label: 'B — PAS < 90 mmHg ou PAD ≤ 60 mmHg',                     pts: 1 },
      { id: 'age',   type: 'check', label: '65 — Idade ≥ 65 anos',                                   pts: 1 },
    ],
    calculate(v) {
      const score = this.fields.reduce((s, f) => s + (v[f.id] ? f.pts : 0), 0)
      let color, interp, rec
      if (score <= 1)  { color = 'green';  interp = 'Baixo risco (mortalidade < 3%)';  rec = 'Tratamento ambulatório na maioria dos casos' }
      else if (score === 2) { color = 'yellow'; interp = 'Risco intermédio (~9%)';      rec = 'Internamento' }
      else             { color = 'red';    interp = `Alto risco (mortalidade > 22%)`; rec = 'Internamento em UCI / cuidados intermédios' }
      return { score, max: 5, color, interp, rec }
    }
  },

  // ── MELD ───────────────────────────────────────────────────────────────────
  meld: {
    name: 'MELD',
    desc: 'Prognóstico na doença hepática crónica (lista transplante)',
    ref: 'UNOS 2002',
    fields: [
      { id: 'bili',    type: 'number', label: 'Bilirrubina total (mg/dL)', min: 0.1, step: 0.1, placeholder: 'ex: 1.5' },
      { id: 'inr',     type: 'number', label: 'INR',                       min: 0.1, step: 0.1, placeholder: 'ex: 1.2' },
      { id: 'creat',   type: 'number', label: 'Creatinina (mg/dL)',        min: 0.1, step: 0.1, placeholder: 'ex: 1.0' },
    ],
    calculate(v) {
      const bili  = Math.max(Number(v.bili)  || 1, 1)
      const inr   = Math.max(Number(v.inr)   || 1, 1)
      const creat = Math.min(Math.max(Number(v.creat) || 1, 1), 4)
      const raw = 3.78 * Math.log(bili) + 11.2 * Math.log(inr) + 9.57 * Math.log(creat) + 6.43
      const score = Math.round(raw)
      let color, interp, rec
      if (score < 10)       { color = 'green';  interp = `MELD ${score} — Baixo risco`;          rec = 'Mortalidade hospitalar < 2%' }
      else if (score < 20)  { color = 'yellow'; interp = `MELD ${score} — Risco intermédio`;     rec = 'Mortalidade hospitalar ~6%' }
      else if (score < 30)  { color = 'orange'; interp = `MELD ${score} — Risco elevado`;        rec = 'Mortalidade 3 meses ~20%' }
      else if (score < 40)  { color = 'red';    interp = `MELD ${score} — Risco muito elevado`;  rec = 'Mortalidade 3 meses ~50%' }
      else                  { color = 'red';    interp = `MELD ${score} — Risco extremo`;        rec = 'Mortalidade 3 meses > 70%. Transplante urgente.' }
      return { score, max: 40, color, interp, rec }
    }
  },

  // ── Child-Pugh ─────────────────────────────────────────────────────────────
  child_pugh: {
    name: 'Child-Pugh',
    desc: 'Gravidade da cirrose hepática',
    ref: 'Child & Turcotte 1964',
    fields: [
      { id: 'bili', type: 'select', label: 'Bilirrubina total (mg/dL)', options: [
        { label: '< 2', value: 1 }, { label: '2–3', value: 2 }, { label: '> 3', value: 3 },
      ]},
      { id: 'alb', type: 'select', label: 'Albumina (g/dL)', options: [
        { label: '> 3,5', value: 1 }, { label: '2,8–3,5', value: 2 }, { label: '< 2,8', value: 3 },
      ]},
      { id: 'inr', type: 'select', label: 'INR', options: [
        { label: '< 1,7', value: 1 }, { label: '1,7–2,3', value: 2 }, { label: '> 2,3', value: 3 },
      ]},
      { id: 'ascites', type: 'select', label: 'Ascite', options: [
        { label: 'Ausente', value: 1 }, { label: 'Ligeira / controlada', value: 2 }, { label: 'Moderada a grave / refractária', value: 3 },
      ]},
      { id: 'enceph', type: 'select', label: 'Encefalopatia hepática', options: [
        { label: 'Ausente', value: 1 }, { label: 'Grau 1–2 (controlada)', value: 2 }, { label: 'Grau 3–4 (refractária)', value: 3 },
      ]},
    ],
    calculate(v) {
      const score = this.fields.reduce((s, f) => s + (Number(v[f.id]) || 1), 0)
      let cls, color, interp, rec
      if (score <= 6)       { cls = 'A'; color = 'green';  interp = `Child-Pugh A (${score} pts)` ; rec = 'Cirrose compensada — sobrevida 1 ano ~100%' }
      else if (score <= 9)  { cls = 'B'; color = 'yellow'; interp = `Child-Pugh B (${score} pts)` ; rec = 'Compromisso funcional — sobrevida 1 ano ~80%' }
      else                  { cls = 'C'; color = 'red';    interp = `Child-Pugh C (${score} pts)` ; rec = 'Cirrose descompensada — sobrevida 1 ano ~45%. Avaliar transplante.' }
      return { score, max: 15, color, interp, rec }
    }
  },

  // ── Wells TVP ──────────────────────────────────────────────────────────────
  wells_dvt: {
    name: 'Wells — TVP',
    desc: 'Probabilidade pré-teste de trombose venosa profunda',
    ref: 'Wells 2003',
    fields: [
      { id: 'cancer',    type: 'check', label: 'Neoplasia activa (tratamento activo / paliativo / ≤ 6 meses)', pts: 1 },
      { id: 'paralysis', type: 'check', label: 'Paralisia, parésia ou imobilização recente do membro', pts: 1 },
      { id: 'bedridden', type: 'check', label: 'Acamado > 3 dias ou cirurgia major < 4 semanas', pts: 1 },
      { id: 'tender',    type: 'check', label: 'Dor à palpação no trajeto venoso profundo', pts: 1 },
      { id: 'swelling',  type: 'check', label: 'Tumefacção de toda a perna', pts: 1 },
      { id: 'calf',      type: 'check', label: 'Assimetria da perna > 3 cm (10 cm abaixo da tub. tibial)', pts: 1 },
      { id: 'pitting',   type: 'check', label: 'Edema com fóvea (sintomático)', pts: 1 },
      { id: 'collat',    type: 'check', label: 'Veias superficiais colaterais (não varicosas)', pts: 1 },
      { id: 'prev',      type: 'check', label: 'TVP prévia documentada', pts: 1 },
      { id: 'alt',       type: 'check', label: 'Diagnóstico alternativo pelo menos tão provável (SUBTRAI 2)', pts: -2 },
    ],
    calculate(v) {
      const score = this.fields.reduce((s, f) => s + (v[f.id] ? f.pts : 0), 0)
      let color, interp, rec
      if (score <= 0)      { color = 'green';  interp = 'Baixa probabilidade'; rec = 'D-dímero negativo → exclui TVP. Se positivo → eco-Doppler.' }
      else if (score <= 2) { color = 'yellow'; interp = 'Probabilidade intermédia'; rec = 'Eco-Doppler venoso membro inferior' }
      else                 { color = 'red';    interp = 'Alta probabilidade'; rec = 'Eco-Doppler venoso urgente. Anticoagulação empírica a considerar.' }
      return { score, max: 9, color, interp, rec }
    }
  },

  // ── Wells TEP ──────────────────────────────────────────────────────────────
  wells_pe: {
    name: 'Wells — TEP',
    desc: 'Probabilidade pré-teste de tromboembolismo pulmonar',
    ref: 'Wells 2000',
    fields: [
      { id: 'dvt_sx',   type: 'check', label: 'Sinais / sintomas clínicos de TVP', pts: 3 },
      { id: 'alt_dx',   type: 'check', label: 'TEP mais provável que diagnóstico alternativo', pts: 3 },
      { id: 'hr',       type: 'check', label: 'Frequência cardíaca > 100 bpm', pts: 1.5 },
      { id: 'immob',    type: 'check', label: 'Imobilização ≥ 3 dias ou cirurgia < 4 semanas', pts: 1.5 },
      { id: 'prev',     type: 'check', label: 'TVP ou TEP prévio', pts: 1.5 },
      { id: 'hemopty',  type: 'check', label: 'Hemoptises', pts: 1 },
      { id: 'cancer',   type: 'check', label: 'Neoplasia activa (tratamento activo ou ≤ 6 meses)', pts: 1 },
    ],
    calculate(v) {
      const score = this.fields.reduce((s, f) => s + (v[f.id] ? f.pts : 0), 0)
      let color, interp, rec
      if (score <= 4) { color = 'green';  interp = 'TEP improvável'; rec = 'D-dímero. Se negativo → exclui TEP. Se positivo → angio-TC.' }
      else            { color = 'red';    interp = 'TEP provável';  rec = 'Angio-TC tórax urgente. Anticoagulação empírica se atraso.' }
      return { score: score.toFixed(1), max: 12.5, color, interp, rec }
    }
  },

  // ── CKD-EPI ────────────────────────────────────────────────────────────────
  ckd_epi: {
    name: 'CKD-EPI 2021',
    desc: 'Taxa de Filtração Glomerular estimada (TFGe) — sem variável étnica',
    ref: 'Inker et al. 2021',
    fields: [
      { id: 'creat', type: 'number', label: 'Creatinina sérica (mg/dL)', min: 0.1, step: 0.01, placeholder: 'ex: 1.0' },
      { id: 'age',   type: 'number', label: 'Idade (anos)',               min: 18,  step: 1,    placeholder: 'ex: 55' },
      { id: 'sex',   type: 'select', label: 'Sexo', options: [
        { label: 'Masculino', value: 'M' },
        { label: 'Feminino',  value: 'F' },
      ]},
    ],
    calculate(v) {
      const scr  = Number(v.creat) || 1
      const age  = Number(v.age)   || 40
      const sex  = v.sex || 'M'
      const k    = sex === 'F' ? 0.7  : 0.9
      const a    = sex === 'F' ? -0.241 : -0.302
      const mult = sex === 'F' ? 1.012 : 1.0
      const ratio = scr / k
      const tfg = Math.round(
        142 * Math.pow(Math.min(ratio, 1), a) * Math.pow(Math.max(ratio, 1), -1.200)
        * Math.pow(0.9938, age) * mult
      )
      let color, interp, rec
      if (tfg >= 90)      { color = 'green';  interp = `TFGe ${tfg} mL/min/1,73m² — G1`; rec = 'Normal ou aumentada' }
      else if (tfg >= 60) { color = 'green';  interp = `TFGe ${tfg} mL/min/1,73m² — G2`; rec = 'Ligeiramente diminuída' }
      else if (tfg >= 45) { color = 'yellow'; interp = `TFGe ${tfg} mL/min/1,73m² — G3a`; rec = 'Diminuição ligeira a moderada. Ajustar doses renais.' }
      else if (tfg >= 30) { color = 'yellow'; interp = `TFGe ${tfg} mL/min/1,73m² — G3b`; rec = 'Diminuição moderada a grave. Ajustar doses. Nefrologista.' }
      else if (tfg >= 15) { color = 'orange'; interp = `TFGe ${tfg} mL/min/1,73m² — G4`; rec = 'Diminuição grave. Preparar substituição renal.' }
      else                { color = 'red';    interp = `TFGe ${tfg} mL/min/1,73m² — G5`; rec = 'Falência renal. Diálise / transplante.' }
      return { score: tfg, max: 120, color, interp, rec }
    }
  },
}

// ─── Components ─────────────────────────────────────────────────────────────

const COLOR_CLASSES = {
  green:  { bg: 'bg-green-50',  border: 'border-green-400', text: 'text-green-800',  badge: 'bg-green-100 text-green-800'  },
  yellow: { bg: 'bg-yellow-50', border: 'border-yellow-400',text: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-800'},
  orange: { bg: 'bg-orange-50', border: 'border-orange-400',text: 'text-orange-800', badge: 'bg-orange-100 text-orange-800'},
  red:    { bg: 'bg-red-50',    border: 'border-red-400',   text: 'text-red-800',    badge: 'bg-red-100 text-red-800'      },
}

function ScoreCalculator({ score }) {
  const initVals = {}
  score.fields.forEach(f => {
    if (f.type === 'check') initVals[f.id] = false
    else if (f.type === 'select') initVals[f.id] = f.options[0].value
    else initVals[f.id] = ''
  })
  const [vals, setVals] = useState(initVals)
  const [touched, setTouched] = useState(false)

  function reset() { setVals(initVals); setTouched(false) }
  function set(id, val) { setVals(p => ({ ...p, [id]: val })); setTouched(true) }

  const hasInput = score.fields.some(f => f.type === 'number')
  const allFilled = !hasInput || score.fields.filter(f => f.type === 'number').every(f => vals[f.id] !== '')
  const showResult = allFilled && (!score.requiresInteraction || touched)
  const result = showResult ? score.calculate(vals) : null
  const c = result ? (COLOR_CLASSES[result.color] || COLOR_CLASSES.green) : null

  return (
    <div className="flex flex-col gap-4">
      {/* Fields */}
      <div className="space-y-2">
        {score.fields.map(f => (
          <div key={f.id} className={`flex items-start gap-3 p-2 rounded-lg border transition-colors ${
            f.type === 'check' && vals[f.id] ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
          }`}>
            {f.type === 'check' && (
              <>
                <input
                  type="checkbox"
                  id={f.id}
                  checked={!!vals[f.id]}
                  onChange={e => set(f.id, e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 cursor-pointer shrink-0"
                />
                <label htmlFor={f.id} className="text-sm text-gray-700 cursor-pointer leading-snug flex-1">
                  {f.label}
                  {f.pts !== 0 && <span className="ml-1 text-xs font-semibold text-blue-600">
                    {f.pts > 0 ? `+${f.pts}` : f.pts}
                  </span>}
                </label>
              </>
            )}
            {f.type === 'select' && (
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                <select
                  value={vals[f.id]}
                  onChange={e => set(f.id, e.target.value)}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-400"
                >
                  {f.options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            )}
            {f.type === 'number' && (
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                <input
                  type="number"
                  value={vals[f.id]}
                  onChange={e => set(f.id, e.target.value)}
                  min={f.min}
                  step={f.step}
                  placeholder={f.placeholder}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-blue-400"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Result */}
      {result ? (
        <div className={`rounded-xl border-2 p-4 ${c.bg} ${c.border}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-2xl font-bold ${c.text}`}>{result.score}</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.badge}`}>
              {result.interp}
            </span>
          </div>
          {result.detail && <p className="text-xs text-gray-500 mb-1">{result.detail}</p>}
          <p className={`text-sm font-medium ${c.text}`}>{result.rec}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 p-4 text-center text-sm text-gray-400">
          Preencha todos os campos para calcular
        </div>
      )}

      <button onClick={reset} className="btn-ghost text-xs self-start">↺ Limpar</button>
    </div>
  )
}

export default function ScoresPage() {
  const [activeId, setActiveId] = useState('chads_vasc')
  const score = SCORES[activeId]

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel — score list */}
      <div className="w-56 shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        {SCORE_GROUPS.map(g => (
          <div key={g.id}>
            <div className="px-3 pt-3 pb-1 flex items-center gap-1.5">
              <span className="text-sm">{g.icon}</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{g.label}</span>
            </div>
            {g.items.map(sid => (
              <button
                key={sid}
                onClick={() => setActiveId(sid)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors
                  ${activeId === sid ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {SCORES[sid]?.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Right panel — calculator */}
      <div className="flex-1 overflow-y-auto p-6">
        {score && (
          <>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">{score.name}</h2>
              <p className="text-sm text-gray-500">{score.desc}</p>
              <span className="text-xs text-gray-400">{score.ref}</span>
            </div>
            <div className="max-w-2xl">
              <ScoreCalculator key={activeId} score={score} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
