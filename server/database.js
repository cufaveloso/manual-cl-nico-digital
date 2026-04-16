import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, '..', 'receitas.json')

// ── Leitura / escrita ────────────────────────────────────────────────────────

function load() {
  if (!existsSync(DB_PATH)) return null
  return JSON.parse(readFileSync(DB_PATH, 'utf-8'))
}

function save(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

function nextId(seq, table) {
  seq[table] = (seq[table] || 0) + 1
  return seq[table]
}

// ── Seed inicial ─────────────────────────────────────────────────────────────

function createSeed() {
  const categories = []
  const prescriptions = []
  const items = []
  const seq = { categories: 0, prescriptions: 0, items: 0 }

  function cat(name, type) {
    const id = nextId(seq, 'categories')
    categories.push({ id, name, type, created_at: new Date().toISOString() })
    return id
  }
  function rec(category_id, name, notes = '') {
    const id = nextId(seq, 'prescriptions')
    prescriptions.push({ id, category_id, name, notes, created_at: new Date().toISOString() })
    return id
  }
  function item(prescription_id, drug_name, strength, quantity, instructions, position) {
    const id = nextId(seq, 'items')
    items.push({ id, prescription_id, drug_name, strength, quantity, instructions, position })
  }

  // ── Analgesia ────────────────────────────────────────────────────────────
  const cAnal = cat('Analgesia', 'drug_class')

  const rAnal1 = rec(cAnal, 'Dor leve a moderada')
  item(rAnal1, 'Paracetamol', '500 mg', '20 comp.', '1 comprimido de 6/6 h, se dor ou febre', 0)
  item(rAnal1, 'Ibuprofeno', '600 mg', '20 comp.', '1 comprimido de 8/8 h após as refeições, se dor', 1)

  const rAnal2 = rec(cAnal, 'Dor moderada a intensa')
  item(rAnal2, 'Dipirona', '1 g', '20 comp.', '1 comprimido de 6/6 h, se dor ou febre', 0)
  item(rAnal2, 'Tramadol', '50 mg', '20 caps.', '1 cápsula de 8/8 h, se dor intensa', 1)
  item(rAnal2, 'Omeprazol', '20 mg', '14 comp.', '1 comprimido em jejum (proteção gástrica)', 2)

  const rAnal3 = rec(cAnal, 'Cefaleia tensional')
  item(rAnal3, 'Paracetamol', '750 mg', '20 comp.', '1 comprimido de 6/6 h, se dor — máx. 4 g/dia', 0)
  item(rAnal3, 'Cafeína', '65 mg', '20 comp.', 'associada ao paracetamol, se dor intensa', 1)

  const rAnal4 = rec(cAnal, 'Enxaqueca — crise')
  item(rAnal4, 'Sumatriptano', '50 mg', '6 comp.', '1 comprimido ao início da crise; repetir após 2 h se necessário — máx. 2 comp./dia', 0)
  item(rAnal4, 'Metoclopramida', '10 mg', '10 comp.', '1 comprimido 30 min antes do sumatriptano, se náuseas', 1)

  // ── Anti-inflamatórios ───────────────────────────────────────────────────
  const cAINE = cat('Anti-inflamatórios (AINEs)', 'drug_class')

  const rAINE1 = rec(cAINE, 'Lombalgia / Dor musculoesquelética')
  item(rAINE1, 'Ibuprofeno', '600 mg', '30 comp.', '1 comprimido de 8/8 h após as refeições, por 7 dias', 0)
  item(rAINE1, 'Ciclobenzaprina', '5 mg', '20 comp.', '1 comprimido de 8/8 h, se contratura muscular', 1)
  item(rAINE1, 'Omeprazol', '20 mg', '14 comp.', '1 comprimido em jejum (proteção gástrica)', 2)

  const rAINE2 = rec(cAINE, 'Artrite / Artralgia aguda')
  item(rAINE2, 'Naproxeno', '550 mg', '20 comp.', '1 comprimido de 12/12 h após as refeições, por 10 dias', 0)
  item(rAINE2, 'Omeprazol', '20 mg', '14 comp.', '1 comprimido em jejum', 1)

  const rAINE3 = rec(cAINE, 'Gota — crise aguda')
  item(rAINE3, 'Indometacina', '50 mg', '30 caps.', '1 cápsula de 8/8 h após as refeições, por 5–7 dias', 0)
  item(rAINE3, 'Colchicina', '0,5 mg', '30 comp.', '1 comprimido de 8/8 h nos primeiros 2 dias, depois 1 ao dia', 1)
  item(rAINE3, 'Omeprazol', '20 mg', '14 comp.', '1 comprimido em jejum', 2)

  // ── Hipertensão ──────────────────────────────────────────────────────────
  const cHAS = cat('Hipertensão', 'disease')

  const rHAS1 = rec(cHAS, 'HAS estágio 1 — monoterapia IECA')
  item(rHAS1, 'Enalapril', '10 mg', '30 comp.', '1 comprimido de 12/12 h', 0)

  const rHAS2 = rec(cHAS, 'HAS estágio 1 — monoterapia BRA')
  item(rHAS2, 'Losartana', '50 mg', '30 comp.', '1 comprimido de 12/12 h', 0)

  const rHAS3 = rec(cHAS, 'HAS estágio 1 — monoterapia BCC')
  item(rHAS3, 'Anlodipino', '5 mg', '30 comp.', '1 comprimido ao dia', 0)

  const rHAS4 = rec(cHAS, 'HAS estágio 2 — IECA + BCC')
  item(rHAS4, 'Enalapril', '20 mg', '30 comp.', '1 comprimido de 12/12 h', 0)
  item(rHAS4, 'Anlodipino', '10 mg', '30 comp.', '1 comprimido ao dia', 1)

  const rHAS5 = rec(cHAS, 'HAS estágio 2 — BRA + BCC + diurético')
  item(rHAS5, 'Losartana', '100 mg', '30 comp.', '1 comprimido ao dia', 0)
  item(rHAS5, 'Anlodipino', '10 mg', '30 comp.', '1 comprimido ao dia', 1)
  item(rHAS5, 'Hidroclorotiazida', '25 mg', '30 comp.', '1/2 comprimido pela manhã', 2)

  const rHAS6 = rec(cHAS, 'HAS com betabloqueador', 'Indicado se FA, pós-IAM ou IC')
  item(rHAS6, 'Carvedilol', '6,25 mg', '60 comp.', '1 comprimido de 12/12 h com as refeições', 0)
  item(rHAS6, 'Enalapril', '10 mg', '30 comp.', '1 comprimido de 12/12 h', 1)

  // ── Diabetes ─────────────────────────────────────────────────────────────
  const cDM = cat('Diabetes', 'disease')

  const rDM1 = rec(cDM, 'DM2 — início com metformina')
  item(rDM1, 'Metformina', '500 mg', '60 comp.', '1 comprimido de 12/12 h às refeições (aumentar gradualmente)', 0)

  const rDM2 = rec(cDM, 'DM2 — metformina dose plena')
  item(rDM2, 'Metformina', '850 mg', '60 comp.', '1 comprimido de 8/8 h às refeições', 0)

  const rDM3 = rec(cDM, 'DM2 — metformina + sulfonilureia')
  item(rDM3, 'Metformina', '850 mg', '60 comp.', '1 comprimido de 8/8 h às refeições', 0)
  item(rDM3, 'Glibenclamida', '5 mg', '30 comp.', '1 comprimido antes do almoço', 1)

  const rDM4 = rec(cDM, 'DM2 — metformina + iSGLT2', 'Preferir se DCV ou IRC estabelecida')
  item(rDM4, 'Metformina', '850 mg', '60 comp.', '1 comprimido de 8/8 h às refeições', 0)
  item(rDM4, 'Empagliflozina', '10 mg', '30 comp.', '1 comprimido ao dia pela manhã', 1)

  const rDM5 = rec(cDM, 'DM2 — metformina + iDPP4')
  item(rDM5, 'Metformina', '850 mg', '60 comp.', '1 comprimido de 8/8 h às refeições', 0)
  item(rDM5, 'Sitagliptina', '100 mg', '30 comp.', '1 comprimido ao dia', 1)

  // ── Dislipidemia ─────────────────────────────────────────────────────────
  const cDislip = cat('Dislipidemia', 'disease')

  const rDislip1 = rec(cDislip, 'Hipercolesterolemia — estatina moderada')
  item(rDislip1, 'Sinvastatina', '20 mg', '30 comp.', '1 comprimido à noite', 0)

  const rDislip2 = rec(cDislip, 'Hipercolesterolemia — estatina alta intensidade')
  item(rDislip2, 'Rosuvastatina', '20 mg', '30 comp.', '1 comprimido ao dia', 0)

  const rDislip3 = rec(cDislip, 'Dislipidemia mista — estatina + fibrato')
  item(rDislip3, 'Rosuvastatina', '10 mg', '30 comp.', '1 comprimido ao dia', 0)
  item(rDislip3, 'Fenofibrato', '200 mg', '30 caps.', '1 cápsula ao dia com a refeição principal', 1)

  // ── Antibióticos ─────────────────────────────────────────────────────────
  const cAtb = cat('Antibióticos', 'drug_class')

  const rAtb1 = rec(cAtb, 'Amigdalite bacteriana — 1.ª linha')
  item(rAtb1, 'Amoxicilina', '500 mg', '21 caps.', '1 cápsula de 8/8 h por 7 dias', 0)

  const rAtb2 = rec(cAtb, 'Amigdalite — alergia à penicilina')
  item(rAtb2, 'Azitromicina', '500 mg', '3 comp.', '1 comprimido ao dia por 3 dias', 0)

  const rAtb3 = rec(cAtb, 'Sinusite bacteriana aguda')
  item(rAtb3, 'Amoxicilina + Ácido clavulânico', '875/125 mg', '14 comp.', '1 comprimido de 12/12 h por 7 dias, após as refeições', 0)
  item(rAtb3, 'Loratadina', '10 mg', '10 comp.', '1 comprimido ao dia', 1)

  const rAtb4 = rec(cAtb, 'ITU não complicada (mulher)')
  item(rAtb4, 'Nitrofurantoína', '100 mg', '14 caps.', '1 cápsula de 12/12 h por 7 dias, após as refeições', 0)
  item(rAtb4, 'Fenazopiridina', '100 mg', '6 comp.', '1 comprimido de 8/8 h por 2 dias (alívio sintomático)', 1)

  const rAtb5 = rec(cAtb, 'ITU — fluoroquinolona')
  item(rAtb5, 'Norfloxacino', '400 mg', '6 comp.', '1 comprimido de 12/12 h por 3 dias, em jejum', 0)

  const rAtb6 = rec(cAtb, 'Pneumonia comunitária leve — 1.ª linha')
  item(rAtb6, 'Amoxicilina', '1 g', '21 comp.', '1 comprimido de 8/8 h por 7 dias', 0)

  const rAtb7 = rec(cAtb, 'Pneumonia atípica / Mycoplasma')
  item(rAtb7, 'Azitromicina', '500 mg', '5 comp.', '1 comprimido ao dia por 5 dias', 0)

  const rAtb8 = rec(cAtb, 'Celulite / Impetigo — 1.ª linha')
  item(rAtb8, 'Cefalexina', '500 mg', '28 caps.', '1 cápsula de 6/6 h por 7 dias', 0)

  const rAtb9 = rec(cAtb, 'Helicobacter pylori — erradicação', 'Confirmar com teste antes de tratar')
  item(rAtb9, 'Omeprazol', '20 mg', '28 comp.', '1 comprimido de 12/12 h por 14 dias', 0)
  item(rAtb9, 'Amoxicilina', '1 g', '28 comp.', '1 comprimido de 12/12 h por 14 dias', 1)
  item(rAtb9, 'Claritromicina', '500 mg', '28 comp.', '1 comprimido de 12/12 h por 14 dias', 2)

  // ── Respiratório ─────────────────────────────────────────────────────────
  const cResp = cat('Respiratório', 'disease')

  const rResp1 = rec(cResp, 'Gripe / Resfriado')
  item(rResp1, 'Paracetamol', '750 mg', '20 comp.', '1 comprimido de 6/6 h, se febre ou dor', 0)
  item(rResp1, 'Loratadina', '10 mg', '10 comp.', '1 comprimido ao dia', 1)
  item(rResp1, 'Vitamina C', '1 g', '10 comp.', '1 comprimido ao dia por 10 dias', 2)

  const rResp2 = rec(cResp, 'Asma — crise leve a moderada')
  item(rResp2, 'Salbutamol', '100 mcg/dose', '1 frasco inalador', '2 puffs de 4/4 h nas crises, espaçar conforme melhora', 0)
  item(rResp2, 'Prednisolona', '20 mg', '10 comp.', '1 comprimido ao dia por 5 dias, pela manhã', 1)

  const rResp3 = rec(cResp, 'Asma persistente leve — manutenção')
  item(rResp3, 'Beclometasona', '250 mcg/dose', '1 inalador', '1 puff de 12/12 h (corticoide inalado)', 0)
  item(rResp3, 'Salbutamol', '100 mcg/dose', '1 inalador resgate', '2 puffs apenas nas crises', 1)

  const rResp4 = rec(cResp, 'DPOC — manutenção broncodilatador')
  item(rResp4, 'Tiotrópio', '18 mcg/dose', '1 inalador', '1 inalação ao dia (HandiHaler)', 0)
  item(rResp4, 'Salbutamol', '100 mcg/dose', '1 inalador resgate', '2 puffs até 4 × ao dia, se dispneia', 1)

  const rResp5 = rec(cResp, 'Tosse produtiva / Bronquite')
  item(rResp5, 'Ambroxol', '30 mg', '20 comp.', '1 comprimido de 8/8 h por 7 dias, com bastante água', 0)

  // ── Gastroenterologia ────────────────────────────────────────────────────
  const cGastro = cat('Gastroenterologia', 'disease')

  const rGastro1 = rec(cGastro, 'DRGE / Esofagite — tratamento')
  item(rGastro1, 'Omeprazol', '20 mg', '28 comp.', '1 comprimido em jejum por 4 semanas', 0)

  const rGastro2 = rec(cGastro, 'DRGE — manutenção')
  item(rGastro2, 'Omeprazol', '10 mg', '30 comp.', '1 comprimido em jejum diariamente', 0)

  const rGastro3 = rec(cGastro, 'Gastrite / Úlcera péptica')
  item(rGastro3, 'Pantoprazol', '40 mg', '28 comp.', '1 comprimido em jejum por 4–8 semanas', 0)
  item(rGastro3, 'Hidróxido de alumínio + magnésio', '400/400 mg', '40 comp.', '1 comprimido de 6/6 h, 1 h após as refeições — alívio sintomático', 1)

  const rGastro4 = rec(cGastro, 'Náuseas e vómitos')
  item(rGastro4, 'Metoclopramida', '10 mg', '20 comp.', '1 comprimido de 8/8 h, 30 min antes das refeições', 0)
  item(rGastro4, 'Ondansetron', '8 mg', '10 comp.', '1 comprimido de 8/8 h, se náuseas intensas', 1)

  const rGastro5 = rec(cGastro, 'Diarreia aguda — suporte')
  item(rGastro5, 'Sais de reidratação oral', '', '2 sachês', '1 sachê dissolvido em 1 L de água a cada episódio de diarreia', 0)
  item(rGastro5, 'Loperamida', '2 mg', '12 caps.', '2 cápsulas na 1.ª dose, depois 1 a cada evacuação — máx. 8 caps./dia', 1)

  const rGastro6 = rec(cGastro, 'Obstipação crónica')
  item(rGastro6, 'Macrogol (Polietilenoglicol)', '3350 — sachê 13,8 g', '20 sachês', '1 sachê dissolvido em 125 ml de água, 1 × ao dia', 0)
  item(rGastro6, 'Bisacodil', '5 mg', '20 comp.', '1–2 comprimidos à noite (uso pontual, não contínuo)', 1)

  // ── Psiquiatria / Neurologia ─────────────────────────────────────────────
  const cPsiq = cat('Psiquiatria / Neurologia', 'drug_class')

  const rPsiq1 = rec(cPsiq, 'Depressão leve a moderada — ISRS início')
  item(rPsiq1, 'Sertralina', '50 mg', '30 comp.', '1 comprimido ao dia (início 25 mg/dia na 1.ª semana)', 0)

  const rPsiq2 = rec(cPsiq, 'Depressão — ISRS dose plena')
  item(rPsiq2, 'Sertralina', '100 mg', '30 comp.', '1 comprimido ao dia de manhã', 0)

  const rPsiq3 = rec(cPsiq, 'Ansiedade generalizada — ISRS')
  item(rPsiq3, 'Escitalopram', '10 mg', '30 comp.', '1 comprimido ao dia de manhã', 0)

  const rPsiq4 = rec(cPsiq, 'Insónia — curto prazo', 'Máx. 4 semanas; reavaliar')
  item(rPsiq4, 'Zolpidem', '10 mg', '14 comp.', '1/2 a 1 comprimido 30 min antes de dormir — não usar com álcool', 0)

  const rPsiq5 = rec(cPsiq, 'Ansiedade aguda / Crise de pânico', 'Uso pontual; avaliar dependência')
  item(rPsiq5, 'Lorazepam', '1 mg', '10 comp.', '1/2 a 1 comprimido SL ou VO na crise — máx. 2 comp./dia', 0)

  const rPsiq6 = rec(cPsiq, 'Epilepsia — manutenção')
  item(rPsiq6, 'Ácido valpróico', '500 mg', '60 comp.', '1 comprimido de 12/12 h com as refeições', 0)

  // ── Tireoide ─────────────────────────────────────────────────────────────
  const cTireo = cat('Tireoide', 'disease')

  const rTireo1 = rec(cTireo, 'Hipotiroidismo — início')
  item(rTireo1, 'Levotiroxina', '50 mcg', '30 comp.', '1 comprimido em jejum, 30 min antes do pequeno-almoço', 0)

  const rTireo2 = rec(cTireo, 'Hipotiroidismo — dose manutenção')
  item(rTireo2, 'Levotiroxina', '100 mcg', '30 comp.', '1 comprimido em jejum, 30 min antes do pequeno-almoço', 0)

  const rTireo3 = rec(cTireo, 'Hipertiroidismo — tionamida')
  item(rTireo3, 'Metimazol', '10 mg', '30 comp.', '1 comprimido de 8/8 h (titular conforme T3/T4 — ajustar com endocrinologia)', 0)
  item(rTireo3, 'Propranolol', '40 mg', '30 comp.', '1 comprimido de 12/12 h (controlo de sintomas adrenérgicos)', 1)

  // ── Cardiologia ──────────────────────────────────────────────────────────
  const cCardio = cat('Cardiologia', 'disease')

  const rCardio1 = rec(cCardio, 'Angina estável — antianginosos')
  item(rCardio1, 'Atenolol', '50 mg', '30 comp.', '1 comprimido ao dia', 0)
  item(rCardio1, 'AAS', '100 mg', '30 comp.', '1 comprimido ao dia com a refeição', 1)
  item(rCardio1, 'Nitroglicerina', '0,5 mg', '30 comp. sublinguais', '1 comprimido SL na crise anginosa; repetir após 5 min se necessário — ir ao SU se sem melhora', 2)

  const rCardio2 = rec(cCardio, 'Pós-IAM — prevenção secundária')
  item(rCardio2, 'AAS', '100 mg', '30 comp.', '1 comprimido ao dia com a refeição', 0)
  item(rCardio2, 'Atenolol', '50 mg', '30 comp.', '1 comprimido ao dia', 1)
  item(rCardio2, 'Enalapril', '10 mg', '30 comp.', '1 comprimido de 12/12 h', 2)
  item(rCardio2, 'Rosuvastatina', '20 mg', '30 comp.', '1 comprimido ao dia', 3)

  const rCardio3 = rec(cCardio, 'Fibrilhação auricular — controlo de ritmo')
  item(rCardio3, 'Bisoprolol', '5 mg', '30 comp.', '1 comprimido ao dia', 0)
  item(rCardio3, 'Apixabano', '5 mg', '60 comp.', '1 comprimido de 12/12 h (anticoagulação — rever CHA₂DS₂-VASc)', 1)

  const rCardio4 = rec(cCardio, 'Insuficiência cardíaca — base')
  item(rCardio4, 'Carvedilol', '6,25 mg', '60 comp.', '1 comprimido de 12/12 h com as refeições (titular conforme tolerância)', 0)
  item(rCardio4, 'Enalapril', '10 mg', '30 comp.', '1 comprimido de 12/12 h', 1)
  item(rCardio4, 'Espironolactona', '25 mg', '30 comp.', '1 comprimido ao dia (monitorizar K⁺)', 2)

  // ── Dermatologia ─────────────────────────────────────────────────────────
  const cDerm = cat('Dermatologia', 'disease')

  const rDerm1 = rec(cDerm, 'Dermatite atópica / Eczema — crise')
  item(rDerm1, 'Betametasona creme', '0,1%', '1 bisnaga 30 g', 'Aplicar fina camada na zona afetada 2 × ao dia, por 7 dias', 0)
  item(rDerm1, 'Loratadina', '10 mg', '10 comp.', '1 comprimido ao dia (antipruriginoso)', 1)

  const rDerm2 = rec(cDerm, 'Psoríase em placas — tópico')
  item(rDerm2, 'Calcipotriol + Betametasona gel', '50 mcg/0,5 mg por g', '1 frasco 60 g', 'Aplicar nas placas 1 × ao dia, máx. 4 semanas', 0)

  const rDerm3 = rec(cDerm, 'Candidíase cutânea / oral')
  item(rDerm3, 'Clotrimazol creme', '1%', '1 bisnaga 20 g', 'Aplicar 2–3 × ao dia na zona afetada por 14 dias', 0)
  item(rDerm3, 'Fluconazol', '150 mg', '1 caps.', '1 cápsula dose única (candidíase vaginal)', 1)

  const rDerm4 = rec(cDerm, 'Herpes zóster')
  item(rDerm4, 'Aciclovir', '800 mg', '35 comp.', '1 comprimido de 4/4 h (5 ×/dia) por 7 dias — iniciar <72 h', 0)
  item(rDerm4, 'Paracetamol', '1 g', '20 comp.', '1 comprimido de 8/8 h, se dor', 1)

  const rDerm5 = rec(cDerm, 'Acne moderada — tópico + oral')
  item(rDerm5, 'Peróxido de benzoíla gel', '5%', '1 bisnaga 30 g', 'Aplicar camada fina 1 × ao dia à noite', 0)
  item(rDerm5, 'Doxiciclina', '100 mg', '30 comp.', '1 comprimido ao dia com bastante água — evitar sol', 1)

  // ── Urologia ─────────────────────────────────────────────────────────────
  const cUro = cat('Urologia', 'disease')

  const rUro1 = rec(cUro, 'HBP — alfa-bloqueador')
  item(rUro1, 'Tansulosina', '0,4 mg', '30 caps.', '1 cápsula ao dia 30 min após a refeição principal', 0)

  const rUro2 = rec(cUro, 'HBP — 5-alfa-redutase')
  item(rUro2, 'Finasterida', '5 mg', '30 comp.', '1 comprimido ao dia — efeito pleno após 6 meses', 0)

  const rUro3 = rec(cUro, 'Cólica renal — analgesia')
  item(rUro3, 'Dipirona', '1 g', '20 comp.', '2 comprimidos de 6/6 h, se dor', 0)
  item(rUro3, 'Tansulosina', '0,4 mg', '30 caps.', '1 cápsula ao dia (facilita expulsão do cálculo)', 1)

  // ── Ginecologia ──────────────────────────────────────────────────────────
  const cGineco = cat('Ginecologia', 'disease')

  const rGineco1 = rec(cGineco, 'Dismenorreia primária')
  item(rGineco1, 'Ibuprofeno', '600 mg', '20 comp.', '1 comprimido de 8/8 h nos primeiros 2–3 dias do ciclo', 0)
  item(rGineco1, 'Hioscina', '10 mg', '20 comp.', '1 comprimido de 8/8 h, se cólicas intensas', 1)

  const rGineco2 = rec(cGineco, 'Candidíase vaginal')
  item(rGineco2, 'Fluconazol', '150 mg', '1 caps.', '1 cápsula dose única', 0)
  item(rGineco2, 'Clotrimazol creme vaginal', '2%', '1 bisnaga + aplicador', 'Aplicar 1 × ao dia intravaginal por 7 dias', 1)

  const rGineco3 = rec(cGineco, 'Vaginose bacteriana')
  item(rGineco3, 'Metronidazol', '500 mg', '14 comp.', '1 comprimido de 12/12 h por 7 dias', 0)

  const rGineco4 = rec(cGineco, 'Suplementação na gravidez')
  item(rGineco4, 'Ácido fólico', '5 mg', '30 comp.', '1 comprimido ao dia (iniciar pré-concepção)', 0)
  item(rGineco4, 'Sulfato ferroso', '40 mg Fe²⁺', '30 comp.', '1 comprimido ao dia em jejum ou com vitamina C', 1)

  return { categories, prescriptions, items, seq }
}

// ── Inicialização ─────────────────────────────────────────────────────────────

let _db = load()
if (!_db) {
  _db = createSeed()
  save(_db)
}

// ── API pública ───────────────────────────────────────────────────────────────

export function getCategories() {
  const { categories, prescriptions } = _db
  return categories
    .map(c => ({
      ...c,
      prescription_count: prescriptions.filter(p => p.category_id === c.id).length
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function createCategory(name, type) {
  if (_db.categories.find(c => c.name.toLowerCase() === name.toLowerCase())) {
    throw new Error('Categoria já existe')
  }
  const id = nextId(_db.seq, 'categories')
  const cat = { id, name, type, created_at: new Date().toISOString() }
  _db.categories.push(cat)
  save(_db)
  return { ...cat, prescription_count: 0 }
}

export function updateCategory(id, name, type) {
  const cat = _db.categories.find(c => c.id === id)
  if (!cat) return null
  cat.name = name
  cat.type = type
  save(_db)
  const count = _db.prescriptions.filter(p => p.category_id === id).length
  return { ...cat, prescription_count: count }
}

export function deleteCategory(id) {
  const recIds = _db.prescriptions.filter(p => p.category_id === id).map(p => p.id)
  _db.items = _db.items.filter(it => !recIds.includes(it.prescription_id))
  _db.prescriptions = _db.prescriptions.filter(p => p.category_id !== id)
  _db.categories = _db.categories.filter(c => c.id !== id)
  save(_db)
}

function withItems(prescription) {
  const items = _db.items
    .filter(it => it.prescription_id === prescription.id)
    .sort((a, b) => a.position - b.position)
  const cat = _db.categories.find(c => c.id === prescription.category_id)
  return { ...prescription, category_name: cat?.name || '', items }
}

export function getPrescriptions({ categoryId, search } = {}) {
  let recs = _db.prescriptions

  if (search) {
    const term = search.toLowerCase()
    const matchingItemIds = _db.items
      .filter(it =>
        it.drug_name.toLowerCase().includes(term) ||
        it.instructions.toLowerCase().includes(term)
      )
      .map(it => it.prescription_id)

    recs = recs.filter(p =>
      p.name.toLowerCase().includes(term) ||
      matchingItemIds.includes(p.id)
    )
  } else if (categoryId) {
    recs = recs.filter(p => p.category_id === categoryId)
  }

  return recs
    .map(withItems)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function createPrescription(category_id, name, notes, items) {
  const id = nextId(_db.seq, 'prescriptions')
  const rec = { id, category_id, name, notes, created_at: new Date().toISOString() }
  _db.prescriptions.push(rec)
  items.forEach((item, i) => {
    const itemId = nextId(_db.seq, 'items')
    _db.items.push({
      id: itemId,
      prescription_id: id,
      drug_name: item.drug_name,
      strength: item.strength || '',
      quantity: item.quantity,
      instructions: item.instructions,
      position: i
    })
  })
  save(_db)
  return withItems(rec)
}

export function updatePrescription(id, category_id, name, notes, items) {
  const rec = _db.prescriptions.find(p => p.id === id)
  if (!rec) return null
  rec.category_id = category_id
  rec.name = name
  rec.notes = notes
  _db.items = _db.items.filter(it => it.prescription_id !== id)
  items.forEach((item, i) => {
    const itemId = nextId(_db.seq, 'items')
    _db.items.push({
      id: itemId,
      prescription_id: id,
      drug_name: item.drug_name,
      strength: item.strength || '',
      quantity: item.quantity,
      instructions: item.instructions,
      position: i
    })
  })
  save(_db)
  return withItems(rec)
}

export function deletePrescription(id) {
  _db.items = _db.items.filter(it => it.prescription_id !== id)
  _db.prescriptions = _db.prescriptions.filter(p => p.id !== id)
  save(_db)
}
