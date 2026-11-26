/* SurgDecision — интерфейсные строки и переключение языка.
   Клинические тексты живут в data.js / data.en.js; здесь только оболочка. */

const UI = {
  ru: {
    'meta.description': 'Аудируемая клиническая поддержка решений при десяти неотложных состояниях в экстренной хирургии.',
    'app.title': 'SurgDecision — решения в экстренной хирургии',
    'brand.subtitle': 'Экстренная хирургия · аудируемые решения',
    'nav.method': 'Методика',
    'nav.print': 'Печать',
    'lang.label': 'Язык интерфейса',
    'picker.eyebrow': 'Клиническая поддержка решений',
    'picker.title': 'Десять неотложных состояний,<br>один аудируемый путь до операции',
    'picker.lead': 'Каждый шаг обследования — типизированное решение: вопрос с вариантами, вероятность для каждого варианта, правило выбора и запись в журнал. Дифференциальный диагноз пересчитывается после каждого этапа, а план лечения строится по степени тяжести.',
    'picker.disclaimer': 'Учебно-демонстрационный инструмент поддержки врачебного решения. Не является медицинским изделием, не заменяет осмотр хирурга и локальные протоколы. Дозы приведены для взрослых с нормальной функцией почек.',
    'card.go': 'Разобрать случай',
    'icd.prefix': 'МКБ-10',
    'case.back': '← Все состояния',
    'patient.title': 'Пациент',
    'patient.age': 'Возраст',
    'patient.sex': 'Пол',
    'patient.sexM': 'Мужской',
    'patient.sexF': 'Женский',
    'patient.egfr': 'СКФ, мл/мин/1,73 м²',
    'patient.pregnant': 'Беременность',
    'patient.pen': 'Аллергия на пенициллин',
    'patient.ac': 'Антикоагулянты',
    'patient.imm': 'Иммуносупрессия',
    'patient.hint': 'Параметры влияют на выбор визуализации и антибактериальной терапии.',
    'case.reset': 'Начать разбор заново',
    'stage.title': 'Этапы обследования',
    'stage.done': 'готово',
    'stage.pending': 'ожидает',
    'stage.auditCount': 'Решений в журнале: {n}',
    'ddx.title': 'Дифференциальный диагноз',
    'ddx.live': 'обновляется',
    'ddx.note': 'Учтено признаков: {answered} из {total}. Вероятности пересчитаны по отношениям правдоподобия; «нет данных» не меняет распределение.',
    'step.title': 'Решение {n}',
    'step.tag': 'Choice · {n} этапа',
    'step.question': 'Какое действие выполнить следующим?',
    'step.questionNote': 'Контроллер ранжирует доступные этапы по ожидаемой информационной ценности и стоимости метода.',
    'step.rule': 'Правило.',
    'step.ruleBest': 'Выполняется вариант с наибольшей вероятностью.',
    'step.ruleFinalOn': 'Заключение доступно после трёх этапов.',
    'step.ruleFinalOff': 'Заключение станет доступно после трёх этапов.',
    'step.running': 'выполняется',
    'step.markData': '— отметьте полученные данные',
    'step.results': 'Результаты · отмечено {answered} из {total}',
    'step.commit': 'Зафиксировать этап и продолжить',
    'step.hintEmpty': 'Можно зафиксировать без данных — шаг останется в журнале.',
    'step.hintLive': 'Изменения сразу пересчитывают дифференциал.',
    'step.finished': 'Обследование завершено.',
    'step.finishedNote': 'Решений в журнале: {n}. Заключение и план лечения ниже.',
    'step.openAudit': 'Открыть журнал',
    'step.allDone': 'Все этапы завершены — сформулируйте заключение.',
    'step.final': 'Сформулировать заключение',
    'answer.yes': 'Да',
    'answer.no': 'Нет',
    'answer.unknown': 'Н/д',
    'conclusion.title': 'Заключение',
    'conclusion.tag': 'апостериорная оценка',
    'conclusion.probability': 'вероятность',
    'conclusion.leadIndex': 'МКБ-10 {icd} · ведущий диагноз',
    'conclusion.leadAlt': 'Дифференциальный вариант · модуль «{name}»',
    'conclusion.confHigh': 'Высокая уверенность',
    'conclusion.confMid': 'Средняя уверенность',
    'conclusion.confLow': 'Низкая уверенность — уточните данные',
    'conclusion.flags': 'Красные флаги и риски',
    'conclusion.severityPrefix': 'Степень тяжести: ',
    'conclusion.lowConfidence': ' Уверенность ниже 60%: продолжайте обследование и рассмотрите альтернативы.',
    'conclusion.warningTitle': 'Внимание.',
    'conclusion.warning': 'Ведущий вариант не совпадает с профильным заболеванием модуля. Шкала и план лечения ниже относятся к «{name}»; при другом ведущем диагнозе откройте соответствующий модуль или продолжите обследование.',
    'conclusion.question': 'Какой диагноз является ведущим?',
    'conclusion.rule': 'Выбирается диагноз с наибольшей апостериорной вероятностью.',
    'plan.title': 'План лечения',
    'plan.drivers': 'Основания для степени тяжести: {list}.',
    'plan.doses': 'Дозы для взрослых. Проверьте локальный протокол, массу тела, функцию почек и аллергоанамнез перед назначением.',
    'audit.title': 'Журнал решений',
    'audit.download': 'Скачать JSON',
    'audit.intro': 'Каждая запись содержит вопрос, вероятности всех вариантов, применённое правило, выполненное действие и полученные данные.',
    'audit.question': 'Вопрос',
    'audit.probabilities': 'Вероятности',
    'audit.rule': 'Правило',
    'audit.executed': 'Выполнено',
    'audit.findings': 'Получено',
    'audit.posterior': 'После шага',
    'audit.score': 'Шкала',
    'audit.diagnosisPrefix': 'Заключение: ',
    'audit.yes': 'да',
    'audit.no': 'нет',
    'audit.unknown': 'нет данных',
    'footer.text': 'SurgDecision · демонстрационная система поддержки решений. Вероятности получены байесовским пересчётом таблиц отношений правдоподобия; оценки и пороги взяты из опубликованных шкал. Решение всегда остаётся за хирургом.',
    'modal.title': 'Как устроено решение',
    'modal.close': 'Закрыть',
    'modal.h1': 'Типизированный шаг вместо текста',
    'modal.p1': 'Агент не пишет рассуждение. На каждом шаге он отвечает на вопрос с закрытым списком вариантов: «Какое обследование выполнить следующим?», «Есть ли симптом Мёрфи?». Ответ — вероятность для каждого варианта. Детерминированный контроллер применяет фиксированное правило: выполняет самый вероятный вариант. Шаг, вероятности, правило и полученные данные записываются в журнал.',
    'modal.h2': 'Дифференциальный диагноз',
    'modal.p2': 'Априорные вероятности обновляются по теореме Байеса. Для каждого симптома задана пара отношений правдоподобия: LR+ (симптом есть) и LR− (симптома нет). Отношение шансов умножается на LR, затем вероятности нормируются по всем вариантам дифференциала. Ответ «нет данных» не изменяет распределение.',
    'modal.h3': 'Выбор следующего действия',
    'modal.p3': 'Для каждого доступного этапа вычисляется ожидаемая информационная ценность: сумма дискриминирующей силы неотвеченных признаков, взвешенная текущей вероятностью альтернатив, с поправкой на «стоимость» метода. Вариант с наибольшим весом выполняется. После трёх этапов в меню появляется заключение: его вес растёт с уверенностью распределения. Заключение можно сформировать досрочно.',
    'modal.h4': 'Лечение',
    'modal.p4': 'Степень тяжести определяется по профильной шкале (Alvarado, Tokyo 2018, BISAP, Hinchey, Boey, Glasgow–Blatchford, индекс странгуляции, перитонеальные признаки при ишемии). План лечения выбирается по степени тяжести и модифицируется с учётом аллергии, беременности, СКФ и антикоагулянтов.',
    'modal.h5': 'Границы применимости',
    'modal.p5': 'Таблицы правдоподобия — дидактические, собранные из литературы, а не откалиброванные на когорте. Инструмент не валидирован как медицинское изделие, не учитывает педиатрию, беременность (кроме отдельных указаний) и локальную резистентность. Любое решение проверяйте по действующему протоколу учреждения.'
  },

  en: {
    'meta.description': 'Auditable clinical decision support for ten emergency surgical conditions.',
    'app.title': 'SurgDecision — emergency surgical decisions',
    'brand.subtitle': 'Emergency surgery · auditable decisions',
    'nav.method': 'Method',
    'nav.print': 'Print',
    'lang.label': 'Interface language',
    'picker.eyebrow': 'Clinical decision support',
    'picker.title': 'Ten emergency conditions,<br>one auditable path to the operating room',
    'picker.lead': 'Every step of the work-up is a typed decision: a question with options, a probability for each option, a selection rule and a log entry. The differential is recalculated after each stage, and the treatment plan is built from the severity grade.',
    'picker.disclaimer': 'An educational demonstration tool for clinical decision support. It is not a medical device and does not replace surgical assessment or local protocols. Doses are for adults with normal renal function.',
    'card.go': 'Open case',
    'icd.prefix': 'ICD-10',
    'case.back': '← All conditions',
    'patient.title': 'Patient',
    'patient.age': 'Age',
    'patient.sex': 'Sex',
    'patient.sexM': 'Male',
    'patient.sexF': 'Female',
    'patient.egfr': 'eGFR, mL/min/1.73 m²',
    'patient.pregnant': 'Pregnancy',
    'patient.pen': 'Penicillin allergy',
    'patient.ac': 'Anticoagulants',
    'patient.imm': 'Immunosuppression',
    'patient.hint': 'These parameters affect imaging choice and antibiotic therapy.',
    'case.reset': 'Start the case again',
    'stage.title': 'Work-up stages',
    'stage.done': 'done',
    'stage.pending': 'pending',
    'stage.auditCount': 'Decisions logged: {n}',
    'ddx.title': 'Differential diagnosis',
    'ddx.live': 'updating',
    'ddx.note': 'Findings used: {answered} of {total}. Probabilities are recalculated from likelihood ratios; “no data” does not change the distribution.',
    'step.title': 'Decision {n}',
    'step.tag': 'Choice · {n} stages',
    'step.question': 'Which action should be performed next?',
    'step.questionNote': 'The controller ranks the available stages by expected information value and the cost of the test.',
    'step.rule': 'Rule.',
    'step.ruleBest': 'The most probable option is executed.',
    'step.ruleFinalOn': 'The conclusion is available after three stages.',
    'step.ruleFinalOff': 'The conclusion becomes available after three stages.',
    'step.running': 'running',
    'step.markData': '— record the findings obtained',
    'step.results': 'Results · {answered} of {total} recorded',
    'step.commit': 'Commit stage and continue',
    'step.hintEmpty': 'You can commit without data — the step stays in the log.',
    'step.hintLive': 'Changes recalculate the differential immediately.',
    'step.finished': 'Work-up complete.',
    'step.finishedNote': 'Decisions logged: {n}. The conclusion and treatment plan are below.',
    'step.openAudit': 'Open the log',
    'step.allDone': 'All stages are complete — issue the conclusion.',
    'step.final': 'Issue the conclusion',
    'answer.yes': 'Yes',
    'answer.no': 'No',
    'answer.unknown': 'N/A',
    'conclusion.title': 'Conclusion',
    'conclusion.tag': 'posterior estimate',
    'conclusion.probability': 'probability',
    'conclusion.leadIndex': 'ICD-10 {icd} · leading diagnosis',
    'conclusion.leadAlt': 'Differential option · module “{name}”',
    'conclusion.confHigh': 'High confidence',
    'conclusion.confMid': 'Moderate confidence',
    'conclusion.confLow': 'Low confidence — obtain more data',
    'conclusion.flags': 'Red flags and risks',
    'conclusion.severityPrefix': 'Severity: ',
    'conclusion.lowConfidence': ' Confidence below 60%: continue the work-up and consider alternatives.',
    'conclusion.warningTitle': 'Note.',
    'conclusion.warning': 'The leading option does not match this module’s index condition. The score and treatment plan below refer to “{name}”; with a different leading diagnosis, open the corresponding module or continue the work-up.',
    'conclusion.question': 'Which diagnosis is the leading one?',
    'conclusion.rule': 'The diagnosis with the highest posterior probability is selected.',
    'plan.title': 'Treatment plan',
    'plan.drivers': 'Basis for the severity grade: {list}.',
    'plan.doses': 'Adult doses. Check the local protocol, body weight, renal function and allergy history before prescribing.',
    'audit.title': 'Decision log',
    'audit.download': 'Download JSON',
    'audit.intro': 'Each entry records the question, the probabilities of all options, the rule applied, the action taken and the findings obtained.',
    'audit.question': 'Question',
    'audit.probabilities': 'Probabilities',
    'audit.rule': 'Rule',
    'audit.executed': 'Executed',
    'audit.findings': 'Findings',
    'audit.posterior': 'After the step',
    'audit.score': 'Score',
    'audit.diagnosisPrefix': 'Conclusion: ',
    'audit.yes': 'yes',
    'audit.no': 'no',
    'audit.unknown': 'no data',
    'footer.text': 'SurgDecision · a demonstration decision-support system. Probabilities are recalculated from likelihood-ratio tables by Bayes’ theorem; scores and thresholds follow published scales. The final decision always rests with the surgeon.',
    'modal.title': 'How a decision is made',
    'modal.close': 'Close',
    'modal.h1': 'A typed step instead of prose',
    'modal.p1': 'The agent does not write an argument. At each step it answers a question with a closed list of options: “Which test should be performed next?”, “Is Murphy’s sign present?”. The answer is a probability for every option. A deterministic controller applies a fixed rule: it executes the most probable option. The step, the probabilities, the rule and the data obtained are written to the log.',
    'modal.h2': 'Differential diagnosis',
    'modal.p2': 'Prior probabilities are updated with Bayes’ theorem. Each finding has a pair of likelihood ratios: LR+ (finding present) and LR− (finding absent). The odds are multiplied by the LR, then the probabilities are normalised across all differential options. An answer of “no data” does not change the distribution.',
    'modal.h3': 'Choosing the next action',
    'modal.p3': 'For every available stage the expected information value is computed: the sum of the discriminative power of unanswered findings, weighted by the current probability of the alternatives and adjusted for the cost of the test. The option with the greatest weight is executed. After three stages the conclusion appears in the menu and its weight grows with the certainty of the distribution. The conclusion can also be issued early.',
    'modal.h4': 'Treatment',
    'modal.p4': 'Severity is determined by the condition-specific scale (Alvarado, Tokyo 2018, BISAP, Hinchey, Boey, Glasgow–Blatchford, strangulation index, peritoneal signs in ischaemia). The treatment plan is selected by severity and modified for penicillin allergy, pregnancy, eGFR and anticoagulants.',
    'modal.h5': 'Limitations',
    'modal.p5': 'The likelihood tables are educational, compiled from the literature rather than calibrated on a cohort. The tool is not validated as a medical device and does not cover paediatrics, pregnancy (except specific notes) or local resistance. Always check every decision against your institution’s protocol.'
  }
};

const LANG_STORAGE_KEY = 'surgdecision.lang';
let LANG = 'ru';
let languageChangeHandler = () => {};

function detectLanguage() {
  let stored = null;
  try { stored = localStorage.getItem(LANG_STORAGE_KEY); } catch (e) { stored = null; }
  if (stored === 'ru' || stored === 'en') return stored;
  const preferred = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
  for (const code of preferred) {
    const base = String(code).slice(0, 2).toLowerCase();
    if (base === 'ru') return 'ru';
    if (base === 'en') return 'en';
  }
  return 'en';
}

function t(key, vars) {
  const dict = UI[LANG] || UI.ru;
  let text = dict[key] != null ? dict[key] : (UI.ru[key] != null ? UI.ru[key] : key);
  if (vars) {
    for (const name in vars) text = text.split('{' + name + '}').join(String(vars[name]));
  }
  return text;
}

function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':');
      if (attr && key) el.setAttribute(attr, t(key));
    });
  });
  document.querySelectorAll('.lang-switch button').forEach(b => {
    const on = b.dataset.lang === LANG;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

function onLanguageChange(fn) { languageChangeHandler = fn; }

function setLanguage(lang, persist) {
  const next = lang === 'en' ? 'en' : 'ru';
  if (persist) {
    try { localStorage.setItem(LANG_STORAGE_KEY, next); } catch (e) { /* private mode */ }
  }
  LANG = next;
  document.documentElement.lang = next;
  languageChangeHandler();
}

LANG = detectLanguage();
document.documentElement.lang = LANG;
