import React, { useState } from 'react'

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
      { label: 'DEA / Monitor', text: 'Conectar desfibrilhador assim que disponível. Analisar ritmo a cada 2 min.' },
      { label: 'FV / TV s/ pulso', text: 'Choque não sincronizado bifásico 200 J → RCP 2 min → repetir.' },
      { label: 'AESP / Assistolia', text: 'Sem choque. RCP contínua. Tratar causas reversíveis (4H + 4T).' },
      { label: 'Acesso venoso', text: 'Acesso IV/IO precoce. Adrenalina a cada 3–5 min.' },
    ],
    drugs: [
      { name: 'Adrenalina', dose: '1 mg IV/IO', freq: 'A cada 3–5 min', note: 'Todos os ritmos não chocáveis e FV/TV após 2.º choque' },
      { name: 'Amiodarona', dose: '300 mg IV/IO', freq: '1.ª dose após 3.º choque; 2.ª dose: 150 mg', note: 'FV / TV refractária' },
      { name: 'Lidocaína', dose: '1–1,5 mg/kg IV', freq: 'Alternativa à amiodarona', note: 'FV / TV' },
      { name: 'Bicarbonato de sódio 8,4%', dose: '1 mEq/kg IV', freq: 'Se hipercaliemia, acidose grave ou intox. ATC', note: 'Não de rotina' },
    ],
    notes: [
      '4H: Hipóxia | Hipovolémia | Hipo/Hipercaliemia | Hipotermia',
      '4T: Tamponamento | Tensão (pneumotórax) | Trombose (coronária/pulmonar) | Tóxicos',
      'Capnografia: ETCO₂ > 10 mmHg → RCP eficaz; subida abrupta > 40 mmHg → ROSC',
      'Após ROSC: gerir PA, glicemia, temperatura (TTM 32–36 °C se coma)',
    ]
  },

  // ── EAP ───────────────────────────────────────────────────────────────────
  eap: {
    name: 'Edema Agudo do Pulmão (EAP)',
    category: 'Cardiologia',
    color: 'red',
    criteria: [
      'Dispneia grave de início rápido, ortopneia',
      'Uso de músculos acessórios, crepitações bilaterais',
      'SpO₂ baixa, sudorese fria',
    ],
    steps: [
      { label: 'Posição', text: 'Sentar o doente com pernas pendentes. Monitorização contínua (ECG, SpO₂, PA).' },
      { label: 'O₂ / VNI', text: 'O₂ alto débito para SpO₂ ≥ 94%. CPAP/BiPAP se SpO₂ < 90% ou FR > 25 rpm — 1.ª linha na ausência de CI.' },
      { label: 'Acesso IV', text: 'Gasimetria arterial. ECG. Rx tórax. BNP/NT-proBNP. Troponina.' },
      { label: 'Nitratos', text: 'Se PAS > 90 mmHg: nitroglicerina 0,4 mg SL q5 min; ou perfusão IV 10–200 mcg/min.' },
      { label: 'Diurético', text: 'Furosemida 40–80 mg IV (dobrar dose se já faz furosemida crónica). Pode repetir.' },
      { label: 'Vasopressores', text: 'Choque cardiogénico (PAS < 90): Noradrenalina 0,1–1 mcg/kg/min IV.' },
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
      'Emergência hipertensiva: PA muito elevada + lesão órgão-alvo (AVC, EAP, SCA, dissecção)',
      'Urgência hipertensiva: PA muito elevada SEM lesão órgão-alvo aguda',
      'Limiar prático: PAS > 180 mmHg e/ou PAD > 120 mmHg',
    ],
    steps: [
      { label: 'Diferenciar', text: 'Emergência (com lesão órgão-alvo) vs Urgência (sem lesão). Determina velocidade e via de redução.' },
      { label: 'Emergência', text: 'Reduzir PA em 25% na 1.ª hora (não mais). Internamento em UCI. Agentes IV: labetalol, nicardipina, nitroprussiato (monitorização invasiva).' },
      { label: 'Urgência', text: 'Reduzir gradualmente nas 24–48 h. Via oral: captopril 25 mg SL, labetalol PO, amlodipina. Evitar reduções bruscas.' },
      { label: 'Causas', text: 'Excluir: AVC hemorrágico (TC), dissecção aórtica (Rx tórax, TC-aorta), SCA (ECG, troponina), feocromocitoma.' },
    ],
    drugs: [
      { name: 'Labetalol', dose: '10–20 mg IV em 2 min', freq: 'Repetir q10 min (máx. 80 mg); ou 0,5–2 mg/min perfusão', note: 'Emergência HTA, dissecção' },
      { name: 'Nicardipina', dose: '5 mg/h IV perfusão', freq: 'Titular até 15 mg/h', note: 'Emergência HTA geral' },
      { name: 'Nitroprussiato', dose: '0,5–10 mcg/kg/min IV', freq: 'Monitorização invasiva obrigatória', note: 'EAP HTA, últimas linha' },
      { name: 'Captopril', dose: '25 mg SL', freq: 'Urgência (via oral)', note: 'Início 15–30 min' },
    ],
    notes: [
      'Dissecção aórtica tipo A: PA alvo PAS < 120 mmHg, FC < 60 bpm. Cirurgia urgente.',
      'AVC isquémico: só tratar se PA > 220/120 ou se elegível para trombólise (alvo < 185/110)',
      'Eclâmpsia: MgSO₄ 4 g IV + labetalol ou hidralazina. Parto urgente.',
    ]
  },

  // ── TEP Maciço ────────────────────────────────────────────────────────────
  tep_massivo: {
    name: 'TEP Maciço (Alto Risco)',
    category: 'Cardiologia',
    color: 'red',
    criteria: [
      'TEP + choque obstrutivo ou paragem cardiorrespiratória',
      'Hipotensão persistente (PAS < 90 mmHg ou queda > 40 mmHg × 15 min) sem outra causa',
      'Ecocardiograma: disfunção VD, dilatação VD, sinal de McConnell',
    ],
    steps: [
      { label: 'Suporte', text: 'O₂ alto débito (BIPAP se necessário). Acesso IV × 2. Monitorização contínua. ECG.' },
      { label: 'Anticoagulação imediata', text: 'Heparina não fraccionada (HNF) bólus IV imediato — NÃO esperar por confirmação imagiológica se suspeita clínica alta.' },
      { label: 'Diagnóstico', text: 'Angio-TC tórax urgente. Ecocardiograma se instável demais para TC.' },
      { label: 'Trombólise sistémica', text: 'Alteplase 100 mg IV em 2 h — 1.ª linha no TEP maciço se sem CI absoluta a trombolíticos.' },
      { label: 'Falha/CI à trombólise', text: 'Trombectomia cirúrgica ou trombectomia por cateter (centro especializado).' },
    ],
    drugs: [
      { name: 'HNF (Heparina não fraccionada)', dose: '80 UI/kg IV bólus (máx. 5000 UI)', freq: 'Perfusão 18 UI/kg/h; ajustar por aPTT', note: 'Anticoagulação imediata' },
      { name: 'Alteplase', dose: '100 mg IV em 2 h', freq: '1×', note: 'TEP maciço — CI: AVC recente, cirurgia major < 3 sem, hemorragia activa' },
      { name: 'Noradrenalina', dose: '0,1–1 mcg/kg/min IV', freq: 'Titular para PAS ≥ 90', note: 'Suporte hemodinâmico' },
    ],
    notes: [
      'TEP sub-maciço (VD disfunção sem choque): anticoagulação; trombólise caso a caso',
      'Contraindicações absolutas à trombólise: AVC hemorrágico prévio, AVC isquémico < 3 meses, neoplasia intracraniana, hemorragia activa',
      'Após trombólise: não iniciar HBPM nas primeiras 2–3 h; reiniciar HNF quando aPTT < 80 s',
    ]
  },

  // ── Fibrilhação Auricular com RVR ─────────────────────────────────────────
  arritmia_fa: {
    name: 'Fibrilhação Auricular — RVR',
    category: 'Cardiologia',
    color: 'orange',
    criteria: [
      'FA com resposta ventricular rápida (FC > 100–110 bpm)',
      'ECG: ritmo irregularmente irregular, ausência de onda P',
      'Sintomas: palpitações, dispneia, síncope, angina',
    ],
    steps: [
      { label: 'Estabilidade hemodinâmica', text: 'Se instável (hipotensão, angina, IC aguda, pré-síncope): cardioversão elétrica sincronizada IMEDIATA sob sedação.' },
      { label: 'Controlo de frequência', text: 'Alvo FC < 100 bpm. 1.ª linha: metoprolol IV ou diltiazem IV (evitar se FEVE < 40%). Em ICC sistólica: digoxina ou amiodarona.' },
      { label: 'Anticoagulação', text: 'Iniciar NOAC ou heparina. Se FA ≥ 48 h ou duração desconhecida: ETE antes de cardioversão electiva (ou anticoagular 3 semanas primeiro).' },
      { label: 'Controlo de ritmo', text: 'FA < 48 h (ou pós-ETE negativo): cardioversão farmacológica (amiodarona IV) ou elétrica sincronizada.' },
      { label: 'Causa subjacente', text: 'Tratar: hipertiroidismo, ICC, pneumonia, TEP, isquemia, abuso de álcool, hipocaliemia.' },
    ],
    drugs: [
      { name: 'Metoprolol', dose: '2,5–5 mg IV lento (> 2 min)', freq: 'Repetir q5 min (máx. 15 mg)', note: 'Controlo freq. 1.ª linha' },
      { name: 'Diltiazem', dose: '0,25 mg/kg IV em 2 min (≈ 15–25 mg)', freq: 'Perfusão 5–15 mg/h se necessário', note: 'Evitar se FEVE < 40%' },
      { name: 'Amiodarona', dose: '150 mg IV em 10 min', freq: 'Perfusão 1 mg/min × 6 h, depois 0,5 mg/min', note: 'Cardioversão farmacológica / ICC' },
      { name: 'Digoxina', dose: '0,5 mg IV (0,25 mg q6h × 2 doses adicionais)', freq: 'Manutenção 0,125–0,25 mg/dia', note: 'ICC com FEVE reduzida' },
      { name: 'Cardioversão elétrica', dose: '120–200 J bifásico sincronizado', freq: 'Instável ou após sedação electiva', note: 'Sedar previamente' },
    ],
    notes: [
      'FA paroxística < 48 h em doente sem cardiopatia estrutural: pode cardioverter sem ETE',
      'FA valvular (estenose mitral reumatismal, válvula prostética): varfarina — NOAC contraindicado',
      'WPW + FA: NÃO usar bloqueadores do nó AV (digoxina, verapamil, diltiazem) — risco FV. Usar amiodarona ou cardioversão elétrica',
      'Calcular CHA₂DS₂-VASc e HAS-BLED para decisão de anticoagulação crónica',
    ]
  },

  // ── Taquicardia Ventricular ───────────────────────────────────────────────
  tv: {
    name: 'Taquicardia Ventricular',
    category: 'Cardiologia',
    color: 'red',
    criteria: [
      'FC > 100 bpm com QRS largo (> 120 ms) em ECG de 12 derivações',
      'TV sustentada: ≥ 30 s ou hemodinamicamente instável',
      'TV monomórfica (cardiopatia estrutural) ou polimórfica (Torsades de Pointes)',
    ],
    steps: [
      { label: 'Pulso?', text: 'Sem pulso → PCR / ACLS (FV/TV sem pulso). Com pulso → avaliar estabilidade.' },
      { label: 'Instável com pulso', text: 'Cardioversão elétrica sincronizada imediata 100–200 J bifásico, sob sedação.' },
      { label: 'TV estável monomórfica', text: 'Amiodarona IV 150 mg em 10 min → perfusão 1 mg/min. Alternativa: procainamida IV ou cardioversão elétrica.' },
      { label: 'Torsades de Pointes', text: 'MgSO₄ 2 g IV em 1–2 min. Suspender fármacos que prolongam QT. Corrigir hipocaliemia (K⁺ alvo > 4,0 mEq/L). Pacing se bradicardia subjacente.' },
      { label: 'Causa e prevenção', text: 'ECG 12D, ecocardiograma, electrólitos, coronariografia se SCA. Considerar DAI após estabilização.' },
    ],
    drugs: [
      { name: 'Cardioversão elétrica sincronizada', dose: '100–200 J bifásico', freq: 'TV com pulso instável', note: 'Sedação prévia obrigatória' },
      { name: 'Amiodarona', dose: '150 mg IV em 10 min', freq: 'Perfusão 1 mg/min × 6 h, depois 0,5 mg/min', note: 'TV monomórfica estável' },
      { name: 'MgSO₄ 20%', dose: '2 g IV (10 mL) em 1–2 min', freq: 'Pode repetir; perfusão 1–2 g/h se recorrência', note: 'Torsades de Pointes' },
      { name: 'Lidocaína', dose: '1–1,5 mg/kg IV bólus', freq: 'Perfusão 1–4 mg/min manutenção', note: 'Alternativa TV pós-IAM' },
    ],
    notes: [
      'Torsades: QTc > 500 ms → alto risco. Causas: hipocaliemia, hipomagnesemia, fármacos.',
      'QT-prolongers comuns: quinolonos, macrólidos, antifúngicos azóis, antipsicóticos, metadona, ondansetron',
      'TV recorrente refractária: overdrive pacing, sedação profunda (isoflurano), ablação por cateter',
      'TV em coração estruturalmente normal: considerar síndrome Brugada, QT longo congénito',
    ]
  },

  // ── AVC Isquémico ─────────────────────────────────────────────────────────
  avc_isquemico: {
    name: 'AVC Isquémico Agudo',
    category: 'Neurologia',
    color: 'red',
    criteria: [
      'Défice neurológico focal de início súbito',
      'TC crânio: excluir hemorragia (isodensa nas primeiras horas)',
      'Janela terapêutica: trombólise ≤ 4,5 h; trombectomia ≤ 24 h (casos seleccionados)',
    ],
    steps: [
      { label: 'ABC + Glicemia', text: 'Via aérea, SpO₂ ≥ 94%. Acesso IV × 2. Glicemia imediata (tratar hipoglicemia < 60 mg/dL — pode mimetizar AVC).' },
      { label: 'TC crânio urgente', text: 'TC crânio sem contraste. Excluir hemorragia. Avaliar ASPECTS.' },
      { label: 'Critérios trombólise (rt-PA)', text: 'Janela ≤ 4,5 h, PA ≤ 185/110, sem hemorragia, sem cirurgia major < 3 semanas. Alteplase 0,9 mg/kg (máx. 90 mg): 10% em bólus, resto em 60 min.' },
      { label: 'Trombectomia mecânica', text: 'Oclusão de grande vaso + NIHSS ≥ 6 + janela ≤ 24 h (seleccionado): activar neurorradiologia de intervenção.' },
      { label: 'Controlo PA', text: 'Sem trombólise: não tratar PA < 220/120. Com trombólise: PA ≤ 180/105 durante e após 24 h.' },
      { label: 'Antitrombótico', text: 'AAS 300 mg PO/NG (após TC excluir hemorragia). Após 24 h de trombólise, trocar para antiagregação mantida.' },
    ],
    drugs: [
      { name: 'Alteplase (rt-PA)', dose: '0,9 mg/kg IV (máx. 90 mg): 10% bólus, 90% em 60 min', freq: '1×', note: 'Trombólise IV — janela ≤ 4,5 h' },
      { name: 'AAS', dose: '300 mg PO ou NG', freq: '1× (após TC excluir hemorragia)', note: 'Antiagregação aguda' },
      { name: 'Labetalol', dose: '10–20 mg IV em 2 min', freq: 'Se PA > 220/120 (sem trombólise) ou > 185/110 (com trombólise)', note: 'Controlo de PA' },
      { name: 'Glicose 30%', dose: '60 mL IV', freq: 'Se glicemia < 60 mg/dL', note: 'Corrigir hipoglicemia' },
    ],
    notes: [
      'NIHSS: 0–4 minor, 5–15 moderado, >15 grave. Calcular sempre.',
      'ASPECTS < 7 em TC ou DWI → prognóstico pior após trombólise/trombectomia',
      'Após 24 h: estatina de alta dose (atorvastatina 80 mg), antiagregação, controlo PA, glicemia, febre',
      'FA detectada: anticoagular após 4–14 dias conforme extensão do enfarte',
    ]
  },

  // ── AVC Hemorrágico ───────────────────────────────────────────────────────
  avc_hemorragico: {
    name: 'AVC Hemorrágico (HIC / HSA)',
    category: 'Neurologia',
    color: 'red',
    criteria: [
      'HIC: défice focal + TC com hiperdensidade parenquimatosa',
      'HSA: cefaleia "em trovão" (pior da vida) ± rigidez da nuca, fotofobia',
      'TC negativa em HSA: punção lombar (xantocromia) ou TC-angio',
    ],
    steps: [
      { label: 'Via aérea', text: 'Proteger via aérea se GCS ≤ 8. Evitar hipóxia (SpO₂ ≥ 94%) e hipercapnia (CO₂ 35–40).' },
      { label: 'Controlo da PA (HIC)', text: 'PAS 150–220 mmHg: reduzir para < 140 mmHg (alvo INTERACT2). Labetalol IV ou nicardipina IV. Evitar nitroprussiato (↑ PIC).' },
      { label: 'Reverter anticoagulação', text: 'Varfarina: vitamina K 10 mg IV + CCP 25–50 UI/kg. Dabigatrano: idarucizumab 5 g IV. Rivaroxabano/apixabano: andexanet alfa.' },
      { label: 'Electrólitos e glicemia', text: 'Evitar hiponatremia (↑ edema). Glicemia alvo 140–180 mg/dL. Corrigir febre (paracetamol).' },
      { label: 'HSA específico', text: 'Nimodipina 60 mg PO q4h × 21 dias (reduz vasoespasmo). Arteriografia (aneurisma?) → neurocirurgia / coiling urgente.' },
      { label: 'Neurocirurgia', text: 'HIC cerebelar ≥ 3 cm, hidrocefalia, HIC superficial acessível: avaliar evacuação. HSA com aneurisma: clipagem ou coiling urgente.' },
    ],
    drugs: [
      { name: 'Labetalol', dose: '10–20 mg IV em 2 min', freq: 'Repetir q10 min; ou 2 mg/min perfusão', note: 'Controlo de PA na HIC' },
      { name: 'Nicardipina', dose: '5 mg/h IV perfusão', freq: 'Titular até 15 mg/h', note: 'Alternativa ao labetalol' },
      { name: 'CCP (Octaplex / Beriplex)', dose: '25–50 UI/kg IV', freq: '1×', note: 'Reverter varfarina urgente' },
      { name: 'Vitamina K', dose: '10 mg IV lento', freq: '1× (efeito em 4–6 h)', note: 'Associar ao CCP' },
      { name: 'Idarucizumab (Praxbind)', dose: '5 g IV (2 × 2,5 g em 15 min)', freq: '1×', note: 'Reverter dabigatrano' },
      { name: 'Nimodipina', dose: '60 mg PO q4h', freq: '21 dias contínuos', note: 'HSA — reduz vasoespasmo' },
      { name: 'Manitol 20%', dose: '0,5–1 g/kg IV em 15–30 min', freq: 'q4–6h se PIC elevada', note: 'HIC com herniação iminente' },
    ],
    notes: [
      'HIC hipertensiva: localizações típicas — gânglios da base (putamen), tálamo, cerebelo, tronco cerebral',
      'HSA: WFNS graus 1–2 (GCS 14–15) vs 3–5 (GCS < 14) — grau impacta na estratégia cirúrgica',
      'Evitar heparina nas primeiras 24–48 h (equilíbrio ressangramento vs TEP)',
      'TC-angio se etiologia vascular suspeita (aneurisma, MAV, cavernoma, trombose seio venoso)',
    ]
  },

  // ── Status Epilepticus ────────────────────────────────────────────────────
  status_epilepticus: {
    name: 'Status Epilepticus',
    category: 'Neurologia',
    color: 'red',
    criteria: [
      'Crise convulsiva ≥ 5 min (convulsivo) ou ≥ 10 min (não convulsivo)',
      'Duas ou mais crises sem recuperação completa da consciência',
      'Status refractário: sem resposta após 2 fármacos de 1.ª / 2.ª linha',
    ],
    steps: [
      { label: '0–5 min', text: 'Posição lateral de segurança. Afastar perigo. Medir glicemia. O₂ nasal. Notar hora de início.' },
      { label: '5–20 min — 1.ª linha', text: 'Benzodiazepina IV: lorazepam 0,1 mg/kg IV (máx. 4 mg). Alternativa IM: midazolam 10 mg.' },
      { label: '20–40 min — 2.ª linha', text: 'Se sem resposta: fenitoína 20 mg/kg IV a 50 mg/min (monitorizar ECG); ou valproato 40 mg/kg IV em 10 min; ou levetiracetam 60 mg/kg IV em 15 min.' },
      { label: '> 40 min — Refractário', text: 'UCI + anestesia geral: propofol 2 mg/kg bólus + 5–10 mg/kg/h perfusão; ou midazolam 0,2 mg/kg + 0,1–0,5 mg/kg/h; ou tiopental. EEG contínuo.' },
      { label: 'Causa', text: 'Glicemia, Na⁺, Ca²⁺, Mg²⁺, ureia. TC crânio. LCR se meningite suspeita. Fármacos / intoxicação.' },
    ],
    drugs: [
      { name: 'Lorazepam', dose: '0,1 mg/kg IV (máx. 4 mg)', freq: 'Pode repetir 1× em 5 min', note: '1.ª linha IV' },
      { name: 'Midazolam', dose: '10 mg IM (se > 40 kg); 5 mg se 13–40 kg', freq: 'Alternativa à BZD IV', note: '1.ª linha IM' },
      { name: 'Valproato de sódio', dose: '40 mg/kg IV em 10 min (máx. 3 g)', freq: '2.ª linha', note: 'Preferido se etiologia desconhecida' },
      { name: 'Levetiracetam', dose: '60 mg/kg IV em 15 min (máx. 4,5 g)', freq: '2.ª linha', note: 'Boa tolerabilidade, sem interacções' },
      { name: 'Propofol', dose: '2 mg/kg IV bólus', freq: 'Perfusão 5–10 mg/kg/h (status refractário)', note: 'UCI — monitorizar PRIS' },
    ],
    notes: [
      'Glicose IV imediata se hipoglicemia + tiamina 100 mg IV antes da glicose (alcoolismo)',
      'Meningite bacteriana suspeita: iniciar ceftriaxone 2 g IV + dexametasona 10 mg IV SEM esperar TC/LCR',
      'Fenitoína: injectar em solução fisiológica (precipita em dextrose); monitorizar hipotensão',
      'EEG contínuo obrigatório no status refractário (detectar status não convulsivo oculto)',
    ]
  },

  // ── CAD ───────────────────────────────────────────────────────────────────
  cad: {
    name: 'Cetoacidose Diabética (CAD)',
    category: 'Metabólica',
    color: 'orange',
    criteria: [
      'Glicemia > 250 mg/dL + pH < 7,3 + bicarbonato < 18 mEq/L + cetonemia/cetonúria',
      'Sintomas: poliúria, polidipsia, dor abdominal, vómitos, respiração de Kussmaul',
    ],
    steps: [
      { label: 'Fluidos', text: 'NaCl 0,9%: 1 L na 1.ª hora, depois 500 mL/h × 4 h, depois 250 mL/h. Ajustar conforme estado hídrico.' },
      { label: 'Insulina', text: 'Iniciar insulina regular IV 0,1 UI/kg/h (NÃO fazer bólus). Quando glicemia < 250 mg/dL: reduzir para 0,05 UI/kg/h + adicionar dextrose 5% ao soro.' },
      { label: 'Potássio', text: 'K⁺ sérico < 3,5: NÃO iniciar insulina — repor K⁺ primeiro (40 mEq/h IV). K⁺ 3,5–5,5: repor 20–40 mEq/h. K⁺ > 5,5: não repor.' },
      { label: 'Bicarbonato', text: 'Só se pH < 6,9: NaHCO₃ 100 mEq em 2 h. Uso controverso acima disto.' },
      { label: 'Monitorização', text: 'Glicemia horária. Electrólitos e gasimetria q2h. Critérios resolução: glicemia < 250, pH > 7,3, HCO₃⁻ > 18, cetones negativas.' },
    ],
    drugs: [
      { name: 'NaCl 0,9%', dose: '1000 mL em 1 h (depois 500 mL/h × 4 h)', freq: 'Ajustar conforme clínica', note: 'Ressuscitação hídrica 1.ª' },
      { name: 'Insulina regular', dose: '0,1 UI/kg/h IV perfusão contínua', freq: 'Sem bólus inicial', note: 'Não iniciar se K⁺ < 3,5' },
      { name: 'KCl', dose: '20–40 mEq/h IV (em NaCl 0,45% ou 0,9%)', freq: 'Conforme K⁺ sérico', note: 'Hipocaliemia grave → repor antes de insulina' },
      { name: 'Glicose 5%', dose: 'Adicionar ao soro quando glicemia < 250', freq: 'Manter insulina IV até resolução de cetose', note: 'Previne hipoglicemia' },
    ],
    notes: [
      'Causa desencadeante: infecção (30–40%), não adesão à insulina, AVC, SCA, fármacos (corticoides, SGLT2i)',
      'CAH (cetoacidose hiperosmolar): hiperglicemia extrema (> 600) sem acidose significativa — rehidratação mais lenta',
      'Transição para insulina SC: iniciar insulina SC 1–2 h antes de parar perfusão IV',
      'SGLT2i (empagliflozina, dapagliflozina): pode causar CAD euglicémica',
    ]
  },

  // ── Hipercaliemia ────────────────────────────────────────────────────────
  hipercaliemia: {
    name: 'Hipercaliemia Grave',
    category: 'Metabólica',
    color: 'red',
    criteria: [
      'K⁺ sérico > 6,5 mEq/L OU qualquer valor com alterações ECG',
      'ECG: ondas T apiculadas → alargamento QRS → sine wave → assistolia',
      'Risco imediato de arritmia fatal',
    ],
    steps: [
      { label: 'Proteger o coração', text: 'Gluconato de cálcio 10% 10–20 mL IV em 2–3 min (efeito imediato, 30–60 min). Repetir se ECG sem melhoria em 5 min.' },
      { label: 'Redistribuir K⁺', text: 'Insulina regular 10 UI IV + glicose 50% 50 mL. Salbutamol nebulizado 10–20 mg. Bicarbonato 50 mEq IV se acidose metabólica.' },
      { label: 'Eliminar K⁺', text: 'Furosemida 40–80 mg IV (se diurese preservada). Resinas permutadoras de iões: patiromer ou ziconotida (PO). Hemodiálise se falência renal grave ou instabilidade.' },
      { label: 'Monitorização ECG', text: 'Monitorização contínua até K⁺ < 5,5 mEq/L e ECG normalizado.' },
      { label: 'Causa', text: 'Falência renal, AECAs, AINEs, heparina, acidose, hemólise, rabdomiólise, Addison.' },
    ],
    drugs: [
      { name: 'Gluconato de cálcio 10%', dose: '10–20 mL IV em 2–3 min', freq: 'Repetir q5 min se ECG sem melhoria (máx. 3×)', note: 'Estabilização imediata da membrana' },
      { name: 'Insulina regular + Glicose', dose: '10 UI IV + 50 mL Glicose 50%', freq: '1× (efeito em 20–30 min, duração 4–6 h)', note: 'Redistribuição K⁺ para célula' },
      { name: 'Salbutamol', dose: '10–20 mg nebulizado', freq: '1× (efeito em 30 min)', note: 'Redistribuição — usar alto dose' },
      { name: 'Furosemida', dose: '40–80 mg IV', freq: '1×', note: 'Eliminação renal — só se diurese preservada' },
    ],
    notes: [
      'Pseudohipercaliemia: hemólise na colheita. Repetir amostra antes de tratar se assintomático e ECG normal.',
      'Cálcio não baixa o K⁺ sérico — apenas protege o miocárdio temporariamente',
      'Resinas (patiromer): início de acção 7 h — não usar em emergência aguda isoladamente',
      'Hemodiálise: indicação se K⁺ > 6,5 com ECG alterado, falência renal ou refractário',
    ]
  },

  // ── Hipoglicemia grave ────────────────────────────────────────────────────
  hipoglicemia_grave: {
    name: 'Hipoglicemia Grave',
    category: 'Metabólica',
    color: 'orange',
    criteria: [
      'Glicemia < 54 mg/dL (3 mmol/L) com sintomas',
      'Hipoglicemia grave: requer assistência de terceiros',
      'Neuroglicopénia: confusão, convulsão, coma',
    ],
    steps: [
      { label: 'Consciente + capaz de deglutir', text: '15–20 g de glicose oral (3–4 comprimidos de glicose, 150 mL sumo laranja, 4 pacotes de açúcar). Repetir se glicemia < 70 em 15 min.' },
      { label: 'Inconsciente / convulsão', text: 'Glicose 30% 60 mL IV (ou Glicose 50% 30 mL). Repetir se sem resposta em 10 min.' },
      { label: 'Sem acesso IV', text: 'Glucagon 1 mg IM ou SC. Efeito em 10–15 min (ineficaz em hepatopatia grave, desnutrição severa).' },
      { label: 'Após recuperação', text: 'Refeição com hidratos de carbono complexos. Glicemia q1h × 4 h. Investigar causa.' },
      { label: 'Sulfonilureias / glinidas', text: 'Hipoglicemia prolongada: perfusão contínua de Glicose 10% + octreotido 50 mcg SC q8h (reduz libertação insulina).' },
    ],
    drugs: [
      { name: 'Glicose 30%', dose: '60 mL IV lento (18 g de glicose)', freq: 'Repetir se glicemia < 70 após 10 min', note: 'Via IV — resposta imediata' },
      { name: 'Glucagon', dose: '1 mg IM ou SC', freq: '1× (pode repetir 1×)', note: 'Se sem acesso IV' },
      { name: 'Glicose 10%', dose: 'Perfusão 100 mL/h', freq: 'Manter após estabilização aguda', note: 'Hipoglicemia por sulfonilureias' },
      { name: 'Octreotido', dose: '50 mcg SC q8h', freq: 'Por 24–48 h', note: 'Hipoglicemia por sulfonilureias refractária' },
    ],
    notes: [
      'Tiamina 100 mg IV antes de glicose IV se alcoolismo suspeito (prevenir encefalopatia de Wernicke)',
      'Sulfonilureias (glibenclamida, glimepirida): hipoglicemia prolongada, internalizar 24 h mínimo',
      'Insulina: investigar overdose, insulinoma (jejum prolongado), autoimune (anti-insulina)',
      'Após hipoglicemia grave: não reiniciar sulfonilureia de longa duração sem reavaliação',
    ]
  },

  // ── Sépsis Bundle ────────────────────────────────────────────────────────
  sepsis_bundle: {
    name: 'Bundle de Sépsis (Sepsis-3)',
    category: 'Sépsis',
    color: 'orange',
    criteria: [
      'Infecção suspeita + disfunção orgânica aguda (SOFA ≥ 2 pontos)',
      'Choque séptico: sépsis + vasopressores + lactato > 2 mmol/L apesar de ressuscitação adequada',
      'qSOFA ≥ 2: triagem rápida fora da UCI',
    ],
    steps: [
      { label: '1 hora (hora de ouro)', text: 'Hemoculturas × 2 (antes de ATB). Lactato sérico. ATB de largo espectro IV. Cristaloides 30 mL/kg se hipotensão ou lactato > 4.' },
      { label: 'Antibiótico', text: 'Iniciar empírico em < 1 h: piperacilina-tazobactam ou meropenem (sepsis grave/choque). Adequar a foco e resistências locais. Desescalada em 48–72 h.' },
      { label: 'Ressuscitação hídrica', text: 'Cristaloides 30 mL/kg nas primeiras 3 h. Reavaliação frequente (PAM, diurese, lactatemia). Evitar sobrecarga.' },
      { label: 'Vasopressores', text: 'Se PAM < 65 após ressuscitação: noradrenalina IV. Alvo PAM ≥ 65 mmHg. Adicionar vasopressina 0,03 UI/min se dose alta de NA.' },
      { label: 'Foco', text: 'Controlar foco: drenagem de abcesso, remoção de cateter infectado, cirurgia urgente se indicado.' },
    ],
    drugs: [
      { name: 'Piperacilina-Tazobactam', dose: '4,5 g IV q6h (ou q8h)',    freq: 'Em 30 min', note: 'Sepsis grave 1.ª linha (sem ESBL suspeito)' },
      { name: 'Meropenem', dose: '1–2 g IV q8h',                           freq: 'Em 30 min (ou infusão prolongada 3 h)', note: 'Choque séptico / ESBL / Pseudomonas' },
      { name: 'NaCl 0,9% ou Lactato de Ringer', dose: '30 mL/kg IV rápido',freq: 'Nas primeiras 3 h', note: 'Ressuscitação hídrica' },
      { name: 'Noradrenalina', dose: '0,1–1 mcg/kg/min IV perfusão',       freq: 'Titular para PAM ≥ 65', note: 'Vasopressor 1.ª linha' },
      { name: 'Hidrocortisona', dose: '200 mg/dia IV (50 mg q6h ou perfusão)', freq: 'Se choque refractário a NA > 0,25 mcg/kg/min', note: 'Choque séptico refractário' },
    ],
    notes: [
      'Lactato > 4 mmol/L: mortalidade > 40%. Repetir lactato em 2 h após ressuscitação.',
      'Hemocultura antes do ATB NÃO deve atrasar o ATB > 45 min',
      'Corticoides: não reduzem mortalidade mas encurtam duração de choque — usar se NA > 0,25 mcg/kg/min',
      'Profilaxia TVP (HBPM), controlo glicemia (140–180), suporte nutricional precoce',
    ]
  },

  // ── Broncoespasmo grave ───────────────────────────────────────────────────
  broncoespasmo: {
    name: 'Broncoespasmo Grave / Asma Aguda',
    category: 'Respiratório',
    color: 'orange',
    criteria: [
      'Asma quase fatal: PaCO₂ normal ou elevado, alteração consciência, exaustão',
      'Asma grave: FR > 25, FC > 110, PFE < 50%, SpO₂ < 92%',
      'DPOC exacerbação grave: SpO₂ < 88%, acidose respiratória',
    ],
    steps: [
      { label: 'O₂', text: 'Asma: O₂ para SpO₂ 94–98%. DPOC: SpO₂ 88–92% (risco hipercapnia). VNI (BiPAP) se acidose ou falência respiratória.' },
      { label: 'Broncodilatador', text: 'Salbutamol 5 mg nebulizado q20 min × 3 (ou inalação contínua). Ipratrópio 0,5 mg nebulizado q6h.' },
      { label: 'Corticoides sistémicos', text: 'Prednisolona 40–50 mg PO ou Metilprednisolona 80–125 mg IV. Iniciar nas primeiras 30 min.' },
      { label: 'Sulfato de Magnésio', text: 'MgSO₄ 2 g IV em 20 min — em doente que não responde a broncodilatadores nas primeiras 60 min.' },
      { label: 'Ventilação mecânica', text: 'Asma quase fatal / exaustão: intubação orotraqueal (cuidado com hipotensão pós-intubação). Volume corrente baixo (6–8 mL/kg), tempo expiratório longo.' },
    ],
    drugs: [
      { name: 'Salbutamol', dose: '5 mg nebulizado', freq: 'q20 min × 3; depois q2–4 h', note: 'β₂-agonista — 1.ª linha' },
      { name: 'Ipratrópio', dose: '0,5 mg nebulizado', freq: 'q6–8 h (associar ao salbutamol)', note: 'Anticolinérgico' },
      { name: 'Metilprednisolona', dose: '80–125 mg IV', freq: 'q6–8 h nas primeiras 24 h', note: 'Sistémico 1.ª linha grave' },
      { name: 'MgSO₄ 20%', dose: '2 g IV em 20 min', freq: '1×', note: 'Refractário a broncodilatadores' },
      { name: 'Adrenalina', dose: '0,5 mg IM (coxa)', freq: 'Broncoespasmo grave com componente alérgico', note: 'Se anafilaxia associada' },
    ],
    notes: [
      'Evitar sedação sem via aérea controlada',
      'DPOC em exacerbação: target SpO₂ 88–92% (risco hipercapnia)',
      'Heliox (70% He/30% O₂) pode reduzir resistência das vias aéreas — uso especializado',
    ]
  },

  // ── Pneumotórax hipertensivo ──────────────────────────────────────────────
  pneumotorax: {
    name: 'Pneumotórax Hipertensivo',
    category: 'Respiratório',
    color: 'red',
    criteria: [
      'Diagnóstico CLÍNICO — não esperar por Rx em emergência',
      'Hipotensão + dispneia grave + desvio traqueal (tardio)',
      'Ausência unilateral de sons respiratórios + distensão venosa jugular',
    ],
    steps: [
      { label: 'Descompressão imediata', text: 'Agulha de grande calibre (14 G) no 2.º espaço intercostal na linha medioclavicular — imediatamente. Saída de ar confirma diagnóstico.' },
      { label: 'Drenagem definitiva', text: 'Toracostomia com dreno (5.º EIC, linha axilar anterior) — após descompressão com agulha ou como tratamento primário em contexto hospitalar.' },
      { label: 'Suporte', text: 'O₂ 100% (acelera reabsorção). Acesso IV. Analgesia pós-drenagem. Rx tórax após drenagem.' },
    ],
    drugs: [
      { name: 'O₂ 100%', dose: 'Alto débito (≥ 10 L/min)', freq: 'Contínuo', note: 'Acelera reabsorção de ar pleural' },
      { name: 'Morfina', dose: '2–5 mg IV lento', freq: 'Após drenagem', note: 'Analgesia' },
    ],
    notes: [
      'Pneumotórax simples < 2 cm em doente estável: observação + O₂',
      'Em doente ventilado: qualquer pneumotórax → drenagem imediata',
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
      'Exposição provável a alergénio (fármaco, alimento, látex, veneno)',
    ],
    steps: [
      { label: 'ADRENALINA — imediata', text: 'Adrenalina 0,3–0,5 mg IM (coxa anterolateral, vasto lateral). NUNCA IV em bólus fora de UCI.' },
      { label: 'Posição', text: 'Deitado com pernas elevadas (exceto dispneia → sentado). Evitar ortostase súbita.' },
      { label: 'O₂', text: 'O₂ alto débito (10–15 L/min). Via aérea avançada se edema laríngeo.' },
      { label: 'Fluidos', text: 'Acesso IV × 2 calibre grosso. Cristaloides 1–2 L IV rápido se hipotensão.' },
      { label: 'Repetir adrenalina', text: 'Se sem melhoria em 5–15 min: repetir IM 0,3–0,5 mg. Máx. 3 doses.' },
      { label: 'Adjuvantes', text: 'Clorfeniramina 10 mg IV + Metilprednisolona 125 mg IV (NÃO substituem adrenalina). Salbutamol 5 mg neb se broncoespasmo.' },
    ],
    drugs: [
      { name: 'Adrenalina', dose: '0,3–0,5 mg IM (coxa)', freq: 'Repetir q5–15 min (máx. 3×)', note: '1.ª linha — IMEDIATA' },
      { name: 'NaCl 0,9%', dose: '1–2 L IV rápido', freq: 'Titular conforme PA', note: 'Hipotensão / choque' },
      { name: 'Metilprednisolona', dose: '125 mg IV', freq: '1×', note: 'Previne reacção bifásica' },
      { name: 'Clorfeniramina', dose: '10 mg IV lento', freq: '1×', note: 'Anti-H1 — adjuvante' },
      { name: 'Salbutamol', dose: '5 mg nebulizado', freq: 'q20 min', note: 'Se broncoespasmo refractário' },
      { name: 'Adrenalina IV perfusão', dose: '0,1–1 mcg/kg/min', freq: 'Contínua (UCI)', note: 'Choque refractário' },
    ],
    notes: [
      'Adrenalina IM é SEMPRE o 1.º fármaco — não atrasar para procurar acesso IV',
      'Anti-histamínicos e corticoides NÃO tratam hipotensão ou broncoespasmo agudo',
      'Doentes com história de anafilaxia: prescrever auto-injector de adrenalina (EpiPen)',
      'Triptase sérica: colher 0–1 h, 1–2 h e 24 h após — útil para diagnóstico diferencial',
    ]
  },

  // ── Intoxicação por Paracetamol ───────────────────────────────────────────
  intox_paracetamol: {
    name: 'Intoxicação por Paracetamol',
    category: 'Intoxicações',
    color: 'orange',
    criteria: [
      'Ingestão > 150 mg/kg ou > 7,5 g em adulto (ou menor dose em factores de risco)',
      'Paracetamolemia ≥ 4 h após ingestão — interpretar no nomograma de Rumack-Matthew',
      'Fases: I (0–24h náuseas/vómitos) → II (24–72h hepatite) → III (72–96h falência hepática)',
    ],
    steps: [
      { label: 'Carvão activado', text: 'Carvão activado 50 g PO se ≤ 2 h desde ingestão e doente alerta/cooperante.' },
      { label: 'Doseamento', text: 'Paracetamolemia às 4 h mínimo após ingestão. Interpretar no nomograma.' },
      { label: 'N-acetilcisteína (NAC)', text: 'Iniciar se nível acima da linha de tratamento no nomograma, ou se ingestão > 150 mg/kg com nível indisponível. Protocolo 3 bolsas IV.' },
      { label: 'Monitorização', text: 'ALT, AST, INR, creatinina, glicemia às 12–24 h e a cada 24 h até resolução.' },
      { label: 'Falência hepática', text: "Critérios King's College para transplante: INR > 6,5; OU pH < 7,3 + creatinina > 3,4 + INR > 6,5 (em 24 h)." },
    ],
    drugs: [
      { name: 'N-acetilcisteína (NAC) — 1.ª bolsa', dose: '150 mg/kg em 200 mL SG5% em 1 h', freq: 'Dose de carga', note: 'Começar imediatamente' },
      { name: 'N-acetilcisteína (NAC) — 2.ª bolsa', dose: '50 mg/kg em 500 mL SG5% em 4 h', freq: 'A seguir à 1.ª', note: 'Pode causar reacção anafilactoide' },
      { name: 'N-acetilcisteína (NAC) — 3.ª bolsa', dose: '100 mg/kg em 1000 mL SG5% em 16 h', freq: 'A seguir à 2.ª', note: 'Avaliar reavaliação após 21 h' },
      { name: 'Carvão activado', dose: '50 g PO', freq: '1× se ≤ 2 h da ingestão', note: 'Descontaminação GI' },
    ],
    notes: [
      'NAC mais eficaz nas primeiras 8–10 h; eficaz até 24 h; pode ser útil mesmo mais tarde na falência hepática',
      'Toxicidade aumentada em: alcoolismo crónico, desnutrição, rifampicina, isoniazida',
      'CIAV Portugal: 808 250 143',
      'Paracetamolemia < 4 h: não interpretar — aguardar nível às 4 h',
    ]
  },

  // ── Intoxicação por Opioides / BZD ───────────────────────────────────────
  intox_opioides: {
    name: 'Intoxicação por Opioides / Benzodiazepinas',
    category: 'Intoxicações',
    color: 'red',
    criteria: [
      'Opioides: tríade — miose bilateral, depressão respiratória, alteração de consciência',
      'BZD: sedação, ataxia, amnésia — raramente depressão respiratória grave isolada',
      'Confirmar ingestão: história, embalagens, tóxico-urinário',
    ],
    steps: [
      { label: 'Via aérea / ventilação', text: 'Posição lateral de segurança se GCS > 8. Ventilação assistida se FR < 10 rpm ou SpO₂ < 90%.' },
      { label: 'Naloxona — opioides', text: 'Naloxona 0,4 mg IV (iniciar com 0,1 mg se dependente suspeito para evitar abstinência aguda). Repetir q2–3 min até FR > 12. Perfusão se recorrência.' },
      { label: 'Flumazenil — BZD', text: 'Flumazenil 0,2 mg IV em 30 s; repetir 0,1 mg q1 min (máx. 1 mg). CONTRAINDICADO: epilepsia, dependência de BZD, TCAs concomitantes, convulsões.' },
      { label: 'Carvão activado', text: 'Se ingestão oral ≤ 2 h e doente alerta e cooperante: carvão 50 g PO.' },
      { label: 'Monitorização', text: 'Observação mínima 4–6 h após última dose de antagonista (t½ naloxona < t½ opioides de longa duração — risco de re-sedação).' },
    ],
    drugs: [
      { name: 'Naloxona', dose: '0,4 mg IV (0,1 mg se dependente)', freq: 'Repetir q2–3 min; perfusão 2/3 da dose-resposta/h se recorrência', note: 't½ 30–90 min — vigiar re-sedação' },
      { name: 'Flumazenil', dose: '0,2 mg IV em 30 s', freq: 'Repetir 0,1 mg q1 min (máx. 1 mg)', note: 'BZD — CI absoluta em epilepsia / dependência' },
      { name: 'Carvão activado', dose: '50 g PO', freq: '1×', note: 'Só se alerta e ≤ 2 h' },
    ],
    notes: [
      't½ naloxona: 30–90 min; metadona: 24–36 h — risco muito elevado de re-sedação tardia',
      'Heroinómanos: naloxona precipita abstinência grave; usar 0,1 mg titulados, alvo FR > 12 e não despertar completo',
      'Overdose de metadona: internamento obrigatório ≥ 24 h',
      'CIAV Portugal: 808 250 143',
    ]
  },
}

// ─── Components ─────────────────────────────────────────────────────────────

const COLOR_MAP = {
  red:    { header: 'bg-red-600',    badge: 'bg-red-100 text-red-800'       },
  orange: { header: 'bg-orange-500', badge: 'bg-orange-100 text-orange-800' },
  yellow: { header: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800' },
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
    <div className="flex items-start gap-2 p-2.5 bg-white rounded-lg border border-gray-200">
      <div className="flex-1">
        <span className="font-semibold text-gray-800 text-sm">{drug.name}</span>
        <span className="ml-1 font-mono text-blue-700 text-sm">{drug.dose}</span>
        <div className="text-xs text-gray-500 mt-0.5">
          {drug.freq}
          {drug.note && <span className="text-gray-400"> — {drug.note}</span>}
        </div>
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
      <div className={`${c.header} text-white px-5 py-3 rounded-t-xl`}>
        <h2 className="text-lg font-bold">{em.name}</h2>
        <span className="text-xs opacity-80">{em.category}</span>
      </div>

      <div className="border border-t-0 border-gray-200 rounded-b-xl overflow-hidden">
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

        <div className="px-5 py-3 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Fármacos e Doses</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {em.drugs.map((d, i) => <DrugTag key={i} drug={d} />)}
          </div>
        </div>

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

export default function EmergencyPage({ activeId }) {
  const em = EMERGENCIES[activeId]

  if (!em) return (
    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
      Selecione um protocolo na barra lateral
    </div>
  )

  return (
    <div className="h-full overflow-y-auto p-6">
      <EmergencyDetail em={em} />
    </div>
  )
}
