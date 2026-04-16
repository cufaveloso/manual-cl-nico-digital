import React, { useState } from 'react'

const SUMMARIES = [
  {
    id: 'ic_aguda',
    title: 'Insuficiência Cardíaca Aguda',
    category: 'Cardiologia',
    icon: '❤️',
    color: 'red',
    sections: [
      { heading: 'Apresentação', items: [
        'Dispneia de repouso / ortopneia / DPN',
        'Crepitações bilaterais, S3, estase jugular',
        'Edema periférico simétrico',
        'BNP > 400 pg/mL ou NT-proBNP > 1800 pg/mL',
      ]},
      { heading: 'Causas precipitantes', items: [
        'Não adesão a medicação/dieta salina',
        'Síndrome coronário agudo',
        'Fibrilhação auricular com resposta ventricular rápida',
        'HTA não controlada, infecção (pneumonia)',
      ]},
      { heading: 'Exames', items: [
        'ECG, Rx tórax, ecocardiograma, BNP/proBNP',
        'Hemograma, função renal, ionograma, glicemia',
        'D-dímero se suspeita de TEP',
      ]},
      { heading: 'Tratamento agudo', items: [
        'O₂ / VNI (CPAP/BiPAP) — alvo SpO₂ ≥ 94%',
        'Furosemida IV 40–80 mg (dobrar dose crónica)',
        'Nitratos IV se PAS > 90 mmHg',
        'Suspender AINEs, iSGLT2 temporariamente',
      ]},
    ]
  },
  {
    id: 'sca',
    title: 'Síndrome Coronário Agudo',
    category: 'Cardiologia',
    icon: '💔',
    color: 'red',
    sections: [
      { heading: 'Tipos', items: [
        'STEMI: Supra-ST ≥ 2 mm em ≥ 2 derivações contíguas',
        'NSTEMI: Troponina elevada sem supra-ST',
        'AI (Angina Instável): sem elevação de troponina',
      ]},
      { heading: 'Medidas imediatas (1.ª hora)', items: [
        'AAS 300 mg mastigado + P2Y12 (Ticagrelor 180 mg ou Clopidogrel 300 mg)',
        'Nitroglicerina SL se dor torácica e PAS > 90',
        'Morfina 2–4 mg IV se dor refractária',
        'STEMI: activar laboratório cateterismo — ICP < 90 min (< 120 min se transferência)',
      ]},
      { heading: 'STEMI — janela perdida / sem ICP', items: [
        'Trombólise: Tenecteplase dose por peso IV bólus (janela 12 h)',
        'Transferência imediata para ICP (rescue PCI se falhou)',
      ]},
      { heading: 'Pós-SCA — terapia crónica', items: [
        'AAS 100 mg + P2Y12 por 12 meses (dupla antiagregação)',
        'Estatina de alta intensidade (Rosuvastatina 20–40 mg)',
        'IECA/BRA (Ramipril 5–10 mg)',
        'Betabloqueador (Bisoprolol 5–10 mg)',
        'Spironolactona se FEVE < 35% e IC/DM',
      ]},
    ]
  },
  {
    id: 'pneumonia',
    title: 'Pneumonia Comunitária',
    category: 'Infecciologia',
    icon: '🫁',
    color: 'blue',
    sections: [
      { heading: 'Critérios clínicos', items: [
        'Tosse, expectoração, febre',
        'Consolidação à Rx/TC (infiltrado novo)',
        'Taquipneia, hipóxia, dor pleurítica',
      ]},
      { heading: 'Classificar gravidade', items: [
        'CURB-65: 0–1 ambulatório | 2 internamento | ≥3 UCI',
        'PSI/PORT: classes I-III ambulatório | IV-V internamento',
      ]},
      { heading: 'Antibioterapia (ambulatório)', items: [
        'Sem comorbilidades: Amoxicilina 1 g 8/8h × 5–7 dias',
        'Atípica suspeita: Azitromicina 500 mg × 3–5 dias',
        'Alérgico penicilina: Levofloxacina 500 mg × 5–7 dias',
      ]},
      { heading: 'Antibioterapia (internamento)', items: [
        'Beta-lactâmico + Macrólido (Amox-Clav + Azitromicina)',
        'Grave: Piperacilina-Tazobactam 4,5 g q6h + Levofloxacina',
        'Pseudomonas suspeita: Imipenem/Meropenem',
      ]},
      { heading: 'Critérios de resolução', items: [
        'Afebril > 48 h + melhoria clínica → completar via oral',
        'Rx controlo não obrigatório se boa resposta',
        'Rastreio neoplasia: adulto fumador ≥ 50 anos',
      ]},
    ]
  },
  {
    id: 'avc',
    title: 'AVC — Avaliação e Prevenção',
    category: 'Neurologia',
    icon: '🧠',
    color: 'purple',
    sections: [
      { heading: 'Rastreio FAST', items: [
        'Face: assimetria facial',
        'Arms: fraqueza de braço (elevar ambos)',
        'Speech: alteração de fala / disartria',
        'Time: tempo desde sintoma (ligar 112)',
      ]},
      { heading: 'AVC vs AIT', items: [
        'AVC: défice persistente > 24 h (ou lesão em RMN)',
        'AIT: défice transitório < 24 h sem lesão visível',
        'AIT: risco AVC 10–15% a 3 meses — avaliar urgente',
      ]},
      { heading: 'Avaliação AIT (ABCD²)', items: [
        'Idade ≥ 60 anos (1)', 'PA > 140/90 (1)',
        'Clínica: unilateral (2), fala sem motor (1)',
        'Duração: 10–59 min (1), ≥60 min (2)',
        'Diabetes (1) — Score ≥4: alto risco (internamento)',
      ]},
      { heading: 'Prevenção secundária isquémico', items: [
        'Antiagregação: AAS 100 mg + Clopidogrel 75 mg × 21 dias, depois monoterapia',
        'FA: anticoagulação (NOAC > AVK) — CHA₂DS₂-VASc ≥ 2',
        'Estatina alta intensidade independente do LDL',
        'Controlo rigoroso HTA (< 130/80 mmHg)',
        'Alvo LDL < 55 mg/dL (ou < 70 em AIT)',
      ]},
    ]
  },
  {
    id: 'diabetes',
    title: 'Diabetes Mellitus Tipo 2',
    category: 'Endocrinologia',
    icon: '🩸',
    color: 'orange',
    sections: [
      { heading: 'Critérios diagnósticos', items: [
        'HbA1c ≥ 6,5%',
        'Glicemia em jejum ≥ 126 mg/dL (× 2)',
        'Glicemia 2h pós-PTGO ≥ 200 mg/dL',
        'Glicemia ocasional ≥ 200 mg/dL + sintomas',
      ]},
      { heading: 'Alvos terapêuticos', items: [
        'HbA1c < 7% (geral) | < 6,5% (jovem sem complicações) | < 8% (idoso/frágil)',
        'PA < 130/80 mmHg',
        'LDL < 70 mg/dL (< 55 se DCV estabelecida)',
        'Glicemia em jejum: 80–130 mg/dL',
      ]},
      { heading: 'Algoritmo farmacológico', items: [
        '1.ª linha: Metformina (se TFG ≥ 30)',
        '+ DCV estabelecida ou IC: iSGLT2 (Empagliflozina, Dapagliflozina) ou aGLP-1 (Semaglutido)',
        '+ Peso: aGLP-1 ou iSGLT2',
        '+ Hipoglicemia preocupa: iDPP4, iSGLT2, aGLP-1',
        '+ Económico: Sulfonilureia (Glibenclamida) — risco hipoglicemia',
      ]},
      { heading: 'Vigilância periódica', items: [
        'HbA1c: 3–6 meses',
        'Microalbuminúria + creatinina: anual',
        'Fundo de olho: anual',
        'Pé diabético: cada consulta',
        'Perfil lipídico + função renal: anual',
      ]},
    ]
  },
  {
    id: 'sepsis',
    title: 'Sépsis — Critérios e Gestão',
    category: 'Infecciologia',
    icon: '🦠',
    color: 'red',
    sections: [
      { heading: 'Definições (Sepsis-3)', items: [
        'Infecção suspeita / confirmada',
        'Disfunção orgânica: SOFA ≥ 2 pontos acima do basal',
        'Choque séptico: vasopressores para PAM ≥ 65 + lactato > 2 mmol/L',
      ]},
      { heading: 'Triagem rápida (qSOFA ≥ 2)', items: [
        'FR ≥ 22 rpm',
        'PAS ≤ 100 mmHg',
        'Alteração do estado mental (GCS < 15)',
      ]},
      { heading: 'Focos e cobertura empírica', items: [
        'Pulmonar: Amox-Clav ou Ceftriaxone + Azitromicina',
        'Urinário: Ceftriaxone ou Ciprofloxacino (se sem resistência)',
        'Abdominal: Piperacilina-Tazobactam ou Cefoxitina',
        'Cateter: Vancomicina + Gram-negativo',
        'Sem foco: Piperacilina-Tazobactam',
      ]},
      { heading: 'Monitorização / Alvos', items: [
        'Lactato: alvo < 2 mmol/L (ou redução ≥ 10% em 2h)',
        'PAM ≥ 65 mmHg',
        'Diurese ≥ 0,5 mL/kg/h',
        'ScvO₂ ≥ 70%',
        'Desescalada ATB em 48–72 h conforme culturas',
      ]},
    ]
  },
  {
    id: 'dpoc',
    title: 'DPOC — Exacerbação Aguda',
    category: 'Pneumologia',
    icon: '🌬️',
    color: 'blue',
    sections: [
      { heading: 'Definição de exacerbação', items: [
        'Agravamento de dispneia, tosse e/ou expectoração além variabilidade normal',
        'Leve: trata ambulatório | Moderada: urgência | Grave: UCI',
        'Causas: infecção respiratória (50–70%), poluição, incumprimento',
      ]},
      { heading: 'Tratamento (hospitalizado)', items: [
        'O₂ controlado — alvo SpO₂ 88–92% (risco hipercapnia)',
        'Salbutamol 2,5–5 mg neb q1–4h + Ipratrópio 0,5 mg q4–6h',
        'Prednisolona 40 mg VO × 5 dias',
        'ATB se ≥ 2 de: aumento dispneia, aumento volume, purulência expectoração',
        'VNI (BiPAP) se pH < 7,35 e PaCO₂ > 45 mmHg',
      ]},
      { heading: 'Antibioterapia na exacerbação', items: [
        'Amoxicilina 500 mg 8/8h ou Doxiciclina 100 mg 12/12h × 5 dias',
        'Amox-Clav se expectoração purulenta / internamento',
        'Levofloxacina se suspeita Pseudomonas (exacerbações frequentes / FEV1 < 30%)',
      ]},
      { heading: 'Prevenção de exacerbações', items: [
        'LAMA (Tiotrópio) + LABA (Salmeterol/Formoterol)',
        'ICS + LABA se exacerbações frequentes',
        'Vacinação: Influenza (anual) + Pneumocócica',
        'Reabilitação respiratória pós-exacerbação',
      ]},
    ]
  },
  {
    id: 'dor_torax',
    title: 'Dor Torácica — Diagnóstico Diferencial',
    category: 'Urgência',
    icon: '⚡',
    color: 'orange',
    sections: [
      { heading: 'Causas emergentes (excluir 1.º)', items: [
        'SCA (STEMI / NSTEMI / AI)',
        'Dissecção aórtica (dor em rasgo, dorso, assimetria pulsos)',
        'TEP (pleurítica, dispneia, factor de risco)',
        'Pneumotórax (início súbito, unilateral)',
        'EAP',
      ]},
      { heading: 'Avaliação inicial obrigatória', items: [
        'ECG em < 10 min (STEMI → cateterismo imediato)',
        'Troponina (T=0 e T=1h ou T=3h) — protocolo 0/1h ou 0/3h',
        'D-dímero se Wells TEP ≥ 2 pontos',
        'Rx tórax',
        'PA nos dois braços (dissecção)',
      ]},
      { heading: 'HEART score ≤ 3 → baixo risco', items: [
        'Alta precoce com seguimento 1–2 semanas',
        'Teste de esforço ou angio-TC se dúvida',
      ]},
      { heading: 'Outras causas (não cardíacas)', items: [
        'Pleurite, pericardite (melhora sentado)',
        'Esofagite / espasmo esofágico (DRGE, nitratos)',
        'Costocondrite (Tietze) — reproducível à palpação',
        'Herpes zóster (pré-rash)',
        'Ansiedade / hiperventilação',
      ]},
    ]
  },
  {
    id: 'has_manejo',
    title: 'Hipertensão Arterial — Manejo',
    category: 'Cardiologia',
    icon: '🫀',
    color: 'blue',
    sections: [
      { heading: 'Classificação ESC 2023', items: [
        'Elevada: 120–129 / < 80 mmHg',
        'Grau 1: 130–139 / 80–89 mmHg',
        'Grau 2: 140–159 / 90–99 mmHg',
        'Grau 3: ≥ 160 / ≥ 100 mmHg',
      ]},
      { heading: 'Quando iniciar farmacoterapia', items: [
        'Grau 2–3: sempre iniciar farmacoterapia',
        'Grau 1 + risco CV baixo: tentar MEV 3–6 meses',
        'Grau 1 + risco CV moderado-alto ou TOD: iniciar farmacoterapia',
        'Elevada + DCV ou risco alto: discutir farmacoterapia',
      ]},
      { heading: 'Combinações preferidas (ESC)', items: [
        '1.ª linha: IECA/BRA + BCC ou IECA/BRA + Tiazida',
        '2.ª linha: IECA/BRA + BCC + Tiazida (tripla)',
        '3.ª linha: adicionar Espironolactona 25–50 mg ou Bisoprolol',
        'Evitar: IECA + BRA em combinação',
      ]},
      { heading: 'Alvos de PA', items: [
        'Geral: < 130/80 mmHg',
        '> 65 anos: PAS 130–139 mmHg',
        'DRC (sem proteinúria): < 140/90; com proteinúria: < 130/80',
        'Diabetes: < 130/80 mmHg',
      ]},
    ]
  },
  {
    id: 'fa',
    title: 'Fibrilhação Auricular',
    category: 'Cardiologia',
    icon: '💓',
    color: 'blue',
    sections: [
      { heading: 'Classificação', items: [
        'Paroxística: < 48 h (ou < 7 dias, converte espontaneamente)',
        'Persistente: > 7 dias, requer cardioversão',
        'Permanente: cardioversão não tentada / falhada',
        'Longstanding: > 12 meses',
      ]},
      { heading: 'Avaliação inicial', items: [
        'ECG, ecocardiograma, TSH, hemograma, ionograma, função renal',
        'Identificar e tratar causa reversível (tirotoxicose, infecção, pericardite)',
        'Calcular CHA₂DS₂-VASc para anticoagulação',
        'Calcular HAS-BLED para avaliar risco hemorrágico',
      ]},
      { heading: 'Controlo de frequência (rate control)', items: [
        'Betabloqueador: Bisoprolol 5–10 mg/dia (1.ª linha)',
        'Alternativa: Diltiazem 120–360 mg/dia',
        'IC com FEVE reduzida: Digoxina (adjuvante)',
        'Alvo FC: < 110 bpm (em repouso)',
      ]},
      { heading: 'Anticoagulação', items: [
        'CHA₂DS₂-VASc ≥ 2 (H) ou ≥ 3 (M): anticoagular',
        'NOAC preferível a AVK (warfarina)',
        'Apixabano 5 mg 12/12h ou Rivaroxabano 20 mg/dia',
        'Dabigatrano 150 mg 12/12h (110 mg se > 80 anos / risco hemorrágico)',
      ]},
    ]
  },
]

const COLOR_CLASSES = {
  red:    { header: 'bg-red-600',     badge: 'bg-red-100 text-red-700',     accent: 'text-red-600'    },
  orange: { header: 'bg-orange-500',  badge: 'bg-orange-100 text-orange-700',accent: 'text-orange-600' },
  blue:   { header: 'bg-blue-600',    badge: 'bg-blue-100 text-blue-700',   accent: 'text-blue-600'   },
  purple: { header: 'bg-purple-600',  badge: 'bg-purple-100 text-purple-700',accent: 'text-purple-600' },
  green:  { header: 'bg-green-600',   badge: 'bg-green-100 text-green-700', accent: 'text-green-600'  },
}

const CATEGORIES = [...new Set(SUMMARIES.map(s => s.category))]

function SummaryCard({ summary, onClick }) {
  const c = COLOR_CLASSES[summary.color] || COLOR_CLASSES.blue
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all overflow-hidden group"
    >
      <div className={`${c.header} text-white px-4 py-2.5`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{summary.icon}</span>
          <div>
            <h3 className="text-sm font-bold leading-tight">{summary.title}</h3>
            <span className={`text-xs px-1.5 py-0.5 rounded-full bg-white/20 text-white/90`}>{summary.category}</span>
          </div>
        </div>
      </div>
      <div className="px-4 py-2.5">
        {summary.sections.slice(0, 2).map((sec, i) => (
          <div key={i} className="mb-1.5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{sec.heading}</p>
            <p className="text-xs text-gray-600 line-clamp-2">{sec.items.slice(0, 2).join(' • ')}</p>
          </div>
        ))}
        <p className="text-xs text-blue-500 mt-2 group-hover:text-blue-700">Ver resumo completo →</p>
      </div>
    </button>
  )
}

function SummaryDetail({ summary, onClose }) {
  const c = COLOR_CLASSES[summary.color] || COLOR_CLASSES.blue
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-8 px-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mb-8" onClick={e => e.stopPropagation()}>
        <div className={`${c.header} text-white px-6 py-4 rounded-t-2xl flex items-start justify-between`}>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-2xl">{summary.icon}</span>
              <h2 className="text-xl font-bold">{summary.title}</h2>
            </div>
            <span className="text-sm opacity-80">{summary.category}</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none mt-0.5">×</button>
        </div>

        <div className="p-6 space-y-5">
          {summary.sections.map((sec, i) => (
            <div key={i}>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${c.accent}`}>{sec.heading}</h3>
              <ul className="space-y-1.5">
                {sec.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function SummariesPage() {
  const [filter, setFilter]     = useState('Todos')
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = SUMMARIES.filter(s => {
    const matchCat = filter === 'Todos' || s.category === filter
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.sections.some(sec => sec.items.some(item => item.toLowerCase().includes(search.toLowerCase())))
    return matchCat && matchSearch
  })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Topbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shrink-0">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar resumos..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {['Todos', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >{cat}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📖</p>
            <p className="text-lg font-medium">Nenhum resumo encontrado</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
            {filtered.map(s => (
              <SummaryCard key={s.id} summary={s} onClick={() => setSelected(s)} />
            ))}
          </div>
        )}
      </div>

      {selected && <SummaryDetail summary={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
