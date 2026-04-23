import React, { useState } from 'react'

const EMERGENCY_GROUPS = [
  { id: 'cardiac',    label: 'Cardiologia',       icon: '❤️',  items: ['pcr', 'eap', 'crise_htn', 'tep_massivo'] },
  { id: 'neuro',      label: 'Neurologia',         icon: '🧠',  items: ['avc_isquemico', 'status_epilepticus'] },
  { id: 'metabolic',  label: 'Metabólica',         icon: '🧪',  items: ['cad', 'hipercaliemia', 'hipoglicemia_grave'] },
  { id: 'sepsis',     label: 'Sépsis',             icon: '🦠',  items: ['sepsis_bundle'] },
  { id: 'resp',       label: 'Respiratório',       icon: '🫁',  items: ['broncoespasmo', 'pneumotorax'] },
  { id: 'allergic',   label: 'Alérgico',           icon: '⚠️',  items: ['anafilaxia'] },
]

const EMERGENCIES = {

  // ── PCR / ACLS ─────────────────────────────────────────────────────────────
  pcr: {
    name: 'PCR — Suporte Avançado de Vida (ACLS)',
    category: 'Cardiologia',
    color: 'red',
    criteria: [
      'Ausência de pulso central',
      'Ausência de respiração espontânea eficaz',
      'Perda de consciência',
    ],
    steps: [
      { label: 'Segurança', text: 'Confirmar segurança do local. Chamar ajuda. Activar equipa de ressuscitação.' },
      { label: 'RCP', text: 'Compressões torácicas: 100–120/min, profundidade 5–6 cm, relação 30:2. Minimizar interrupções.' },
      { label: 'DEA / Monitor', text: 'Conectar desfibrilhador assim que disponível. Analisar ritmo.' },
      { label: 'FV / TV s/ pulso', text: 'Choque não sincronizado bifásico 200 J → RCP 2 min → repetir.' },
      { label: 'AESP / Assistolia', text: 'Sem choque. RCP contínua. Tratar causas reversíveis (4H + 4T).' },
      { label: 'Acesso venoso', text: 'Acesso IV/IO precoce.' },
    ],
    drugs: [
      { name: 'Adrenalina (Epinefrina)', dose: '1 mg IV/IO', freq: 'A cada 3–5 min', note: 'Todos os ritmos' },
      { name: 'Amiodarona', dose: '300 mg IV/IO', freq: '1.ª dose após 3.º choque; 2.ª dose: 150 mg', note: 'FV / TV refractária' },
      { name: 'Lidocaína', dose: '1–1,5 mg/kg IV', freq: 'Alternativa à amiodarona', note: 'FV / TV' },
      { name: 'Bicarbonato de sódio 8,4%', dose: '1 mEq/kg IV', freq: 'Se hipercaliemia, acidose grave ou intoxicação por ATC', note: 'Não de rotina' },
    ],
    notes: [
      '4H: Hipóxia | Hipovolémia | Hipo/Hipercaliemia | Hipotermia',
      '4T: Tamponamento | Tensão (pneumotórax) | Trombose (coronária/pulmonar) | Tóxicos',
      'Capnografia: ETCO₂ > 10 mmHg sugere RCP eficaz; subida abrupta > 40 mmHg indica ROSC',
      'Após ROSC: gerir PA, glicemia, temperatura (TTM 32–36 °C se coma)'
    ]
  },

  // ── EAP ───────────────────────────────────────────────────────────────────
  eap: {
    name: 'Edema Agudo do Pulmão (EAP)',
    category: 'Cardiologia',
    color: 'red',
    criteria: [
      'Dispneia grave de início rápido',
      'Ortopneia, uso de músculos acessórios',
      'Crepitações bilaterais à auscultação',
      'SpO₂ baixa, sudorese fria',
    ],
    steps: [
      { label: 'Posição', text: 'Sentar o doente com pernas pendentes. Monitorização contínua (ECG, SpO₂, PA).' },
      { label: 'O₂ / VNI', text: 'O₂ de alto débito para SpO₂ ≥ 94%. CPAP/BiPAP se SpO₂ < 90% apesar de O₂ ou FR > 25 rpm — 1.ª linha na ausência de contraindicação.' },
      { label: 'Acesso IV', text: 'Acesso venoso. Gasimetria arterial. ECG. Rx tórax. BNP/NT-proBNP.' },
      { label: 'Nitratos', text: 'Se PAS > 90 mmHg: nitroglicerina 0,4–0,8 mg SL q5 min; ou perfusão IV 10–200 mcg/min.' },
      { label: 'Diurético', text: 'Furosemida 40–80 mg IV em bolus (dobrar dose se crónico sob furosemida). Pode repetir.' },
      { label: 'Morfina', text: 'Morfina 2–4 mg IV lento — controversa; usar com cautela se depressão respiratória.' },
      { label: 'Vasopressores', text: 'Se choque cardiogénico (PAS < 90): Noradrenalina 0,1–1 mcg/kg/min IV. Considerar balão intra-aórtico.' },
    ],
    drugs: [
      { name: 'Nitroglicerina', dose: '0,4 mg SL; ou 10–200 mcg/min IV', freq: 'Titular conforme PA (PAS > 90)', note: 'Vasodilatador 1.ª linha' },
      { name: 'Furosemida', dose: '40–80 mg IV', freq: 'Pode repetir 1–2 h depois', note: 'Diurético de ansa' },
      { name: 'Noradrenalina', dose: '0,1–1 mcg/kg/min IV', freq: 'Contínua', note: 'Se PA < 90 mmHg' },
      { name: 'Dobutamina', dose: '2–20 mcg/kg/min IV', freq: 'Contínua', note: 'Inotrópico se baixo débito' },
    ],
    notes: [
      'Pesquisar e tratar causa: SCA, FA rápida, HTA grave, endocardite, tamponamento',
      'Evitar nitratos se PAS < 90 mmHg, estenose aórtica grave ou sildenafil < 24 h',
    ]
  },

  // ── Crise hipertensiva ─────────────────────────────────────────────────────
  crise_htn: {
    name: 'Crise Hipertensiva',
    category: 'Cardiologia',
    color: 'orange',
    criteria: [
      'Urgência: PA > 180/120 sem lesão orgânica aguda',
      'Emergência: PA > 180/120 COM lesão orgânica aguda (AVC, EAP, SCA, dissecção, eclâmpsia, encefalopatia)',
    ],
    steps: [
      { label: 'Avaliar lesão orgânica', text: 'ECG, enzimas cardíacas, creatinina, sumária urina, fundo do olho, TC crânio se neurológico.' },
      { label: 'Urgência hipertensiva', text: 'Reduzir PA gradualmente (máx. 25% em 24 h). Via oral. Ambiente tranquilo.' },
      { label: 'Emergência hipertensiva', text: 'Reduzir PAM 10–20% na 1.ª hora, depois 5–15% nas 23 h seguintes. Via IV.' },
      { label: 'AVC isquémico', text: 'Só tratar se PA > 220/120 (sem trombólise) ou > 185/110 (candidato a rt-PA).' },
    ],
    drugs: [
      { name: 'Labetalol', dose: '20 mg IV bolus, depois 2 mg/min perfusão', freq: 'Bolus repetíveis 40–80 mg q10 min (máx. 300 mg)', note: 'Emergência — α + β bloqueador' },
      { name: 'Nicardipina', dose: '5–15 mg/h IV', freq: 'Iniciar 5 mg/h, aumentar 2,5 mg/h q5–15 min', note: 'Alternativa IV — BCC' },
      { name: 'Nitroprussiato de sódio', dose: '0,25–10 mcg/kg/min IV', freq: 'Titular', note: 'EAP / Encefalopatia — monitorizar toxicidade cianeto' },
      { name: 'Captopril', dose: '25–50 mg SL ou VO', freq: 'Urgência (sem lesão)', note: 'Início 15–30 min' },
      { name: 'Amlodipina / Nifedipina LP', dose: '5–10 mg VO', freq: 'Urgência', note: 'Evitar nifedipina curta acção' },
      { name: 'Sulfato de magnésio', dose: '4–6 g IV em 15–20 min + 1–2 g/h', freq: 'Manutenção 1–2 g/h', note: 'Pré-eclâmpsia / Eclâmpsia' },
    ],
    notes: [
      'Pré-eclâmpsia grave: MgSO₄ + labetalol ou nicardipina; não usar nitroprussiato',
      'Dissecção aórtica: Labetalol IV — alvo PAS < 120 mmHg em 20 min',
      'Feocromocitoma: Fentolamina 5–15 mg IV — evitar beta-bloqueadores sem α-bloqueio prévio',
    ]
  },

  // ── TEP maciço ─────────────────────────────────────────────────────────────
  tep_massivo: {
    name: 'TEP de Alto Risco (Maciço)',
    category: 'Cardiologia',
    color: 'red',
    criteria: [
      'TEP confirmado ou altamente provável',
      'Choque ou hipotensão (PAS < 90 mmHg > 15 min ou queda > 40 mmHg)',
      'Taquicardia, hipóxia, síncope, dor torácica pleurítica',
    ],
    steps: [
      { label: 'Estabilização', text: 'O₂ alto débito. Acesso IV grosso calibre. Monitorização. Ecocardiograma urgente.' },
      { label: 'Anticoagulação imediata', text: 'Heparina não fraccionada (HNF) IV em bólus + perfusão. Iniciar antes de imagem se alta probabilidade.' },
      { label: 'Trombólise', text: 'Se instabilidade hemodinâmica sem contraindicação absoluta: Alteplase 100 mg IV em 2 h.' },
      { label: 'Alternativas à trombólise', text: 'Embolectomia cirúrgica ou percutânea se trombólise contraindicada ou falhou.' },
      { label: 'Suporte hemodinâmico', text: 'Noradrenalina. Evitar sobrecarga de volume agressiva (agrava VD).' },
    ],
    drugs: [
      { name: 'HNF (Heparina não fraccionada)', dose: '80 UI/kg IV bolus → 18 UI/kg/h perfusão', freq: 'Ajustar conforme TTPa (alvo 60–100 s)', note: '1.ª linha TEP alto risco' },
      { name: 'Alteplase (rt-PA)', dose: '100 mg IV em 2 h', freq: 'Dose única', note: 'PCR: 50 mg em bólus' },
      { name: 'Noradrenalina', dose: '0,1–1 mcg/kg/min IV', freq: 'Contínua', note: 'Choque refractário' },
    ],
    notes: [
      'Contraindicações absolutas à trombólise: AVC hemorrágico prévio, AVC isquémico < 3 meses, neoplasia intracraniana, trauma major < 3 semanas, hemorragia GI activa',
      'Após estabilização: transição para anticoagulação prolongada (NOAC ou AVK)',
    ]
  },

  // ── AVC isquémico ──────────────────────────────────────────────────────────
  avc_isquemico: {
    name: 'AVC Isquémico Agudo',
    category: 'Neurologia',
    color: 'red',
    criteria: [
      '"Tempo é cérebro" — 1,9 milhões de neurónios por minuto',
      'Défice neurológico focal de início súbito',
      'FAST: Face / Arm / Speech / Time',
    ],
    steps: [
      { label: 'Activar protocolo AVC', text: 'Activar via verde AVC. Neurologia urgente. TC crânio sem contraste em < 25 min.' },
      { label: 'ABC + Monitorização', text: 'O₂ se SpO₂ < 94%. ECG. Monitorização contínua. Acesso IV × 2.' },
      { label: 'Glicemia', text: 'Corrigir hipoglicemia (< 60 mg/dL → glicose IV). Tratar hiperglicemia se > 180 mg/dL.' },
      { label: 'PA', text: 'Não tratar salvo PA > 220/120 (sem tPA) ou > 185/110 (candidato a tPA). Alvo antes de tPA: < 185/110.' },
      { label: 'Trombólise IV (rt-PA)', text: 'Janela ≤ 4,5 h dos sintomas. Alteplase 0,9 mg/kg (máx. 90 mg): 10% em bólus IV, 90% em perfusão 60 min.' },
      { label: 'Trombectomia mecânica', text: 'Indicar se oclusão de grande vaso, NIHSS ≥ 6, até 24 h em selecionados. Imagiologia avançada (perfusão/colateral).' },
      { label: 'Antiagregação', text: 'AAS 300 mg VO/SNG se sem tPA (aguardar 24 h após tPA). Iniciar estatina de alta intensidade.' },
    ],
    drugs: [
      { name: 'Alteplase (rt-PA)', dose: '0,9 mg/kg IV (máx. 90 mg)', freq: '10% em bólus + 90% em 60 min', note: 'Janela ≤ 4,5 h' },
      { name: 'AAS', dose: '300 mg VO', freq: 'Dose única (depois 100 mg/dia)', note: 'Sem tPA; 24 h após tPA' },
      { name: 'Labetalol', dose: '10–20 mg IV lento', freq: 'Se PA > 185/110 antes de tPA', note: 'Alvo: PA < 185/110' },
      { name: 'Glicose 30%', dose: '60–100 mL IV', freq: 'Se glicemia < 60 mg/dL', note: 'Corrigir hipoglicemia' },
    ],
    notes: [
      'Contraindicações tPA: AVC/TCE < 3 meses, cirurgia major < 14 dias, hemorragia activa, plaquetas < 100k, INR > 1,7, glicemia < 50 ou > 400',
      'Após tPA: PA < 180/105 nas primeiras 24 h; não anticoagular nas primeiras 24 h',
      'AIT: ABCD² score. Aspirina + estatina. ECG holter. Ecocardiograma. TC/RMN urgente.',
    ]
  },

  // ── Status Epilepticus ────────────────────────────────────────────────────
  status_epilepticus: {
    name: 'Estado de Mal Epiléptico',
    category: 'Neurologia',
    color: 'red',
    criteria: [
      'Convulsão ≥ 5 min',
      'Duas ou mais convulsões sem recuperação entre elas',
    ],
    steps: [
      { label: 'Fase 1 (0–5 min)', text: 'Proteger via aérea. O₂. Glicemia capilar. Acesso IV. Monitorização.' },
      { label: 'Fase 2 (5–20 min) — Benzodiazepina', text: 'Lorazepam 4 mg IV (repetir 1× após 5 min) ou Diazepam 10 mg IV/rectal ou Midazolam 10 mg IM.' },
      { label: 'Fase 3 (20–40 min) — 2.ª linha', text: 'Levetiracetam 60 mg/kg IV (máx. 4500 mg) em 10 min OU Valproato 40 mg/kg IV (máx. 3000 mg) em 10 min OU Fenitoína 20 mg/kg IV (máx. 50 mg/min) com monitorização ECG.' },
      { label: 'Fase 4 (> 40 min) — Refractário', text: 'Status refractário → UCI. Anestesia geral: Propofol 1–2 mg/kg IV bólus + perfusão 2–10 mg/kg/h OU Midazolam 0,2 mg/kg + 0,05–0,5 mg/kg/h.' },
      { label: 'Investigação', text: 'Glicemia, ionograma, cálcio, Mg, função renal e hepática, hemograma, TC crânio, PL se suspeita de meningite/encefalite.' },
    ],
    drugs: [
      { name: 'Lorazepam', dose: '4 mg IV', freq: 'Repetir 1× após 5 min', note: '1.ª linha (se IV disponível)' },
      { name: 'Diazepam', dose: '10 mg IV ou rectal', freq: 'Repetir 1× após 5 min', note: 'Alternativa 1.ª linha' },
      { name: 'Midazolam', dose: '10 mg IM (narinas: 5–10 mg)', freq: '1× dose', note: 'Se sem acesso IV' },
      { name: 'Levetiracetam', dose: '60 mg/kg IV (máx. 4500 mg)', freq: '1 × em 10 min', note: '2.ª linha — bem tolerado' },
      { name: 'Valproato sódico', dose: '40 mg/kg IV (máx. 3000 mg)', freq: '1 × em 10 min', note: '2.ª linha' },
      { name: 'Propofol', dose: '1–2 mg/kg IV bólus + 2–10 mg/kg/h', freq: 'Contínua (UCI)', note: 'Status refractário' },
    ],
    notes: [
      'Corrigir glicemia, hipóxia, hiponatrémia, hipomagnesémia',
      'Tiamina 100 mg IV antes de glicose se suspeita de défice (alcoolismo, desnutrição)',
      'Monitorização EEG contínua se anestesia geral (alvo: supressão de surtos)',
    ]
  },

  // ── CAD ────────────────────────────────────────────────────────────────────
  cad: {
    name: 'Cetoacidose Diabética (CAD)',
    category: 'Metabólica',
    color: 'orange',
    criteria: [
      'Glicemia > 250 mg/dL (geralmente)',
      'pH arterial < 7,3 ou bicarbonato < 18 mEq/L',
      'Cetonémia > 3 mmol/L ou cetonúria +++',
    ],
    steps: [
      { label: 'Avaliação inicial', text: 'Gasimetria, ionograma, ureia, creatinina, glicemia, cetonémia, hemograma, ECG. Identificar e tratar factor precipitante (infecção, omissão insulina, debut DM1).' },
      { label: 'Hidratação', text: 'NaCl 0,9%: 1 L/h na 1.ª hora; depois 500 mL/h × 4 h; depois 250 mL/h conforme resposta. Quando Glic < 250 mg/dL → mudar para SG5% + NaCl 0,45%.' },
      { label: 'Potássio', text: 'SEMPRE verificar K⁺ antes de insulina! K⁺ < 3,5: repor K⁺ antes de iniciar insulina. K⁺ 3,5–5,5: adicionar 20–40 mEq/L de KCl ao soro. K⁺ > 5,5: sem K⁺.' },
      { label: 'Insulina', text: 'Insulina regular 0,1 UI/kg/h em perfusão contínua. Não dar bólus inicial. Quando Glic < 250 mg/dL reduzir para 0,02–0,05 UI/kg/h e adicionar glicose.' },
      { label: 'Monitorização', text: 'Glicemia + cetonémia 1–2 h. Ionograma 2–4 h. pH/gasimetria 2–4 h. Algaliação se oligúria.' },
      { label: 'Critérios de resolução', text: 'Glicemia < 200 mg/dL + pH > 7,3 + bicarbonato > 18 mEq/L + cetonémia < 0,5 mmol/L → iniciar insulina SC 1–2 h antes de suspender perfusão.' },
    ],
    drugs: [
      { name: 'NaCl 0,9%', dose: '1 L na 1.ª hora', freq: 'Depois 500 mL/h × 4 h, depois 250 mL/h', note: 'Hidratação base' },
      { name: 'Insulina regular', dose: '0,1 UI/kg/h IV (perfusão)', freq: 'Contínua', note: 'Sem bólus inicial' },
      { name: 'KCl', dose: '20–40 mEq/L', freq: 'Adicionar ao soro conforme K⁺', note: 'Não iniciar insulina se K⁺ < 3,5' },
      { name: 'Bicarbonato NaHCO₃', dose: '100 mEq IV em 2 h', freq: 'Apenas se pH < 7,0', note: 'Não usar de rotina' },
    ],
    notes: [
      'CAD euglicémica: possível com iSGLT2 — glicemia pode ser < 200 mg/dL',
      'Estado hiperosmolar hiperglicémico (EHH): glicemia > 600, sem acidose significativa — hidratação mais lenta, sem insulina agressiva',
      'Edema cerebral: principalmente em crianças — hidratação demasiado rápida',
    ]
  },

  // ── Hipercaliemia ──────────────────────────────────────────────────────────
  hipercaliemia: {
    name: 'Hipercaliemia Grave',
    category: 'Metabólica',
    color: 'red',
    criteria: [
      'K⁺ > 6,0 mEq/L',
      'Alterações ECG: ondas T apiculadas, alargamento QRS, onda sinusal, FV',
      'Fraqueza muscular, paralisia',
    ],
    steps: [
      { label: 'ECG imediato', text: 'ECG urgente. Monitorização contínua. Qualquer alteração ECG → tratamento imediato.' },
      { label: '1. Estabilização de membrana', text: 'Gluconato de cálcio 10% 10 mL IV em 2–3 min. Efeito em 1–3 min, duração 30–60 min. Repetir se persistirem alterações ECG. (Não com bicarbonato no mesmo acesso).' },
      { label: '2. Redistribuição intracelular', text: 'Insulina regular 10 UI IV + Glicose 50% 50 mL (ou Glicose 25 g). Efeito em 15–30 min, reduz K⁺ 0,5–1,5 mEq/L. +++ Salbutamol 10–20 mg nebulizado.' },
      { label: '3. Eliminação do K⁺', text: 'Furosemida 40–80 mg IV (se diurese preservada). Resina: Patirómero ou Kayexalato VO. Diálise urgente se oligúria/anúria ou K⁺ > 7.' },
      { label: 'Corrigir causa', text: 'Suspender IECA/BRA/poupadores de K⁺. Avaliar função renal. Tratar acidose.' },
    ],
    drugs: [
      { name: 'Gluconato de cálcio 10%', dose: '10 mL IV em 2–3 min', freq: 'Repetir q5 min se ECG persistir alterado', note: 'Estabilização de membrana — não reduz K⁺' },
      { name: 'Insulina regular + Glicose', dose: '10 UI + 25 g glicose IV', freq: '1 × (monitorizar glicemia q1h)', note: 'Redistribuição' },
      { name: 'Salbutamol nebulizado', dose: '10–20 mg neb', freq: '1×', note: 'Redistribuição (adicional)' },
      { name: 'Furosemida', dose: '40–80 mg IV', freq: '1×', note: 'Eliminação renal' },
      { name: 'Bicarbonato de sódio', dose: '50–100 mEq IV', freq: 'Se acidose metabólica grave', note: 'Redistribute — menos eficaz isolado' },
    ],
    notes: [
      'Gluconato de cálcio NÃO é compatível no mesmo acesso com bicarbonato',
      'Pseudo-hipercaliemia: repetir colheita sem garrote prolongado',
      'Se hemólise da amostra → repetir análise',
    ]
  },

  // ── Hipoglicemia grave ─────────────────────────────────────────────────────
  hipoglicemia_grave: {
    name: 'Hipoglicemia Grave',
    category: 'Metabólica',
    color: 'orange',
    criteria: [
      'Glicemia < 54 mg/dL (< 3 mmol/L)',
      'Sintomas neuroglicopénicos: confusão, convulsão, coma',
      'Incapacidade de auto-tratamento',
    ],
    steps: [
      { label: 'Consciente + capaz de engolir', text: '15–20 g de glucose oral (3–4 cápsulas glucose, 150 mL sumo, 3–4 comprimidos glucose). Repetir glicemia em 15 min. Repetir se < 70 mg/dL.' },
      { label: 'Inconsciente / incapaz de engolir', text: 'Via IV: Glicose 30% 60–100 mL IV (ou SG50% 50–100 mL). Resultado em 1–5 min.' },
      { label: 'Sem acesso IV', text: 'Glucagon 1 mg IM/SC. Início de acção: 5–15 min. Pode causar náuseas e vómitos.' },
      { label: 'Após resolução', text: 'Refeição rica em hidratos de carbono complexos. Monitorizar glicemia. Investigar causa.' },
      { label: 'Hipoglicemia por sulfonilureias', text: 'Risco de recorrência. Internamento mínimo 24 h. Perfusão de SG10% para manutenção.' },
    ],
    drugs: [
      { name: 'Glicose 30%', dose: '60–100 mL IV (= 18–30 g glicose)', freq: 'Repetir se necessário', note: '1.ª linha se IV disponível' },
      { name: 'Glucagon', dose: '1 mg IM ou SC', freq: '1×', note: 'Sem acesso IV; ineficaz em doença hepática ou desnutrição' },
      { name: 'SG10%', dose: '100–200 mL/h IV', freq: 'Perfusão de manutenção', note: 'Pós-resolução em sulfonilureias' },
    ],
    notes: [
      'Glicose 30% é hiperosmolar — usar veia de bom calibre ou acesso central',
      'Glucagon é ineficaz no alcoolismo (reservas de glicogénio depletadas)',
      'Investigar causa: insulin overdose, sulfonilureias, álcool, insuficiência adrenal, insulinoma',
    ]
  },

  // ── Sépsis bundle ──────────────────────────────────────────────────────────
  sepsis_bundle: {
    name: 'Sépsis e Choque Séptico — Bundle 1 hora',
    category: 'Sépsis',
    color: 'red',
    criteria: [
      'Sépsis: disfunção orgânica ameaçadora de vida por resposta desregulada à infecção',
      'qSOFA ≥ 2 ou SOFA ≥ 2 pontos acima do basal',
      'Choque séptico: necessidade de vasopressores + lactato > 2 mmol/L',
    ],
    steps: [
      { label: 'Medir lactato', text: 'Lactato sérico. Se > 2 mmol/L: repetir em 2 h (alvo: redução ≥ 10%).' },
      { label: 'Hemoculturas', text: 'Hemoculturas × 2 pares (aeróbio + anaeróbio) ANTES de ATB, sem atrasar ATB > 45 min.' },
      { label: 'ATB empírico', text: 'Antibiótico de largo espectro adequado ao foco em < 1 h. Cobrir gram-negativo ± gram-positivo ± anaeróbios conforme foco.' },
      { label: 'Fluidoterapia', text: 'Cristaloides 30 mL/kg IV em < 3 h se hipoperfusão (lactato ≥ 4 mmol/L ou hipotensão). Reavaliar resposta (PVC, ecocardiografia point-of-care).' },
      { label: 'Vasopressores', text: 'Se PAM < 65 mmHg após fluidos: Noradrenalina 0,1–1 mcg/kg/min (1.ª linha).' },
      { label: 'Controlo do foco', text: 'Identificar e controlar foco infeccioso: drenagem de abcesso, remoção de cateter, cirurgia.' },
      { label: 'Corticosteróide', text: 'Hidrocortisona 200 mg/dia IV em perfusão contínua se choque refractário a vasopressores.' },
    ],
    drugs: [
      { name: 'ATB (foco pulmonar)', dose: 'Amoxicilina-clavulanato 1,2 g IV q8h + Azitromicina 500 mg IV', freq: 'q8h + 1×/dia', note: 'Pneumonia comunitária grave' },
      { name: 'ATB (foco abdominal)', dose: 'Piperacilina-tazobactam 4,5 g IV', freq: 'q6h', note: 'Peritonite / abdominal' },
      { name: 'ATB (foco urinário)', dose: 'Ceftriaxone 2 g IV', freq: '1×/dia', note: 'UTI complicada / urossépsis' },
      { name: 'Noradrenalina', dose: '0,1–1 mcg/kg/min IV', freq: 'Contínua', note: 'Vasopressor 1.ª linha' },
      { name: 'Hidrocortisona', dose: '200 mg/dia IV', freq: 'Perfusão contínua ou 50 mg q6h', note: 'Choque refractário' },
      { name: 'NaCl 0,9% / Ringer Lactato', dose: '30 mL/kg IV', freq: 'Em < 3 h', note: 'Fluidoterapia inicial' },
    ],
    notes: [
      'Desescalada ATB em 48–72 h conforme culturas e evolução',
      'Glicemia alvo: 140–180 mg/dL — corrigir hiper/hipoglicemia',
      'Controlo de lactato é marcador de perfusão tecidual (alvo: normalizar < 4 h)',
      'Profilaxia TVP (heparina) + profilaxia úlcera stress (IBP)',
    ]
  },

  // ── Broncoespasmo grave ───────────────────────────────────────────────────
  broncoespasmo: {
    name: 'Broncoespasmo Grave / Status Asmático',
    category: 'Respiratório',
    color: 'red',
    criteria: [
      'SpO₂ < 92% em ar ambiente',
      'FR > 30 rpm, uso de músculos acessórios, cianose',
      'Sem capacidade de falar frases completas',
      'Peak flow < 33% do previsto',
    ],
    steps: [
      { label: 'O₂', text: 'O₂ para SpO₂ ≥ 94–98%. Nebulizador com O₂ a 6 L/min.' },
      { label: 'Broncodilatador inalado', text: 'Salbutamol 5 mg nebulizado q20 min × 3 (primeira hora). Ipratrópio 0,5 mg acrescentar ao salbutamol na 1.ª hora.' },
      { label: 'Corticoide sistémico', text: 'Metilprednisolona 125 mg IV ou Prednisolona 40–60 mg VO. Efeito em 4–6 h.' },
      { label: 'Magnésio', text: 'Sulfato de magnésio 2 g IV em 20 min (1.ª episódio grave ou resistente a broncodilatadores).' },
      { label: 'Adrenalina', text: 'Adrenalina 0,3 mg IM (SC) se anafilaxia concomitante ou status gravíssimo.' },
      { label: 'VNI / Intubação', text: 'VNI (BiPAP/CPAP) se deterioração apesar do tratamento. Intubação se paragem respiratória, exaustão, confusão, SpO₂ < 90% refractária.' },
    ],
    drugs: [
      { name: 'Salbutamol nebulizado', dose: '5 mg neb', freq: 'q20 min × 3, depois q1–4 h', note: '1.ª linha broncodilatador' },
      { name: 'Ipratrópio neb', dose: '0,5 mg neb', freq: 'q20 min × 3 (nas primeiras 3 h)', note: 'Adicionar ao salbutamol' },
      { name: 'Metilprednisolona', dose: '125 mg IV', freq: '1×', note: 'Corticoide sistémico' },
      { name: 'Sulfato de magnésio', dose: '2 g IV em 20 min', freq: '1×', note: 'Status grave / refractário' },
      { name: 'Adrenalina', dose: '0,3–0,5 mg IM (coxa)', freq: 'Repetir q5–15 min se necessário', note: 'Anafilaxia / status gravíssimo' },
    ],
    notes: [
      'Evitar sedação sem via aérea controlada',
      'DPOC em exacerbação: target SpO₂ 88–92% (risco hipercapnia)',
      'Heliox (70%He/30%O₂) pode reduzir resistência das vias aéreas',
    ]
  },

  // ── Pneumotórax ───────────────────────────────────────────────────────────
  pneumotorax: {
    name: 'Pneumotórax Hipertensivo',
    category: 'Respiratório',
    color: 'red',
    criteria: [
      'Diagnóstico CLÍNICO — não esperar por Rx em emergência',
      'Hipotensão + dispneia grave + desvio traqueal (tardio)',
      'Ausência unilateral de sons respiratórios',
      'Distensão venosa jugular',
    ],
    steps: [
      { label: 'Descompressão imediata', text: 'Agulha de grande calibre (14–16 G) no 2.º espaço intercostal, linha medioclavicular — imediatamente. Saída de ar confirma diagnóstico.' },
      { label: 'Drenagem definitiva', text: 'Toracostomia com dreno (5.º EIC, linha axilar anterior) — após descompressão com agulha ou como tratamento primário em contexto hospitalar.' },
      { label: 'Suporte', text: 'O₂ 100%. Acesso IV. Analgesia. Monitorização contínua. Rx após drenagem.' },
    ],
    drugs: [
      { name: 'O₂ 100%', dose: 'Alto débito (≥ 10 L/min)', freq: 'Contínuo', note: 'Acelera reabsorção ar pleural' },
      { name: 'Morfina', dose: '2–5 mg IV', freq: 'Após drenagem', note: 'Analgesia pós-drenagem' },
    ],
    notes: [
      'Pneumotórax simples pequeno (< 2 cm) em doente estável: observação + O₂',
      'Em doente ventilado: pneumotórax espontâneo → drenagem sempre',
    ]
  },

  // ── Anafilaxia ────────────────────────────────────────────────────────────
  anafilaxia: {
    name: 'Anafilaxia',
    category: 'Alérgico',
    color: 'red',
    criteria: [
      'Reacção alérgica grave de início súbito',
      'Urticária/angioedema + sintoma sistémico (hipotensão, broncoespasmo, vómitos)',
      'Exposição provável a alergénio',
    ],
    steps: [
      { label: 'ADRENALINA — imediatamente', text: 'Adrenalina 0,3–0,5 mg IM (coxa anterolateral, vasto lateral). NUNCA IV em bólus fora de UCI.' },
      { label: 'Posição', text: 'Deitado com pernas elevadas (excepto dispneia → sentado). Evitar ortostase súbita.' },
      { label: 'O₂', text: 'O₂ alto débito (10–15 L/min). Via aérea avançada se edema laríngeo.' },
      { label: 'Acesso IV', text: 'Acesso IV × 2 grosso calibre. Cristaloides 1–2 L IV se hipotensão.' },
      { label: 'Repetir adrenalina', text: 'Se sem melhoria em 5–15 min: repetir adrenalina IM 0,3–0,5 mg. Máx. 3 doses.' },
      { label: 'Anti-histamínico', text: 'Clorfeniramina 10 mg IV (ou difenidramina 25–50 mg IV) — adjuvante, NÃO substitui adrenalina.' },
      { label: 'Corticoide', text: 'Metilprednisolona 125 mg IV (ou Hidrocortisona 200 mg IV) — previne reacção bifásica.' },
      { label: 'Broncoespasmo refractário', text: 'Salbutamol 5 mg nebulizado.' },
      { label: 'Observação', text: 'Mínimo 6–8 h após resolução (24 h se grave) — risco de reacção bifásica.' },
    ],
    drugs: [
      { name: 'Adrenalina (Epinefrina)', dose: '0,3–0,5 mg IM (coxa)', freq: 'Repetir q5–15 min (máx. 3×)', note: '1.ª linha — imediata' },
      { name: 'NaCl 0,9%', dose: '1–2 L IV rápido', freq: 'Titular conforme PA', note: 'Hipotensão / choque anafiláctico' },
      { name: 'Metilprednisolona', dose: '125 mg IV', freq: '1×', note: 'Previne reacção bifásica' },
      { name: 'Clorfeniramina', dose: '10 mg IV lento', freq: '1×', note: 'Anti-H1 — adjuvante' },
      { name: 'Salbutamol', dose: '5 mg nebulizado', freq: 'q20 min', note: 'Se broncoespasmo' },
      { name: 'Adrenalina IV perfusão', dose: '0,1–1 mcg/kg/min', freq: 'Contínua (UCI)', note: 'Choque refractário' },
    ],
    notes: [
      'Adrenalina IM é SEMPRE o 1.º fármaco — não atrasar por procurar IV',
      'Anti-histamínicos e corticoides NÃO tratam hipotensão ou broncoespasmo agudo',
      'Doentes com história de anafilaxia: auto-injectores de adrenalina (EpiPen)',
      'Investigar alérgeno: triptase sérica (0–1 h, 1–2 h, 24 h após)',
    ]
  },
}

// ─── Components ─────────────────────────────────────────────────────────────

const COLOR_MAP = {
  red:    { header: 'bg-red-600',    badge: 'bg-red-100 text-red-800',    border: 'border-red-200'    },
  orange: { header: 'bg-orange-500', badge: 'bg-orange-100 text-orange-800', border: 'border-orange-200' },
  yellow: { header: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-200' },
}

function DrugTag({ drug }) {
  const [copied, setCopied] = useState(false)
  const text = `${drug.name} ${drug.dose} — ${drug.freq}`
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="flex items-start gap-2 p-2.5 bg-white rounded-lg border border-gray-200 group">
      <div className="flex-1">
        <span className="font-semibold text-gray-800 text-sm">{drug.name}</span>
        <span className="ml-1 font-mono text-blue-700 text-sm">{drug.dose}</span>
        <div className="text-xs text-gray-500 mt-0.5">{drug.freq} {drug.note && <span className="text-gray-400">— {drug.note}</span>}</div>
      </div>
      <button
        onClick={copy}
        title="Copiar"
        className={`text-xs px-1.5 py-0.5 rounded shrink-0 transition-colors ${
          copied ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >{copied ? '✓' : '⧉'}</button>
    </div>
  )
}

function EmergencyDetail({ em }) {
  const c = COLOR_MAP[em.color] || COLOR_MAP.orange
  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className={`${c.header} text-white px-5 py-3 rounded-t-xl`}>
        <h2 className="text-lg font-bold">{em.name}</h2>
        <span className="text-xs opacity-80">{em.category}</span>
      </div>

      <div className="border border-t-0 border-gray-200 rounded-b-xl overflow-hidden">
        {/* Critérios */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Reconhecimento</p>
          <ul className="space-y-1">
            {em.criteria.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-gray-400 mt-0.5 shrink-0">•</span>{c}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="px-5 py-3 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Protocolo</p>
          <ol className="space-y-2">
            {em.steps.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold mt-0.5">{i + 1}</span>
                <div>
                  <span className="font-semibold text-gray-800">{s.label}: </span>
                  <span className="text-gray-600">{s.text}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Drugs */}
        <div className="px-5 py-3 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Fármacos e Doses</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {em.drugs.map((d, i) => <DrugTag key={i} drug={d} />)}
          </div>
        </div>

        {/* Notes */}
        {em.notes?.length > 0 && (
          <div className="px-5 py-3 bg-amber-50">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Notas</p>
            <ul className="space-y-1">
              {em.notes.map((n, i) => (
                <li key={i} className="text-xs text-amber-800 flex gap-2">
                  <span className="shrink-0">⚠</span>{n}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EmergencyPage() {
  const [activeId, setActiveId] = useState('pcr')
  const em = EMERGENCIES[activeId]

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel */}
      <div className="w-56 shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        {EMERGENCY_GROUPS.map(g => (
          <div key={g.id}>
            <div className="px-3 pt-3 pb-1 flex items-center gap-1.5">
              <span className="text-sm">{g.icon}</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{g.label}</span>
            </div>
            {g.items.map(eid => (
              <button
                key={eid}
                onClick={() => setActiveId(eid)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors
                  ${activeId === eid ? 'bg-red-50 text-red-700 font-semibold border-r-2 border-red-500' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {EMERGENCIES[eid]?.name.split(' — ')[0].substring(0, 30)}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto p-6">
        {em && <EmergencyDetail em={em} />}
      </div>
    </div>
  )
}
