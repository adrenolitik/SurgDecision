/* SurgDecision — движок решений и интерфейс. */

const DEFAULT_PATIENT = { age: 55, sex: 'm', pregnant: false, penAllergy: false, egfr: 90, anticoag: false, immuno: false };
const PATIENT_FIELDS = [
  { sel: '#p-age', key: 'age', kind: 'number' },
  { sel: '#p-sex', key: 'sex', kind: 'text' },
  { sel: '#p-egfr', key: 'egfr', kind: 'number' },
  { sel: '#p-preg', key: 'pregnant', kind: 'check' },
  { sel: '#p-pen', key: 'penAllergy', kind: 'check' },
  { sel: '#p-ac', key: 'anticoag', kind: 'check' },
  { sel: '#p-imm', key: 'immuno', kind: 'check' }
];

const state = {
  diseaseId: null,
  answers: {},
  completed: [],
  activeStage: null,
  finalized: false,
  audit: [],
  patient: { ...DEFAULT_PATIENT }
};

const $ = sel => document.querySelector(sel);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pct = p => Math.round(p * 100);
const barFill = (p, highlighted) =>
  '<div class="track"><div class="fill' + (highlighted ? '' : ' dim') + '" style="width:' + Math.max(1, pct(p)) + '%"></div></div>';

function currentDataset() {
  return LANG === 'en' ? DISEASES_EN : DISEASES;
}

function getDisease() {
  return currentDataset().find(d => d.id === state.diseaseId);
}

const stageTitle = (d, id) => (d.stages.find(st => st.id === id) || {}).title || id;
const differentialLabel = (d, id) => (d.differential.find(x => x.id === id) || {}).label || id;
function findingText(d, id) {
  for (const st of d.stages) {
    const f = st.findings.find(x => x.id === id);
    if (f) return f.t;
  }
  return id;
}

function currentScore(d) {
  if (!d.score) return null;
  const s = { ans: state.answers, patient: state.patient };
  let total = 0;
  const items = d.score.items.map(it => {
    let hit = false;
    if (it.finding) hit = state.answers[it.finding] === 'yes';
    else if (it.auto) hit = !!it.auto(s);
    if (hit) total += it.points;
    return { ...it, hit };
  });
  const band = d.score.bands.find(b => total >= b.min && total <= b.max) || d.score.bands[d.score.bands.length - 1];
  return { name: d.score.name, total, max: d.score.max, items, band };
}

function posterior(d) {
  const logit = {};
  d.differential.forEach(x => { logit[x.id] = Math.log(Math.max(d.priors[x.id] || 1e-6, 1e-6)); });
  d.stages.forEach(st => st.findings.forEach(f => {
    const a = state.answers[f.id];
    if (a !== 'yes' && a !== 'no') return;
    d.differential.forEach(x => {
      const lr = f.lr && f.lr[x.id];
      if (lr) logit[x.id] += Math.log(a === 'yes' ? lr[0] : lr[1]);
    });
  }));
  const mx = Math.max(...Object.values(logit));
  let sum = 0;
  for (const k in logit) { logit[k] = Math.exp(logit[k] - mx); sum += logit[k]; }
  for (const k in logit) logit[k] /= sum;
  return logit;
}

function entropy(post) {
  return -Object.values(post).reduce((s, p) => s + (p > 0 ? p * Math.log(p) : 0), 0);
}

function availableStages(d) {
  return d.stages.filter(st =>
    !state.completed.includes(st.id) && (st.requires || []).every(id => state.completed.includes(id))
  );
}

function stageIG(d, st, post) {
  let ig = 0;
  st.findings.forEach(f => {
    const a = state.answers[f.id];
    if (a === 'yes' || a === 'no') return;
    let strength = 0;
    d.differential.forEach(x => {
      const lr = f.lr && f.lr[x.id];
      if (!lr) return;
      strength += (post[x.id] || 0) * Math.min(Math.abs(Math.log(lr[0] / lr[1])), 4) / 2;
    });
    ig += strength + 0.12;
  });
  return ig;
}

function actionSet(d, post) {
  const avail = availableStages(d);
  const items = avail.map(st => ({
    id: st.id,
    label: st.title,
    w: stageIG(d, st, post) / (st.cost || 1)
  }));
  const n = d.differential.length;
  const hmax = n > 1 ? Math.log(n) : 1;
  const certainty = Math.max(0, 1 - entropy(post) / hmax);
  if (state.completed.length >= 3 || avail.length === 0) {
    items.push({ id: 'final', label: t('step.final'), w: 0.6 + 2.6 * certainty });
  }
  const sharp = items.map(i => ({ id: i.id, label: i.label, w: Math.pow(Math.max(i.w, 1e-4), 1.6) }));
  const sum = sharp.reduce((a, b) => a + b.w, 0) || 1;
  return sharp.map(i => ({ id: i.id, label: i.label, p: i.w / sum })).sort((a, b) => b.p - a.p);
}

function topDiagnoses(d, post, limit) {
  return d.differential
    .map(x => ({ id: x.id, label: x.label, p: post[x.id] }))
    .sort((a, b) => b.p - a.p)
    .slice(0, limit || 3);
}

/* ---------------- patient ---------------- */

function readPatient() {
  state.patient = PATIENT_FIELDS.reduce((patient, field) => {
    const el = $(field.sel);
    patient[field.key] = field.kind === 'number'
      ? Number(el.value) || DEFAULT_PATIENT[field.key]
      : field.kind === 'check' ? el.checked : el.value;
    return patient;
  }, {});
}

function resetPatientForm() {
  PATIENT_FIELDS.forEach(field => {
    const el = $(field.sel);
    if (field.kind === 'check') el.checked = DEFAULT_PATIENT[field.key];
    else el.value = DEFAULT_PATIENT[field.key];
  });
}

/* Всё, что нужно шкалам и планам лечения от текущего случая. */
function caseContext(d) {
  return { ans: state.answers, score: currentScore(d), patient: state.patient };
}

/* ---------------- picker ---------------- */

function renderPicker() {
  $('#disease-grid').innerHTML = currentDataset().map((d, i) => {
    const n = String(i + 1).padStart(2, '0');
    return '<button class="dcard" type="button" data-id="' + d.id + '" style="--accent:' + d.accent + '">' +
      '<span class="num">' + n + '</span>' +
      '<h3>' + esc(d.name) + '</h3>' +
      '<span class="icd">' + t('icd.prefix') + ' ' + esc(d.icd) + '</span>' +
      '<p>' + esc(d.short) + '</p>' +
      '<span class="go">' + t('card.go') + '</span>' +
      '</button>';
  }).join('');
  $('#disease-grid').querySelectorAll('.dcard').forEach(b => {
    b.addEventListener('click', () => openDisease(b.dataset.id));
  });
}

/* ---------------- case ---------------- */

function openDisease(id) {
  state.diseaseId = id;
  state.answers = {};
  state.completed = [];
  state.activeStage = null;
  state.finalized = false;
  state.audit = [];
  state.patient = { ...DEFAULT_PATIENT };
  resetPatientForm();
  $('#picker').hidden = true;
  $('#case').hidden = false;
  document.title = getDisease().name + ' — SurgDecision';
  window.scrollTo({ top: 0, behavior: 'instant' });
  renderCase();
}

function renderCase() {
  const d = getDisease();
  if (!d) return;
  renderSide(d);
  renderDdx(d);
  renderStep(d);
  renderConclusion(d);
  renderPlan(d);
  renderAudit(d);
}

function renderSide(d) {
  $('#side-disease').innerHTML =
    '<div class="side-disease">' +
      '<h2>' + esc(d.name) + '</h2>' +
      '<span class="icd">' + t('icd.prefix') + ' ' + esc(d.icd) + '</span>' +
      '<ul class="pearls">' + d.pearls.map(p => '<li>' + esc(p) + '</li>').join('') + '</ul>' +
    '</div>';

  const rows = d.stages.map(st => {
    const done = state.completed.includes(st.id);
    return '<div class="stage-line' + (done ? ' done' : '') + '">' +
      '<span class="dot">' + (done ? '✓' : '') + '</span>' +
      '<span>' + esc(st.title) + '</span>' +
      '<span class="tag-mini">' + t(done ? 'stage.done' : 'stage.pending') + '</span>' +
      '</div>';
  }).join('');

  $('#progress-card').innerHTML =
    '<div class="progress"><h3>' + t('stage.title') + '</h3>' + rows +
    '<p class="hint">' + t('stage.auditCount', { n: state.audit.length }) + '</p></div>';
}

function renderDdx(d) {
  const post = posterior(d);
  const top = topDiagnoses(d, post, d.differential.length);
  const lead = top[0];
  const bars = top.map(td =>
    '<div class="bar-row' + (td.id === lead.id ? ' lead' : '') + '">' +
      '<span class="bl">' + esc(td.label) + '</span>' +
      barFill(td.p, td.id === lead.id) +
      '<span class="bp">' + pct(td.p) + '%</span>' +
    '</div>'
  ).join('');
  const nAnswered = Object.values(state.answers).filter(v => v === 'yes' || v === 'no').length;
  const nTotal = d.stages.reduce((a, st) => a + st.findings.length, 0);
  $('#ddx').innerHTML =
    '<section class="section">' +
      '<div class="section-head"><h2>' + t('ddx.title') + '</h2><span class="tag live">' + t('ddx.live') + '</span></div>' +
      '<div class="section-body">' + bars +
        '<p class="ddx-note">' + t('ddx.note', { answered: nAnswered, total: nTotal }) + '</p>' +
      '</div>' +
    '</section>';
}

function renderStep(d) {
  const el = $('#step');
  if (state.finalized) {
    el.innerHTML =
      '<section class="section"><div class="section-body" style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">' +
        '<div><b>' + t('step.finished') + '</b> <span class="empty">' + t('step.finishedNote', { n: state.audit.length }) + '</span></div>' +
        '<a href="#audit" class="ghost mini">' + t('step.openAudit') + '</a>' +
      '</div></section>';
    return;
  }

  const opts = actionSet(d, posterior(d));
  const avail = availableStages(d);
  const active = avail.find(st => st.id === state.activeStage) || avail[0] || null;
  state.activeStage = active ? active.id : null;

  const optionRows = opts.map(o => {
    const isActive = active && o.id === active.id;
    return '<button class="opt' + (isActive ? ' active' : '') + '" type="button" data-act="' + o.id + '">' +
      '<span>' + esc(o.label) + '</span>' +
      barFill(o.p, isActive) +
      '<span class="op">' + pct(o.p) + '%</span>' +
      '</button>';
  }).join('');

  const answerLabel = val => val === 'yes' ? t('answer.yes') : val === 'no' ? t('answer.no') : t('answer.unknown');
  const findings = active ? active.findings.map(f => {
    const v = state.answers[f.id] || 'unknown';
    const seg = ['yes', 'no', 'unknown'].map(val =>
      '<button type="button" data-fid="' + f.id + '" class="' + (v === val ? 'on' : '') + '" data-v="' + val + '">' +
        answerLabel(val) +
      '</button>'
    ).join('');
    return '<div class="frow"><span class="fl">' + esc(f.t) + '</span><div class="seg">' + seg + '</div></div>';
  }).join('') : '';

  const answered = active ? active.findings.filter(f => state.answers[f.id] === 'yes' || state.answers[f.id] === 'no').length : 0;
  const total = active ? active.findings.length : 0;
  const allowFinal = state.completed.length >= 3;
  const stepNo = state.completed.length + 1;

  el.innerHTML =
    '<section class="section">' +
      '<div class="section-head"><h2>' + t('step.title', { n: stepNo }) + '</h2><span class="tag">' + t('step.tag', { n: d.stages.length }) + '</span></div>' +
      '<div class="section-body">' +
        '<p class="qtext"><b>' + t('step.question') + '</b> ' + t('step.questionNote') + '</p>' +
        '<div class="options">' + optionRows + '</div>' +
        '<p class="rule"><b>' + t('step.rule') + '</b> ' + t('step.ruleBest') + ' ' +
          (allowFinal ? t('step.ruleFinalOn') : t('step.ruleFinalOff')) + '</p>' +
        (active ?
          '<div class="executed"><span class="pill">' + t('step.running') + '</span><span><b>' + esc(active.title) + '</b> ' + t('step.markData') + '</span></div>' +
          '<div class="findings"><h4>' + t('step.results', { answered, total }) + '</h4>' + findings + '</div>' +
          '<div class="step-actions">' +
            '<button class="primary" type="button" data-do="commit">' + t('step.commit') + '</button>' +
            '<span class="empty">' + t(answered === 0 ? 'step.hintEmpty' : 'step.hintLive') + '</span>' +
          '</div>'
          : '<p class="empty">' + t('step.allDone') + '</p>'
        ) +
      '</div>' +
    '</section>';

  el.querySelectorAll('.opt').forEach(b => {
    b.addEventListener('click', () => {
      if (b.dataset.act === 'final') { finalize(d); return; }
      state.activeStage = b.dataset.act;
      renderStep(d);
    });
  });

  el.querySelectorAll('.seg button').forEach(b => {
    b.addEventListener('click', () => {
      state.answers[b.dataset.fid] = b.dataset.v;
      renderDdx(d);
      renderStep(d);
    });
  });

  const commit = el.querySelector('[data-do="commit"]');
  if (commit) commit.addEventListener('click', () => commitStage(d, opts));
}

function commitStage(d, opts) {
  const st = d.stages.find(s => s.id === state.activeStage);
  if (!st) return;
  const post = posterior(d);
  state.audit.push({
    kind: 'action',
    stage: st.id,
    options: opts.map(o => ({ id: o.id, p: o.p })),
    findings: st.findings.map(f => ({ id: f.id, v: state.answers[f.id] || 'unknown' })),
    posterior: topDiagnoses(d, post, 3).map(p => ({ id: p.id, p: p.p }))
  });
  state.completed.push(st.id);
  state.activeStage = null;
  if (state.completed.length >= d.stages.length) finalize(d);
  else renderCase();
}

function finalize(d) {
  if (state.finalized) return;
  const post = posterior(d);
  const top = topDiagnoses(d, post, 4);
  state.finalized = true;
  state.audit.push({
    kind: 'diagnosis',
    options: top.map(o => ({ id: o.id, p: o.p })),
    posterior: top.map(o => ({ id: o.id, p: o.p }))
  });
  renderCase();
  const conc = $('#conclusion');
  if (conc) conc.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderConclusion(d) {
  const el = $('#conclusion');
  if (!state.finalized) { el.innerHTML = ''; return; }
  const post = posterior(d);
  const top = topDiagnoses(d, post, d.differential.length);
  const lead = top[0];
  const conf = lead.p >= 0.8 ? ['high', t('conclusion.confHigh')]
    : lead.p >= 0.6 ? ['mid', t('conclusion.confMid')]
      : ['low', t('conclusion.confLow')];
  const ctx = caseContext(d);
  const score = ctx.score;
  const sev = d.severity(ctx);
  const isIndex = lead.id === d.differential[0].id;
  const alts = top.slice(1, 4).map(td => '<span class="alt-chip">' + esc(td.label) + ' <b>' + pct(td.p) + '%</b></span>').join('');

  const scoreHtml = score ?
    '<div class="score-box">' +
      '<div class="score-head"><b>' + esc(score.name) + '</b><span>' + score.total + ' / ' + score.max + ' · ' + esc(score.band.label) + '</span></div>' +
      '<div class="score-items">' + score.items.map(it =>
        '<span class="score-item' + (it.hit ? ' hit' : '') + '"><span class="tick">' + (it.hit ? '✓' : '') + '</span>' + esc(it.label) + ' (' + it.points + ')</span>'
      ).join('') + '</div>' +
      '<div class="score-band">' + esc(score.band.note) + '</div>' +
    '</div>' : '';

  el.innerHTML =
    '<section class="section">' +
      '<div class="section-head"><h2>' + t('conclusion.title') + '</h2><span class="tag live">' + t('conclusion.tag') + '</span></div>' +
      '<div class="section-body">' +
        '<div class="concl-top">' +
          '<div>' +
            '<div class="concl-name">' + esc(lead.label) + '<span class="idc">' +
              (isIndex ? t('conclusion.leadIndex', { icd: d.icd })
                : t('conclusion.leadAlt', { name: d.name })) +
              '</span></div>' +
            '<span class="badge ' + conf[0] + '">' + conf[1] + '</span>' +
          '</div>' +
          '<div class="conf"><div class="big">' + pct(lead.p) + '%</div><div class="lbl">' + t('conclusion.probability') + '</div></div>' +
        '</div>' +
        '<div class="alts">' + alts + '</div>' +
        scoreHtml +
        '<div class="flags"><h4>' + t('conclusion.flags') + '</h4><ul>' + d.redFlags.map(f => '<li>' + esc(f) + '</li>').join('') + '</ul></div>' +
        '<p class="ddx-note">' + t('conclusion.severityPrefix') + '<b>' + esc(sev.label) + '</b>. ' + esc(sev.note) +
          (lead.p < 0.6 ? t('conclusion.lowConfidence') : '') + '</p>' +
        (isIndex ? '' : '<p class="rule" style="margin-top:10px"><b>' + t('conclusion.warningTitle') + '</b> ' +
          t('conclusion.warning', { name: d.name }) + '</p>') +
      '</div>' +
    '</section>';
}

function renderPlan(d) {
  const el = $('#plan');
  if (!state.finalized) { el.innerHTML = ''; return; }
  const ctx = caseContext(d);
  const sev = d.severity(ctx);
  const blocks = d.plan(ctx);

  el.innerHTML =
    '<section class="section">' +
      '<div class="section-head"><h2>' + t('plan.title') + '</h2><span class="tag">' + esc(sev.label) + '</span></div>' +
      '<div class="section-body">' +
        blocks.map(b =>
          '<div class="plan-block tone-' + b.tone + '">' +
            '<div class="plan-title"><span class="sq"></span>' + esc(b.title) + '</div>' +
            '<ul>' + b.items.map(i => '<li>' + esc(i) + '</li>').join('') + '</ul>' +
          '</div>'
        ).join('') +
        (sev.drivers.length ? '<p class="ddx-note">' + t('plan.drivers', { list: sev.drivers.map(esc).join('; ') }) + '</p>' : '') +
        '<p class="ddx-note">' + t('plan.doses') + '</p>' +
      '</div>' +
    '</section>';
}

/* Журнал хранит только id и вероятности, чтобы записи переводились вместе с интерфейсом. */
function localizedAudit(d) {
  const optionLabel = (kind, o) => kind === 'diagnosis'
    ? differentialLabel(d, o.id)
    : o.id === 'final' ? t('step.final') : stageTitle(d, o.id);
  const score = d.score ? currentScore(d) : null;
  return state.audit.map((a, idx) => ({
    kind: a.kind,
    step: idx + 1,
    question: a.kind === 'diagnosis' ? t('conclusion.question') : t('step.question'),
    rule: a.kind === 'diagnosis' ? t('conclusion.rule') : t('step.ruleBest'),
    options: a.options.map(o => ({ label: optionLabel(a.kind, o), p: o.p })),
    executed: a.kind === 'diagnosis' ? differentialLabel(d, a.options[0].id) : stageTitle(d, a.stage),
    findings: a.findings ? a.findings.map(f => ({ label: findingText(d, f.id), v: f.v })) : [],
    posterior: a.posterior.map(p => ({ label: differentialLabel(d, p.id), p: p.p })),
    score: a.kind === 'diagnosis' && score
      ? { name: score.name, total: score.total, max: score.max, band: score.band.label }
      : null
  }));
}

function renderAudit(d) {
  const el = $('#audit');
  const entries = localizedAudit(d);
  if (!entries.length) { el.innerHTML = ''; return; }
  const answerLabel = v => v === 'yes' ? t('audit.yes') : v === 'no' ? t('audit.no') : t('audit.unknown');

  const items = entries.map((a, idx) =>
    '<details class="audit-entry"' + (idx === state.audit.length - 1 ? ' open' : '') + '>' +
      '<summary>' +
        '<span class="n">' + String(idx + 1).padStart(2, '0') + '</span>' +
        '<span class="what">' + (a.kind === 'diagnosis' ? '<b>' + t('audit.diagnosisPrefix') + '</b>' : '') + esc(a.executed) + '</span>' +
        '<span class="p">' + pct(a.options[0].p) + '%</span>' +
      '</summary>' +
      '<div class="audit-body">' +
        '<dl class="kv">' +
          '<dt>' + t('audit.question') + '</dt><dd>' + esc(a.question) + '</dd>' +
          '<dt>' + t('audit.probabilities') + '</dt><dd>' + a.options.map(o => esc(o.label) + ' — ' + pct(o.p) + '%').join('; ') + '</dd>' +
          '<dt>' + t('audit.rule') + '</dt><dd>' + esc(a.rule) + '</dd>' +
          '<dt>' + t('audit.executed') + '</dt><dd>' + esc(a.executed) + '</dd>' +
          (a.findings.length ? '<dt>' + t('audit.findings') + '</dt><dd><div class="fnd">' +
            a.findings.map(f => '<span class="' + (f.v === 'yes' ? 'yes' : f.v === 'no' ? 'no' : '') + '">' + esc(f.label) + ' — ' +
              answerLabel(f.v) + '</span>').join('') + '</div></dd>' : '') +
          '<dt>' + t('audit.posterior') + '</dt><dd>' + a.posterior.map(p => esc(p.label) + ' — ' + pct(p.p) + '%').join('; ') + '</dd>' +
          (a.score ? '<dt>' + t('audit.score') + '</dt><dd>' + esc(a.score.name) + ': ' + a.score.total + ' / ' + a.score.max + ' — ' + esc(a.score.band) + '</dd>' : '') +
        '</dl>' +
      '</div>' +
    '</details>'
  ).join('');

  el.innerHTML =
    '<section class="section" id="audit-log">' +
      '<div class="section-head"><h2>' + t('audit.title') + '</h2>' +
        '<button class="ghost mini" type="button" id="btn-export">' + t('audit.download') + '</button>' +
      '</div>' +
      '<div class="section-body">' +
        '<p class="ddx-note" style="margin:0 0 12px">' + t('audit.intro') + '</p>' +
        items +
      '</div>' +
    '</section>';

  const ex = $('#btn-export');
  if (ex) ex.addEventListener('click', () => exportCase(d));
}

function exportCase(d) {
  const ctx = caseContext(d);
  const payload = {
    tool: 'SurgDecision',
    language: LANG,
    generatedAt: new Date().toISOString(),
    disease: { id: d.id, name: d.name, icd: d.icd },
    patient: state.patient,
    findings: state.answers,
    posterior: topDiagnoses(d, posterior(d), d.differential.length),
    score: ctx.score,
    finalized: state.finalized,
    audit: localizedAudit(d).map(a => ({
      kind: a.kind,
      step: a.step,
      question: a.question,
      options: a.options.map(o => ({ label: o.label, probability: o.p })),
      rule: a.rule,
      executed: a.executed,
      ...(a.findings.length ? { findings: a.findings.map(f => ({ finding: f.label, value: f.v })) } : {}),
      posterior: a.posterior.map(p => ({ diagnosis: p.label, probability: p.p })),
      ...(a.score ? { score: a.score } : {})
    }))
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'surgdecision-' + d.id + '.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ---------------- wiring ---------------- */

function renderAll() {
  applyStaticI18n();
  renderPicker();
  const d = getDisease();
  if (d) {
    document.title = d.name + ' — SurgDecision';
    renderCase();
  } else {
    document.title = t('app.title');
  }
}

onLanguageChange(renderAll);

$('#btn-back').addEventListener('click', () => {
  state.diseaseId = null;
  $('#case').hidden = true;
  $('#picker').hidden = false;
  document.title = t('app.title');
  window.scrollTo({ top: 0, behavior: 'instant' });
});

$('#btn-reset').addEventListener('click', () => {
  if (state.diseaseId) openDisease(state.diseaseId);
});

$('#btn-print').addEventListener('click', () => {
  document.querySelectorAll('details').forEach(d => { d.open = true; });
  window.print();
});

document.querySelectorAll('.lang-switch button').forEach(b => {
  b.addEventListener('click', () => setLanguage(b.dataset.lang, true));
});

$('#btn-method').addEventListener('click', () => { $('#modal').hidden = false; });
$('#btn-close-modal').addEventListener('click', () => { $('#modal').hidden = true; });
$('#modal').addEventListener('click', e => { if (e.target === $('#modal')) $('#modal').hidden = true; });
document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#modal').hidden = true; });

['p-age', 'p-sex', 'p-egfr', 'p-preg', 'p-pen', 'p-ac', 'p-imm'].forEach(id => {
  document.getElementById(id).addEventListener('change', () => {
    readPatient();
    const d = getDisease();
    if (!d) return;
    renderConclusion(d);
    renderPlan(d);
  });
});

renderAll();
