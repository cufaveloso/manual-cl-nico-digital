import React, { useState } from 'react'

// ─── Calculadores ────────────────────────────────────────────────────────────

const CALC_GROUPS = [
  { id: 'dose',   label: 'Dose',         icon: '💊', items: ['dose_weight', 'infusion_rate', 'pediatric_dose'] },
  { id: 'renal',  label: 'Renal',        icon: '💧', items: ['cockcroft', 'renal_adjust'] },
  { id: 'electro',label: 'Electrólitos', icon: '🧪', items: ['na_correction', 'ca_correction', 'osmolarity'] },
  { id: 'other',  label: 'Outros',       icon: '📐', items: ['bmi', 'ibw', 'map_calc'] },
]

// ─── Componente genérico de resultado ────────────────────────────────────────
function Result({ label, value, unit, note, color = 'blue' }) {
  const colors = {
    blue:   'bg-blue-50 border-blue-300 text-blue-800',
    green:  'bg-green-50 border-green-300 text-green-800',
    yellow: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    red:    'bg-red-50 border-red-300 text-red-800',
  }
  return (
    <div className={`rounded-xl border-2 p-4 ${colors[color]}`}>
      <div className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value} <span className="text-base font-normal">{unit}</span></div>
      {note && <div className="text-sm mt-1 opacity-80">{note}</div>}
    </div>
  )
}

function Field({ label, value, onChange, type = 'number', min, step = 0.1, placeholder, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children ? children : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          min={min}
          step={step}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        />
      )}
    </div>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// ─── Calculadores individuais ─────────────────────────────────────────────────

function DoseByWeight() {
  const [weight, setWeight] = useState('')
  const [dosePerKg, setDosePerKg] = useState('')
  const [freq, setFreq] = useState('1')
  const [unit, setUnit] = useState('mg')

  const total = weight && dosePerKg ? (parseFloat(weight) * parseFloat(dosePerKg)).toFixed(2) : null
  const perDay = total ? (parseFloat(total) * parseInt(freq)).toFixed(2) : null
  const color = total ? (parseFloat(total) > 2000 ? 'yellow' : 'green') : 'blue'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Peso do doente (kg)" value={weight} onChange={setWeight} min={1} step={0.1} placeholder="ex: 70" />
        <Field label={`Dose (${unit}/kg)`} value={dosePerKg} onChange={setDosePerKg} min={0} step={0.01} placeholder="ex: 15" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Unidade" value={unit} onChange={setUnit} options={[
          { value: 'mg', label: 'mg' }, { value: 'mcg', label: 'mcg (µg)' },
          { value: 'UI', label: 'UI' }, { value: 'mL', label: 'mL' },
        ]} />
        <Select label="Frequência (tomas/dia)" value={freq} onChange={setFreq} options={[
          { value: '1', label: '1 × ao dia' }, { value: '2', label: '2 × ao dia (12/12h)' },
          { value: '3', label: '3 × ao dia (8/8h)' }, { value: '4', label: '4 × ao dia (6/6h)' },
          { value: '6', label: '6 × ao dia (4/4h)' },
        ]} />
      </div>
      {total && (
        <div className="grid grid-cols-2 gap-3">
          <Result label="Dose por toma" value={total} unit={unit} color={color} />
          <Result label="Dose total diária" value={perDay} unit={`${unit}/dia`} color={color} />
        </div>
      )}
    </div>
  )
}

function InfusionRate() {
  const [totalDose, setTotalDose] = useState('')
  const [concentration, setConcentration] = useState('')
  const [duration, setDuration] = useState('')
  const [unit, setUnit] = useState('mg')

  const concNum  = parseFloat(concentration) // mg/mL
  const doseNum  = parseFloat(totalDose)
  const durNum   = parseFloat(duration)

  const volume   = concNum && doseNum ? (doseNum / concNum).toFixed(1) : null
  const rate     = volume && durNum ? (parseFloat(volume) / durNum).toFixed(1) : null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label={`Dose total (${unit})`} value={totalDose} onChange={setTotalDose} min={0} placeholder="ex: 500" />
        <Field label={`Concentração (${unit}/mL)`} value={concentration} onChange={setConcentration} min={0} step={0.01} placeholder="ex: 1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Duração da perfusão (h)" value={duration} onChange={setDuration} min={0} step={0.5} placeholder="ex: 1" />
        <Select label="Unidade" value={unit} onChange={setUnit} options={[
          { value: 'mg', label: 'mg' }, { value: 'mcg', label: 'mcg' }, { value: 'UI', label: 'UI' },
        ]} />
      </div>
      {volume && (
        <div className="grid grid-cols-2 gap-3">
          <Result label="Volume a perfundir" value={volume} unit="mL" color="blue" />
          {rate && <Result label="Velocidade de perfusão" value={rate} unit="mL/h" color="green" />}
        </div>
      )}
    </div>
  )
}

function PediatricDose() {
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')

  const ageNum = parseFloat(age)
  const wtNum  = parseFloat(weight)

  // Fórmula de Holliday-Segar (mL/dia)
  let fluidDay = null
  if (wtNum) {
    if (wtNum <= 10)       fluidDay = wtNum * 100
    else if (wtNum <= 20)  fluidDay = 1000 + (wtNum - 10) * 50
    else                   fluidDay = 1500 + (wtNum - 20) * 20
  }
  const fluidHour = fluidDay ? (fluidDay / 24).toFixed(0) : null

  // Peso estimado por idade (Broselow / Fórmula simples)
  let estWeight = null
  if (ageNum) {
    if (ageNum < 1)       estWeight = null
    else if (ageNum <= 5) estWeight = (ageNum * 2 + 8).toFixed(0)
    else                  estWeight = (ageNum * 3 + 7).toFixed(0)
  }

  // RCP pediátrica
  const comprDepth = wtNum ? `${Math.min(Math.round(wtNum * 0.08), 6)} cm` : null
  const defibJoule = wtNum ? `${Math.round(wtNum * 2)} J (4 J/kg refractário)` : null

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Idade (anos)" value={age} onChange={setAge} min={0} step={0.25} placeholder="ex: 3" />
        <Field label="Peso (kg) — deixar em branco para estimar" value={weight} onChange={setWeight} min={0.5} step={0.5} placeholder="ex: 15" />
      </div>

      {ageNum > 0 && !weight && estWeight && (
        <Result label="Peso estimado por idade" value={estWeight} unit="kg" note="(Fórmula: idade × 3 + 7 para > 5 anos)" color="yellow" />
      )}

      {fluidDay && (
        <div className="grid grid-cols-2 gap-3">
          <Result label="Hidratação (Holliday-Segar)" value={(fluidDay/1000).toFixed(2)} unit="L/dia" color="blue" />
          <Result label="Velocidade de perfusão" value={fluidHour} unit="mL/h" color="blue" />
        </div>
      )}

      {wtNum && (
        <div className="border rounded-xl p-4 bg-gray-50 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">RCP Pediátrica</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="font-medium">Adrenalina:</span> <span className="text-blue-700 font-mono">{(wtNum * 0.01).toFixed(2)} mg IV/IO</span> <span className="text-gray-400">(0,01 mg/kg)</span></div>
            <div><span className="font-medium">Profundidade RCP:</span> <span className="text-blue-700 font-mono">{comprDepth}</span></div>
            <div><span className="font-medium">Desfibrilhação:</span> <span className="text-blue-700 font-mono">{defibJoule}</span></div>
            <div><span className="font-medium">Amiodarona:</span> <span className="text-blue-700 font-mono">{(wtNum * 5).toFixed(0)} mg IV</span> <span className="text-gray-400">(5 mg/kg)</span></div>
            <div><span className="font-medium">Lorazepam (convulsão):</span> <span className="text-blue-700 font-mono">{Math.min(wtNum * 0.1, 4).toFixed(2)} mg IV</span></div>
            <div><span className="font-medium">Glicose 10% (hipoglicemia):</span> <span className="text-blue-700 font-mono">{(wtNum * 2).toFixed(0)} mL IV</span> <span className="text-gray-400">(2 mL/kg)</span></div>
          </div>
        </div>
      )}
    </div>
  )
}

function CockcroftGault() {
  const [age, setAge]     = useState('')
  const [weight, setWeight] = useState('')
  const [creat, setCreat] = useState('')
  const [sex, setSex]     = useState('M')

  const a = parseFloat(age), w = parseFloat(weight), c = parseFloat(creat)
  let crcl = null, color = 'green', note = ''
  if (a && w && c && c > 0) {
    crcl = ((140 - a) * w) / (72 * c) * (sex === 'F' ? 0.85 : 1)
    crcl = Math.round(crcl)
    if (crcl >= 60)      { color = 'green';  note = 'Dose normal' }
    else if (crcl >= 30) { color = 'yellow'; note = 'Ajustar dose — verificar bula' }
    else if (crcl >= 15) { color = 'orange'; note = 'Ajuste significativo necessário' }
    else                 { color = 'red';    note = 'Dose mínima / evitar nefrotóxicos' }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Idade (anos)"    value={age}    onChange={setAge}    step={1}    placeholder="ex: 65" />
        <Field label="Peso (kg)"       value={weight} onChange={setWeight} step={0.5}  placeholder="ex: 70" />
        <Field label="Creatinina (mg/dL)" value={creat} onChange={setCreat} step={0.01} placeholder="ex: 1.2" />
        <Select label="Sexo" value={sex} onChange={setSex} options={[
          { value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' },
        ]} />
      </div>
      {crcl !== null && (
        <Result label="Clearance de Creatinina (CrCl)" value={crcl} unit="mL/min" note={note} color={color} />
      )}
      <div className="text-xs text-gray-400 bg-gray-50 rounded p-2">
        Fórmula: (140 − idade) × peso / (72 × Cr) × 0,85 se sexo feminino
      </div>
    </div>
  )
}

function RenalAdjustment() {
  const [crcl, setCrcl] = useState('')
  const cr = parseFloat(crcl)

  const drugs = [
    { name: 'Metformina',        c60: 'Normal',    c30: 'Reduzir 50%', c15: 'Suspender',     c0: 'Contraindicado' },
    { name: 'Amoxicilina',       c60: 'Normal',    c30: 'Normal',      c15: '250 mg q12h',   c0: '250 mg q24h' },
    { name: 'Ciprofloxacino',    c60: 'Normal',    c30: '250-500 mg q12h', c15: '250-500 mg q18h', c0: '250 mg q24h' },
    { name: 'Gentamicina',       c60: 'Normal',    c30: 'Aumentar intervalo', c15: 'Evitar / nível sanguíneo', c0: 'Evitar' },
    { name: 'Vancomicina',       c60: 'Normal',    c30: 'Nível sanguíneo', c15: 'Nível sanguíneo', c0: 'Nível sanguíneo' },
    { name: 'Digoxina',          c60: 'Normal',    c30: '62,5 mcg/dia', c15: 'Evitar', c0: 'Evitar' },
    { name: 'Enalapril',         c60: 'Normal',    c30: 'Reduzir 75%', c15: 'Evitar', c0: 'Evitar' },
    { name: 'Lisinopril',        c60: 'Normal',    c30: '5 mg/dia',    c15: '2,5 mg/dia',    c0: 'Evitar' },
    { name: 'Atenolol',          c60: 'Normal',    c30: '50 mg/dia',   c15: '25 mg/dia',     c0: '25 mg/48h' },
    { name: 'Gabapentina',       c60: 'Normal',    c30: '300 mg q12h', c15: '300 mg q24h',   c0: '300 mg q24h (pós-diálise)' },
    { name: 'Nitrofurantoína',   c60: 'Normal',    c30: 'Evitar (ineficaz)', c15: 'Evitar', c0: 'Evitar' },
    { name: 'AAS (antiagregante)', c60: 'Normal',  c30: 'Normal',      c15: 'Usar com cautela', c0: 'Evitar' },
    { name: 'Ibuprofeno / AINEs',c60: 'Cautela',   c30: 'Evitar',      c15: 'Evitar',        c0: 'Evitar' },
    { name: 'Morfina',           c60: 'Normal',    c30: 'Reduzir 25%', c15: 'Reduzir 50%',   c0: 'Evitar' },
    { name: 'Tramadol',          c60: 'Normal',    c30: 'q12h (não LP)', c15: 'q12h máx 200mg', c0: 'Evitar' },
    { name: 'Alopurinol',        c60: '200 mg/dia', c30: '100 mg/dia', c15: '50 mg/dia',     c0: '50 mg/48h' },
    { name: 'Dabigatrano',       c60: 'Normal',    c30: 'Contraindicado', c15: 'Contraindicado', c0: 'Contraindicado' },
    { name: 'Rivaroxabano',      c60: 'Normal',    c30: 'Usar com cautela', c15: 'Contraindicado', c0: 'Contraindicado' },
  ]

  function getDose(drug) {
    if (!cr) return null
    if (cr >= 60) return { dose: drug.c60, color: 'green' }
    if (cr >= 30) return { dose: drug.c30, color: 'yellow' }
    if (cr >= 15) return { dose: drug.c15, color: 'orange' }
    return { dose: drug.c0, color: 'red' }
  }

  const dotColor = { green: 'bg-green-500', yellow: 'bg-yellow-500', orange: 'bg-orange-500', red: 'bg-red-500' }

  return (
    <div className="space-y-4">
      <Field label="CrCl (Cockcroft-Gault, mL/min)" value={crcl} onChange={setCrcl} step={1} placeholder="ex: 45" />
      {!cr && (
        <div className="text-xs text-gray-400 p-2 bg-gray-50 rounded">
          Introduza o CrCl para ver o ajuste recomendado para cada fármaco
        </div>
      )}
      {cr && (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-500 text-xs">
                <th className="text-left px-3 py-2">Fármaco</th>
                <th className="text-left px-3 py-2">Dose ajustada</th>
              </tr>
            </thead>
            <tbody>
              {drugs.map((d, i) => {
                const r = getDose(d)
                return (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-1.5 font-medium text-gray-700">{d.name}</td>
                    <td className="px-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor[r.color]}`}></span>
                        <span className="text-gray-600">{r.dose}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-400">* Dados orientativos. Confirmar sempre na bula e fontes especializadas (Micromedex, UpToDate).</p>
    </div>
  )
}

function NaCorrection() {
  const [na, setNa]       = useState('')
  const [glucose, setGlucose] = useState('')
  const [na_target, setNaTarget] = useState('140')

  const naNum = parseFloat(na), glc = parseFloat(glucose)
  let corrNa = null, delta = null
  if (naNum && glc) {
    // Cada 100 mg/dL de glicose acima de 100 reduz Na em 1,6 mEq/L (fórmula Katz)
    const excess = Math.max(glc - 100, 0) / 100
    corrNa = (naNum + excess * 1.6).toFixed(1)
    delta = (parseFloat(corrNa) - parseFloat(na_target)).toFixed(1)
  }
  const color = corrNa ? (parseFloat(corrNa) > 145 ? 'red' : parseFloat(corrNa) < 135 ? 'yellow' : 'green') : 'blue'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Sódio medido (mEq/L)"       value={na}      onChange={setNa}      step={0.1} placeholder="ex: 128" />
        <Field label="Glicemia (mg/dL)"            value={glucose} onChange={setGlucose} step={1}   placeholder="ex: 450" />
      </div>
      {corrNa && (
        <div className="space-y-3">
          <Result label="Sódio corrigido para glicemia" value={corrNa} unit="mEq/L" color={color}
            note={`Diferença para alvo (${na_target} mEq/L): ${delta > 0 ? '+' : ''}${delta} mEq/L`} />
          <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
            Fórmula: Na⁺ corrigido = Na⁺ medido + 1,6 × [(Glicemia − 100) ÷ 100]
          </div>
        </div>
      )}
    </div>
  )
}

function CaCorrection() {
  const [ca, setCa]   = useState('')
  const [alb, setAlb] = useState('')

  const caNum = parseFloat(ca), albNum = parseFloat(alb)
  let corrCa = null, color = 'green'
  if (caNum && albNum) {
    corrCa = (caNum + 0.8 * (4 - albNum)).toFixed(2)
    const v = parseFloat(corrCa)
    if (v > 10.5)      color = 'red'
    else if (v > 10.0) color = 'yellow'
    else if (v < 8.5)  color = 'yellow'
    else               color = 'green'
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Cálcio total (mg/dL)"   value={ca}  onChange={setCa}  step={0.01} placeholder="ex: 7.8" />
        <Field label="Albumina (g/dL)"         value={alb} onChange={setAlb} step={0.1}  placeholder="ex: 2.5" />
      </div>
      {corrCa && (
        <div className="space-y-3">
          <Result
            label="Cálcio corrigido"
            value={corrCa}
            unit="mg/dL"
            color={color}
            note={`Normal: 8,5–10,5 mg/dL. Albumina normal: 4,0 g/dL.`}
          />
          <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
            Fórmula: Ca corrigido = Ca medido + 0,8 × (4,0 − Albumina)
          </div>
        </div>
      )}
    </div>
  )
}

function OsmolarityCalc() {
  const [na, setNa]       = useState('')
  const [glucose, setGlucose] = useState('')
  const [urea, setUrea]   = useState('')
  const [etanol, setEtanol] = useState('')

  const naNum = parseFloat(na), glc = parseFloat(glucose), ureaN = parseFloat(urea)
  let osm = null, color = 'green'
  if (naNum) {
    osm = 2 * naNum
    if (glc) osm += glc / 18
    if (ureaN) osm += ureaN / 2.8
    if (parseFloat(etanol)) osm += parseFloat(etanol) / 4.6
    osm = osm.toFixed(0)
    const v = parseFloat(osm)
    if (v > 320)      color = 'red'
    else if (v > 295) color = 'yellow'
    else if (v < 280) color = 'yellow'
    else              color = 'green'
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Sódio (mEq/L)"       value={na}      onChange={setNa}      step={0.1} placeholder="ex: 140" />
        <Field label="Glicemia (mg/dL)"    value={glucose} onChange={setGlucose} step={1}   placeholder="ex: 100" />
        <Field label="Ureia (mg/dL)"       value={urea}    onChange={setUrea}    step={0.1} placeholder="ex: 14" />
        <Field label="Etanol (mg/dL) — opcional" value={etanol} onChange={setEtanol} step={1} placeholder="ex: 0" />
      </div>
      {osm && (
        <div className="space-y-2">
          <Result label="Osmolalidade calculada" value={osm} unit="mOsm/kg" color={color}
            note="Normal: 280–295 mOsm/kg" />
          <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
            Fórmula: 2×Na⁺ + Glicemia/18 + Ureia/2,8 [+ Etanol/4,6]
          </div>
        </div>
      )}
    </div>
  )
}

function BMI() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')

  const w = parseFloat(weight), h = parseFloat(height) / 100
  let bmi = null, color = 'green', cat = ''
  if (w && h) {
    bmi = (w / (h * h)).toFixed(1)
    const v = parseFloat(bmi)
    if (v < 18.5)      { color = 'yellow'; cat = 'Baixo peso' }
    else if (v < 25)   { color = 'green';  cat = 'Peso normal' }
    else if (v < 30)   { color = 'yellow'; cat = 'Pré-obesidade' }
    else if (v < 35)   { color = 'orange'; cat = 'Obesidade grau I' }
    else if (v < 40)   { color = 'red';    cat = 'Obesidade grau II' }
    else               { color = 'red';    cat = 'Obesidade grau III (mórbida)' }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Peso (kg)"      value={weight} onChange={setWeight} step={0.5} placeholder="ex: 80" />
        <Field label="Altura (cm)"    value={height} onChange={setHeight} step={1}   placeholder="ex: 175" />
      </div>
      {bmi && <Result label="Índice de Massa Corporal (IMC)" value={bmi} unit="kg/m²" note={cat} color={color} />}
    </div>
  )
}

function IBW() {
  const [height, setHeight] = useState('')
  const [sex, setSex]       = useState('M')

  const h = parseFloat(height)
  let ibw = null
  if (h) {
    // Devine formula (altura em cm → polegadas: h/2.54)
    const hInches = h / 2.54
    if (sex === 'M') ibw = Math.round(50 + 2.3 * (hInches - 60))
    else             ibw = Math.round(45.5 + 2.3 * (hInches - 60))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Altura (cm)"  value={height} onChange={setHeight} step={1} placeholder="ex: 170" />
        <Select label="Sexo" value={sex} onChange={setSex} options={[
          { value: 'M', label: 'Masculino' }, { value: 'F', label: 'Feminino' },
        ]} />
      </div>
      {ibw && (
        <div className="space-y-2">
          <Result label="Peso Ideal (Fórmula de Devine)" value={ibw} unit="kg" color="blue"
            note="Usado para doses em doentes obesos (ex: gentamicina, vancomicina)" />
          <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
            Homem: 50 + 2,3 × (altura em pol. − 60) | Mulher: 45,5 + 2,3 × (altura em pol. − 60)
          </div>
        </div>
      )}
    </div>
  )
}

function MAPCalc() {
  const [sbp, setSbp] = useState('')
  const [dbp, setDbp] = useState('')
  const [hr,  setHr]  = useState('')

  const s = parseFloat(sbp), d = parseFloat(dbp)
  const map = s && d ? ((s + 2 * d) / 3).toFixed(0) : null
  const pp  = s && d ? (s - d).toFixed(0) : null
  const color = map ? (parseFloat(map) < 65 ? 'red' : parseFloat(map) > 100 ? 'yellow' : 'green') : 'blue'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Field label="PAS (mmHg)"  value={sbp} onChange={setSbp} step={1} placeholder="ex: 120" />
        <Field label="PAD (mmHg)"  value={dbp} onChange={setDbp} step={1} placeholder="ex: 80" />
        <Field label="FC (bpm) — opcional" value={hr} onChange={setHr} step={1} placeholder="ex: 75" />
      </div>
      {map && (
        <div className="grid grid-cols-2 gap-3">
          <Result label="Pressão Arterial Média (PAM)" value={map} unit="mmHg"
            note={parseFloat(map) < 65 ? 'Abaixo do alvo sépsis (< 65)' : 'PAM normal (alvo sépsis: ≥ 65)'}
            color={color} />
          <Result label="Pressão de Pulso (PP)" value={pp} unit="mmHg"
            note="Normal: 40 mmHg. >60: elevado (rigidez aórtica)" color="blue" />
        </div>
      )}
    </div>
  )
}

// ─── Mapa de calculadores ────────────────────────────────────────────────────
const CALCS = {
  dose_weight:    { name: 'Dose por Peso',              desc: 'Calcular dose total a partir de mg/kg',      component: DoseByWeight },
  infusion_rate:  { name: 'Velocidade de Perfusão',     desc: 'Dose total, concentração e duração → mL/h', component: InfusionRate },
  pediatric_dose: { name: 'Doses Pediátricas',          desc: 'Fluidos, RCP e fármacos pediátricos',       component: PediatricDose },
  cockcroft:      { name: 'Cockcroft-Gault (CrCl)',     desc: 'Clearance de creatinina estimada',          component: CockcroftGault },
  renal_adjust:   { name: 'Ajuste Renal de Fármacos',   desc: 'Doses conforme função renal (CrCl)',        component: RenalAdjustment },
  na_correction:  { name: 'Correção do Sódio',          desc: 'Na⁺ corrigido para hiperglicemia',          component: NaCorrection },
  ca_correction:  { name: 'Correção do Cálcio',         desc: 'Ca²⁺ total corrigido para albumina',        component: CaCorrection },
  osmolarity:     { name: 'Osmolalidade Plasmática',    desc: 'Osmolalidade calculada (Na, glicose, ureia)',component: OsmolarityCalc },
  bmi:            { name: 'IMC',                        desc: 'Índice de Massa Corporal e classificação',  component: BMI },
  ibw:            { name: 'Peso Ideal',                 desc: 'Fórmula de Devine para dosagem',            component: IBW },
  map_calc:       { name: 'PAM e Pressão de Pulso',     desc: 'Pressão arterial média a partir de PAS/PAD',component: MAPCalc },
}

export default function CalculatorsPage() {
  const [activeId, setActiveId] = useState('dose_weight')
  const calc = CALCS[activeId]
  const Component = calc?.component

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel */}
      <div className="w-56 shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        {CALC_GROUPS.map(g => (
          <div key={g.id}>
            <div className="px-3 pt-3 pb-1 flex items-center gap-1.5">
              <span className="text-sm">{g.icon}</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{g.label}</span>
            </div>
            {g.items.map(cid => (
              <button
                key={cid}
                onClick={() => setActiveId(cid)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors
                  ${activeId === cid ? 'bg-teal-50 text-teal-700 font-semibold border-r-2 border-teal-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                {CALCS[cid]?.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto p-6">
        {calc && (
          <>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-800">{calc.name}</h2>
              <p className="text-sm text-gray-500">{calc.desc}</p>
            </div>
            <div className="max-w-2xl">
              <Component key={activeId} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
