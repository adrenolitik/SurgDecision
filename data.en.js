/* SurgDecision — English clinical content.
   Mirrors data.js by id: the likelihood tables and scores stay in one place, only text is translated. */

const EN = {};

Object.assign(EN, {

/* ============================ 1. APPENDICITIS ============================ */
appendicitis: {
  name: 'Acute appendicitis',
  short: 'Right iliac fossa pain, migration, local peritonitis. Alvarado score, imaging, early appendectomy.',
  pearls: [
    'Migration of pain to the right iliac fossa is the most specific historical feature.',
    'In women of childbearing age always exclude gynaecological pathology and pregnancy.',
    'CT is the most accurate test in adults; ultrasound is first-line in children and pregnancy.'
  ],
  redFlags: [
    'Generalised peritonitis or free air — emergency surgery without delaying for imaging.',
    'Periappendiceal abscess > 3–4 cm — drainage before appendectomy.',
    'Septic shock, lactate > 4 — resuscitation in parallel with the operating room.'
  ],
  diff: {
    a: 'Acute appendicitis',
    m: 'Mesenteric lymphadenitis',
    i: 'Terminal ileitis',
    u: 'Renal colic',
    g: 'Gynaecological pathology'
  },
  stages: {
    hx: {
      title: 'History and symptoms',
      findings: {
        migration: 'Pain migration to the right iliac fossa',
        anorexia: 'Anorexia',
        nausea: 'Nausea or vomiting after the pain started',
        fever: 'Temperature 37.5–38.5 °C',
        cough: 'Pain worsens with coughing or movement',
        dysuria: 'Dysuria or haematuria'
      }
    },
    ex: {
      title: 'Physical examination',
      findings: {
        mb: 'Tenderness at McBurney’s point',
        rebound: 'Rebound tenderness',
        guard: 'Guarding in the right iliac fossa',
        rovsing: 'Rovsing’s sign',
        obraztsov: 'Obraztsov’s sign',
        gyn: 'Adnexal tenderness or abnormal discharge',
        diffuse: 'Diffuse guarding and peritoneal signs'
      }
    },
    lab: {
      title: 'Laboratory tests',
      findings: {
        wbc: 'White cell count > 11 × 10⁹/L',
        shift: 'Neutrophils > 75% or a left shift',
        crp: 'CRP > 10 mg/L',
        leu: 'Leucocyturia or microscopic haematuria',
        lact: 'Lactate > 2 mmol/L'
      }
    },
    img: {
      title: 'Imaging',
      findings: {
        us: 'Ultrasound: appendix > 6 mm, non-compressible, no peristalsis',
        nodes: 'Ultrasound/CT: enlarged mesenteric lymph nodes',
        ct: 'CT: enlarged appendix with periappendiceal inflammation',
        stone: 'CT/ultrasound: renal or ureteric stone',
        ileitis: 'CT: terminal ileum wall thickening',
        abscess: 'CT: periappendiceal abscess, phlegmon or perforation',
        freeair: 'Free intraperitoneal air'
      }
    }
  },
  score: {
    name: 'Alvarado (MANTRELS)',
    items: ['Pain migration', 'Anorexia', 'Nausea/vomiting', 'RIF tenderness', 'Rebound tenderness', 'Fever', 'Leucocytosis', 'Left shift'],
    bands: [
      { label: 'Unlikely', note: 'Observation, look for alternatives, imaging as indicated.' },
      { label: 'Possible', note: 'Imaging (ultrasound/CT) and a decision on surgical management.' },
      { label: 'High probability', note: 'Surgical management without prolonged delay.' }
    ]
  },
  severity(s) {
    const drivers = [];
    if (Y(s, 'diffuse') || Y(s, 'freeair')) drivers.push('Generalised peritonitis / free air');
    if (Y(s, 'abscess')) drivers.push('Periappendiceal abscess or perforation');
    if (Y(s, 'lact')) drivers.push('Lactate > 2 mmol/L');
    if (!drivers.length && s.score && s.score.total >= 7) drivers.push('Alvarado ≥ 7');
    const level = drivers.length ? 'high' : (s.score && s.score.total >= 4 ? 'moderate' : 'low');
    return {
      level,
      label: level === 'high' ? 'Complicated appendicitis / peritonitis' : level === 'moderate' ? 'Uncomplicated probable appendicitis' : 'Low surgical suspicion',
      note: level === 'high'
        ? 'Emergency surgery; drain an abscess. Antibiotics for 4–7 days.'
        : level === 'moderate'
          ? 'Early appendectomy within 24 h; perioperative antibiotics.'
          : 'Continue observation and the differential work-up; reassess in 4–6 h.',
      drivers
    };
  },
  plan(s) {
    const comp = Y(s, 'abscess') || Y(s, 'freeair') || Y(s, 'diffuse');
    const blocks = [
      {
        tone: 'urgent', title: 'Immediate actions', items: [
          'Admit to emergency surgery; surgical review.',
          'Nil by mouth, crystalloid infusion, analgesia (paracetamol 1 g IV; opioids as required).',
          'Monitor heart rate, blood pressure, temperature and urine output; repeat abdominal examination every 2–4 h.',
          comp ? 'If unstable — resuscitate in parallel and transfer to the operating room.' : 'Reassess in 4–6 h if managed conservatively.'
        ]
      },
      {
        tone: 'drug', title: 'Antibiotic therapy', items: [
          'Start before surgery: ceftriaxone 2 g IV once daily + metronidazole 500 mg IV three times daily.',
          s.patient.penAllergy
            ? 'Penicillin allergy: ceftriaxone is acceptable for non-anaphylactic reactions; with anaphylaxis give ciprofloxacin 400 mg IV twice daily + metronidazole.'
            : 'Alternative: amoxicillin/clavulanate 1.2 g IV three times daily.',
          comp
            ? 'Complicated appendicitis: antibiotics for 4–7 days, reviewed against cultures.'
            : 'Uncomplicated appendicitis: 24 h perioperatively; no further antibiotics.',
          LOW_RENAL(s) ? 'eGFR < 30: adjust doses for renal function; avoid nephrotoxic combinations.' : 'Adjust doses if eGFR < 30.'
        ]
      },
      {
        tone: 'proc', title: 'Surgical treatment', items: [
          'Laparoscopic appendectomy is the procedure of choice, within 24 h of admission.',
          comp && Y(s, 'abscess')
            ? 'Abscess > 3–4 cm: percutaneous drainage under ultrasound/CT + antibiotics; appendectomy delayed (6–8 weeks) or if drainage fails.'
            : 'With a periappendiceal mass — conservative treatment and interval appendectomy.',
          'Generalised peritonitis: emergency laparoscopy or laparotomy, lavage and abdominal drainage.',
          s.patient.pregnant
            ? 'Pregnancy: laparoscopy is acceptable in the second trimester; open access in the third; MRI if the picture is unclear.'
            : 'If the picture is unclear in young women — MRI instead of repeat CT.'
        ]
      },
      {
        tone: 'monitor', title: 'Observation and prevention', items: [
          'VTE prophylaxis with LMWH unless contraindicated.',
          'White cell count and CRP on days 1–3; ultrasound/CT if there is no improvement.',
          'With conservative management — repeat imaging and readiness for surgery.'
        ]
      },
      {
        tone: 'avoid', title: 'What to avoid', items: [
          'Do not give laxatives or cleansing enemas.',
          'Do not delay surgery for peritonitis in order to “complete the work-up”.',
          'Avoid NSAIDs if eGFR < 30 and there are signs of renal dysfunction.'
        ]
      }
    ];
    if (!comp) {
      blocks[2].items.push('Alternative in selected patients: antibiotics + observation (20–30% recurrence within 5 years; repeat assessment required).');
    }
    return blocks;
  }
},

/* ============================ 2. CHOLECYSTITIS ============================ */
cholecystitis: {
  name: 'Acute cholecystitis',
  short: 'Right upper quadrant pain, Murphy’s sign, fever. Tokyo 2018 grade, early cholecystectomy.',
  pearls: [
    'Murphy’s sign on ultrasound is more informative than on palpation.',
    'Jaundice and a dilated common bile duct — look for choledocholithiasis and cholangitis.',
    'Early laparoscopic cholecystectomy (within 72 h) shortens hospital stay and reduces complications.'
  ],
  redFlags: [
    'Fever with rigors, jaundice, hypotension — cholangitis; ERCP within 24 h.',
    'Organ dysfunction — Tokyo III; resuscitate before surgery.',
    'Gallbladder perforation or perivesicular abscess — emergency surgery or drainage.'
  ],
  diff: {
    c: 'Acute cholecystitis',
    b: 'Biliary colic',
    ch: 'Cholangitis',
    p: 'Acute pancreatitis',
    ul: 'Peptic ulcer exacerbation',
    h: 'Hepatitis'
  },
  stages: {
    hx: {
      title: 'History and symptoms',
      findings: {
        pain: 'Right upper quadrant pain > 6 h radiating to the shoulder or scapula',
        food: 'Relationship to fatty food',
        nausea: 'Nausea or vomiting',
        fever: 'Fever > 38 °C with rigors',
        jaundice: 'Jaundice or dark urine',
        ulcerhx: 'History of ulcer disease or NSAID use',
        late: 'Symptoms lasting > 72 h'
      }
    },
    ex: {
      title: 'Physical examination',
      findings: {
        murphy: 'Murphy’s sign',
        ruq: 'Right upper quadrant tenderness',
        mass: 'Palpable gallbladder or Courvoisier’s sign',
        guard: 'Guarding in the right upper quadrant',
        portal: 'Signs of cirrhosis or portal hypertension'
      }
    },
    lab: {
      title: 'Laboratory tests',
      findings: {
        wbc: 'White cell count > 18 × 10⁹/L',
        crp: 'CRP > 30 mg/L',
        bili: 'Bilirubin > 34 µmol/L',
        alp: 'ALP or GGT > 2 × upper limit of normal',
        lipase: 'Lipase > 3 × upper limit of normal',
        alt: 'ALT or AST > 200 U/L',
        organ: 'Organ dysfunction: hypotension, creatinine > 177 µmol/L, platelets < 100 × 10⁹/L, SpO₂ < 90%'
      }
    },
    img: {
      title: 'Imaging',
      findings: {
        us: 'Ultrasound: wall > 3 mm, perivesicular fluid, sonographic Murphy’s sign',
        stones: 'Ultrasound: gallstones',
        cbd: 'Ultrasound/MRCP: common bile duct > 8 mm or a stone within it',
        ct: 'CT: perivesicular inflammation, abscess or perforation'
      }
    }
  },
  score: null,
  severity(s) {
    const drivers = [];
    if (Y(s, 'organ')) drivers.push('Organ dysfunction (Tokyo III)');
    if (Y(s, 'wbc')) drivers.push('White cell count > 18 × 10⁹/L');
    if (Y(s, 'mass')) drivers.push('Palpable mass');
    if (Y(s, 'late')) drivers.push('Symptoms > 72 h');
    if (Y(s, 'ct')) drivers.push('Complicated cholecystitis on imaging');
    const grade = Y(s, 'organ') ? 3 : drivers.length ? 2 : 1;
    return {
      level: grade === 3 ? 'high' : grade === 2 ? 'moderate' : 'low',
      label: 'Tokyo 2018, grade ' + grade,
      note: grade === 3
        ? 'Severe cholecystitis with organ dysfunction: resuscitation, delayed surgery, cholecystostomy if unfit for surgery.'
        : grade === 2
          ? 'Moderate severity: early cholecystectomy; ERCP if there is choledocholithiasis.'
          : 'Mild disease: early laparoscopic cholecystectomy within 24–72 h.',
      drivers
    };
  },
  plan(s) {
    const g3 = Y(s, 'organ');
    const cholangitis = Y(s, 'fever') && Y(s, 'jaundice') && (Y(s, 'cbd') || Y(s, 'bili'));
    return [
      {
        tone: 'urgent', title: 'Immediate actions', items: [
          'Admit to surgery; nil by mouth, fluids, analgesia (paracetamol, opioids), antiemetics.',
          cholangitis ? 'Suspected cholangitis: ERCP with sphincterotomy and stenting within 24 h; antibiotics immediately.' : 'Assess Tokyo 2018 severity and comorbidity risk.',
          'Monitor vital signs, urine output, bilirubin and white cell count.'
        ]
      },
      {
        tone: 'drug', title: 'Antibiotic therapy', items: [
          s.patient.penAllergy
            ? 'Penicillin allergy: ceftriaxone 2 g IV once daily + metronidazole 500 mg IV three times daily (with anaphylaxis — ciprofloxacin + metronidazole).'
            : 'Cefazolin 2 g IV three times daily (grade I) or amoxicillin/clavulanate 1.2 g IV three times daily.',
          g3 ? 'Grade III: piperacillin/tazobactam 4.5 g IV three to four times daily, or a carbapenem for severe infection.' : 'Grade II: ceftriaxone 2 g IV once daily + metronidazole 500 mg three times daily.',
          'Duration: 24 h after uncomplicated cholecystectomy; 4–7 days in complicated disease.',
          LOW_RENAL(s) ? 'eGFR < 30: adjust doses; ceftriaxone is preferred without a loading adjustment.' : 'Adjust doses if eGFR < 30.'
        ]
      },
      {
        tone: 'proc', title: 'Surgical treatment', items: [
          'Laparoscopic cholecystectomy is the procedure of choice; early (within 24–72 h) is preferable to delayed.',
          cholangitis || Y(s, 'cbd')
            ? 'Choledocholithiasis: ERCP before or during surgery, then cholecystectomy.'
            : 'With high operative risk — percutaneous cholecystostomy under ultrasound, cholecystectomy after stabilisation.',
          g3 ? 'Grade III: resuscitation and organ support, surgery after stabilisation; cholecystostomy if unfit for surgery.' : 'Intraoperative cholangiography as indicated.',
          s.patient.pregnant ? 'Pregnancy: laparoscopy is preferred in the second trimester; ERCP with shielding for choledocholithiasis.' : 'Conversion for technical difficulty is a safe decision, not a complication.'
        ]
      },
      {
        tone: 'monitor', title: 'After surgery', items: [
          'Early mobilisation, enteral nutrition on the first day.',
          'Check bilirubin, ALP and white cell count; ultrasound for bile leak or fever.',
          'VTE prophylaxis with LMWH unless contraindicated.'
        ]
      },
      {
        tone: 'avoid', title: 'What to avoid', items: [
          'Do not delay ERCP in cholangitis.',
          'Avoid NSAIDs if eGFR < 30.',
          'Do not perform cholecystectomy in an unstable patient without prior drainage.'
        ]
      }
    ];
  }
},

/* ============================ 3. PANCREATITIS ============================ */
pancreatitis: {
  name: 'Acute pancreatitis',
  short: 'Band-like epigastric pain, lipase > 3 × ULN. BISAP, lactated Ringer’s, early feeding, step-up for necrosis.',
  pearls: [
    'Lipase > 3 × upper limit of normal with characteristic pain is sufficient for the diagnosis.',
    'Do not give prophylactic antibiotics for sterile necrosis.',
    'Contrast-enhanced CT is informative after 72 h; early CT underestimates necrosis.'
  ],
  redFlags: [
    'Persistent organ failure > 48 h — severe pancreatitis, ICU.',
    'Cholangitis in biliary pancreatitis — ERCP within 24 h.',
    'Infected necrosis — step-up: drainage, then necrosectomy.'
  ],
  diff: {
    p: 'Acute pancreatitis',
    c: 'Acute cholecystitis',
    ul: 'Perforated ulcer',
    mi: 'Mesenteric ischaemia',
    cs: 'Cardiac pain',
    ge: 'Gastroenteritis'
  },
  stages: {
    hx: {
      title: 'History and symptoms',
      findings: {
        band: 'Band-like pain radiating to the back',
        lean: 'Pain relieved by leaning forward',
        etio: 'Gallstones, alcohol or hypertriglyceridaemia in the history',
        recur: 'Previous episodes of similar pain',
        nausea: 'Nausea and vomiting without pain relief',
        diarrhea: 'Diarrhoea'
      }
    },
    ex: {
      title: 'Physical examination',
      findings: {
        epi: 'Epigastric tenderness',
        guard: 'Guarding or peritoneal signs',
        distend: 'Abdominal distension, ileus',
        shock: 'Hypotension or tachycardia',
        cullen: 'Cullen’s or Grey Turner’s bruising',
        jaundice: 'Jaundice',
        sirs: 'Systemic inflammatory response (≥ 2 criteria)',
        gcs: 'Reduced consciousness (GCS < 15)'
      }
    },
    lab: {
      title: 'Laboratory tests',
      findings: {
        lipase: 'Lipase > 3 × upper limit of normal',
        amylase: 'Amylase > 3 × upper limit of normal',
        alt: 'ALT > 150 U/L',
        glyc: 'Hyperglycaemia or hypocalcaemia',
        hct: 'Haematocrit > 44% or rising urea nitrogen',
        lact: 'Lactate > 2 mmol/L or metabolic acidosis',
        trop: 'Raised troponin or ischaemic ECG changes',
        bun: 'Urea nitrogen > 7.1 mmol/L (BUN > 20 mg/dL)',
        organ: 'Organ failure: hypotension, SpO₂ < 90% or creatinine > 170 µmol/L'
      }
    },
    img: {
      title: 'Imaging',
      findings: {
        us: 'Ultrasound: gallstones, dilated common bile duct',
        effusion: 'Pleural effusion (ultrasound/radiography)',
        ct: 'Contrast-enhanced CT: oedema, necrosis, peripancreatic fluid',
        freeair: 'CT/plain film: free air or pneumatosis intestinalis',
        cta: 'CT angiography: superior mesenteric artery occlusion'
      }
    }
  },
  score: {
    name: 'BISAP',
    items: ['BUN > 20 mg/dL', 'GCS < 15', 'SIRS ≥ 2', 'Age > 60', 'Pleural effusion'],
    bands: [
      { label: 'Low risk', note: 'Mild pancreatitis: ward care, early feeding, fluids.' },
      { label: 'Moderate risk', note: 'Assess organ function every 12 h; be ready for ICU.' },
      { label: 'High risk', note: 'Severe pancreatitis: ICU, aggressive nutritional support, repeat imaging.' }
    ]
  },
  severity(s) {
    const drivers = [];
    if (Y(s, 'organ')) drivers.push('Organ failure');
    if (Y(s, 'sirs')) drivers.push('SIRS ≥ 2 criteria');
    if (Y(s, 'ct') || Y(s, 'effusion')) drivers.push('Local complications on imaging');
    if (s.score && s.score.total >= 3) drivers.push('BISAP ≥ 3');
    const level = Y(s, 'organ') ? 'high' : drivers.length ? 'moderate' : 'low';
    return {
      level,
      label: level === 'high' ? 'Severe pancreatitis' : level === 'moderate' ? 'Moderately severe pancreatitis' : 'Mild pancreatitis',
      note: level === 'high'
        ? 'Persistent organ failure: ICU, fluid restriction after resuscitation, enteral nutrition.'
        : level === 'moderate'
          ? 'Local complications or transient failure: observation, CT at 72 h.'
          : 'Early enteral nutrition and early discharge once recovering.',
      drivers
    };
  },
  plan(s) {
    const biliary = Y(s, 'etio') && (Y(s, 'alt') || Y(s, 'us'));
    return [
      {
        tone: 'urgent', title: 'Immediate actions', items: [
          'Admit; ICU for severe disease. Nil by mouth only during vomiting and ileus.',
          'Lactated Ringer’s 5–10 mL/kg/h in the first hours, then 1.5–3 mL/kg/h, reassessed every 6 h.',
          'Analgesia (paracetamol, opioids), antiemetics (ondansetron 4–8 mg IV), glucose control.',
          'Assess BISAP, SIRS, organ function, haematocrit and urea at 12 and 24 h.'
        ]
      },
      {
        tone: 'drug', title: 'Medical therapy', items: [
          'Prophylactic antibiotics for sterile necrosis are not indicated.',
          'Infected necrosis: meropenem 1 g IV three times daily or piperacillin/tazobactam 4.5 g three to four times daily.',
          'For alcoholic aetiology — thiamine 100 mg IV, then 100 mg/day.',
          LOW_RENAL(s) ? 'eGFR < 30: dose the carbapenem for renal function; avoid aminoglycosides.' : 'Adjust doses if eGFR < 30.',
          'Avoid NSAIDs when there is a risk of acute kidney injury.'
        ]
      },
      {
        tone: 'proc', title: 'Endoscopy and surgery', items: [
          biliary ? 'Biliary pancreatitis: early cholecystectomy during the same admission if mild; ERCP within 24 h only for cholangitis or persistent obstruction.' : 'ERCP is not indicated without cholangitis or duct obstruction.',
          'Infected necrosis after ≥ 4 weeks: step-up — percutaneous or endoscopic drainage, then necrosectomy if it fails.',
          'Early surgery for sterile necrosis is not indicated.',
          'With abdominal hypertension — measure intra-abdominal pressure and decompress.'
        ]
      },
      {
        tone: 'monitor', title: 'Nutrition and observation', items: [
          'Early enteral nutrition (oral or nasogastric) within 24–48 h as tolerated.',
          'Parenteral nutrition only if enteral feeding is not tolerated for 5–7 days.',
          'Repeat contrast-enhanced CT if the patient deteriorates or does not improve by 72 h.',
          'VTE prophylaxis with LMWH unless contraindicated.'
        ]
      },
      {
        tone: 'avoid', title: 'What to avoid', items: [
          'Do not prescribe prophylactic antibiotics.',
          'Do not perform early necrosectomy for sterile necrosis.',
          'Do not overload with fluids: excess fluid worsens outcomes in severe pancreatitis.'
        ]
      }
    ];
  }
}
,

/* ============================ 4. DIVERTICULITIS ============================ */
diverticulitis: {
  name: 'Acute diverticulitis',
  short: 'Left lower quadrant pain, fever, leucocytosis. CT, Hinchey stage, selective antibiotics, abscess drainage.',
  pearls: [
    'Contrast-enhanced CT is the standard for diagnosis and Hinchey staging.',
    'Antibiotics are not required for every uncomplicated case: the decision depends on the clinical picture and risk factors.',
    'Colonoscopy 6–8 weeks after the episode to exclude a tumour.'
  ],
  redFlags: [
    'Free air or generalised peritonitis — Hinchey III–IV, emergency surgery.',
    'Abscess > 3–4 cm — percutaneous drainage.',
    'Immunosuppression and sepsis — a low threshold for admission and CT.'
  ],
  diff: {
    d: 'Acute diverticulitis',
    a: 'Acute appendicitis',
    col: 'Colitis (infectious, ischaemic)',
    ca: 'Complicated colorectal cancer',
    per: 'Gynaecological pathology'
  },
  stages: {
    hx: {
      title: 'History and symptoms',
      findings: {
        llq: 'Constant left lower quadrant pain',
        fever: 'Fever',
        stool: 'Change in bowel habit (diarrhoea or constipation)',
        prior: 'Previous episodes of diverticulitis',
        blood: 'Blood in the stool',
        weight: 'Weight loss or anaemia in the history'
      }
    },
    ex: {
      title: 'Physical examination',
      findings: {
        tender: 'Left lower quadrant tenderness',
        guard: 'Localised guarding',
        mass: 'Palpable mass or inflammatory mass',
        diffuse: 'Diffuse peritoneal signs',
        distend: 'Abdominal distension or asymmetry'
      }
    },
    lab: {
      title: 'Laboratory tests',
      findings: {
        wbc: 'White cell count > 12 × 10⁹/L',
        crp: 'CRP > 50 mg/L',
        anemia: 'Haemoglobin < 110 g/L',
        lact: 'Lactate > 2 mmol/L'
      }
    },
    img: {
      title: 'Imaging',
      findings: {
        ct: 'Contrast-enhanced CT: diverticula, wall thickening, pericolic fat stranding',
        abscess: 'CT: abscess, extraluminal gas or perforation',
        tumor: 'CT: mass, stenosis or enlarged lymph nodes',
        us: 'Ultrasound: wall thickening, diverticulum, inflammatory mass'
      }
    }
  },
  score: null,
  severity(s) {
    const drivers = [];
    if (Y(s, 'abscess')) drivers.push('Abscess or extraluminal gas');
    if (Y(s, 'diffuse')) drivers.push('Diffuse peritonitis');
    if (Y(s, 'lact')) drivers.push('Lactate > 2 mmol/L');
    const level = (Y(s, 'diffuse') || Y(s, 'abscess')) ? 'high' : drivers.length ? 'moderate' : 'low';
    const h = Y(s, 'diffuse') && Y(s, 'abscess') ? 'Hinchey III–IV' : Y(s, 'abscess') ? 'Hinchey II (abscess)' : 'Hinchey I / uncomplicated';
    return {
      level,
      label: h,
      note: level === 'high'
        ? 'Purulent or faecal peritonitis: resuscitation and emergency surgery; abscess — drainage.'
        : level === 'moderate'
          ? 'Complicated diverticulitis without generalised peritonitis: drainage and antibiotics, observation.'
          : 'Uncomplicated diverticulitis: outpatient management is possible in stable patients.',
      drivers
    };
  },
  plan(s) {
    const complicated = Y(s, 'abscess') || Y(s, 'diffuse') || Y(s, 'lact');
    const peritonitis = Y(s, 'diffuse');
    const antibioticNote = s.patient.immuno
      ? 'Immunosuppression: antibiotics are mandatory, with a low threshold for admission and CT.'
      : 'Antibiotics are mandatory with sepsis, pregnancy or severe disease.';
    return [
      {
        tone: 'urgent', title: 'Management and disposition', items: [
          peritonitis ? 'Emergency surgery: laparotomy or laparoscopy, lavage, resection of the affected segment.' : 'Admit with fever, leucocytosis, inability to tolerate fluids, immunosuppression or complicated disease.',
          'Liquid diet, analgesia (paracetamol; opioids with caution), antiemetics.',
          'Hinchey staging and a decision on drainage versus surgery.'
        ]
      },
      {
        tone: 'drug', title: 'Antibiotic therapy', items: [
          'Uncomplicated diverticulitis without risk factors: antibiotics may be omitted; if given — amoxicillin/clavulanate 875/125 mg orally twice daily for 5–7 days.',
          s.patient.penAllergy
            ? 'Penicillin allergy: ciprofloxacin 500 mg orally twice daily + metronidazole 500 mg three times daily for 7 days.'
            : 'Alternative: ciprofloxacin 500 mg twice daily + metronidazole 500 mg three times daily.',
          complicated ? 'Complicated diverticulitis: ceftriaxone 2 g IV once daily + metronidazole 500 mg IV three times daily for 7–10 days.' : antibioticNote,
          LOW_RENAL(s) ? 'eGFR < 30: adjust doses; avoid combinations that worsen renal function.' : 'Adjust doses if eGFR < 30.'
        ]
      },
      {
        tone: 'proc', title: 'Drainage and surgery', items: [
          Y(s, 'abscess') ? 'Abscess > 3–4 cm: percutaneous drainage under CT/ultrasound + antibiotics; surgery if it fails.' : 'Abscesses < 3 cm usually respond to antibiotics.',
          peritonitis ? 'Hinchey III–IV: emergency resection (Hartmann’s procedure or resection with anastomosis in clean conditions) and lavage.' : 'Elective surgery is discussed after the inflammation settles in recurrent disease.',
          'Laparoscopic access is acceptable in stable patients with purulent peritonitis.'
        ]
      },
      {
        tone: 'monitor', title: 'Observation', items: [
          'Reassess at 24–48 h: temperature, abdomen, white cell count, CRP.',
          'CT if there is no improvement — exclude an abscess or a wrong diagnosis.',
          'Colonoscopy at 6–8 weeks to exclude a tumour.',
          'VTE prophylaxis with LMWH unless contraindicated.'
        ]
      },
      {
        tone: 'avoid', title: 'What to avoid', items: [
          'Do not perform colonoscopy in the acute phase.',
          'Do not prescribe antibiotics routinely for uncomplicated disease without risk factors.',
          'Do not delay surgery in generalised peritonitis.'
        ]
      }
    ];
  }
},

/* ============================ 5. INCARCERATED HERNIA ============================ */
hernia: {
  name: 'Incarcerated hernia',
  short: 'Irreducible tender lump, features of bowel obstruction. Emergency surgery; reduction only under strict criteria.',
  pearls: [
    'Pain, tension and irreducibility form the triad of incarceration.',
    'An absent cough impulse points to incarcerated contents.',
    'Attempted reduction is contraindicated with strangulation, peritonitis or instability.'
  ],
  redFlags: [
    'Skin erythema over the hernia or peritoneal signs — strangulation, immediate surgery.',
    'Features of bowel obstruction — nasogastric tube, fluids, surgery.',
    'Lactate > 2 and tachycardia — risk of bowel necrosis.'
  ],
  diff: {
    h: 'Incarcerated hernia',
    ir: 'Irreducible hernia without incarceration',
    lip: 'Lipoma or cyst',
    ln: 'Lymphadenopathy',
    tt: 'Testicular torsion',
    aa: 'Vascular pathology'
  },
  stages: {
    hx: {
      title: 'History and symptoms',
      findings: {
        sudden: 'Sudden pain in a previously existing hernia',
        irreducible: 'The hernia is no longer reducible',
        obst: 'Nausea, vomiting, distension, no stool or flatus',
        chronic: 'Long-standing hernia that used to be reducible',
        syncope: 'Syncope or presyncope'
      }
    },
    ex: {
      title: 'Physical examination',
      findings: {
        tender: 'Tense, exquisitely tender hernia',
        cough: 'Absent cough impulse',
        skin: 'Erythema or thinning of the skin over the swelling',
        perit: 'Peritoneal signs or diffuse tenderness',
        obstexam: 'Distension, tympany, hyperactive bowel sounds',
        pulse: 'Absent pulses or a cold limb'
      }
    },
    lab: {
      title: 'Laboratory tests',
      findings: {
        wbc: 'White cell count > 11 × 10⁹/L',
        lact: 'Lactate > 2 mmol/L or acidosis',
        crp: 'CRP > 20 mg/L',
        renal: 'Rising creatinine or electrolyte disturbance'
      }
    },
    img: {
      title: 'Imaging',
      findings: {
        us: 'Ultrasound: incarcerated contents, absent peristalsis or blood flow',
        ct: 'CT: incarceration, strangulation, dilated loops, free air',
        angio: 'CT angiography or Doppler: vascular occlusion'
      }
    }
  },
  score: {
    name: 'Strangulation risk index (approximate)',
    items: ['Sudden pain', 'Irreducibility', 'Skin changes', 'Peritoneal signs', 'Obstruction signs', 'Lactate > 2'],
    bands: [
      { label: 'Low risk', note: 'Urgent surgical review; observation and imaging.' },
      { label: 'Intermediate risk', note: 'Urgent surgery after brief preparation.' },
      { label: 'High strangulation risk', note: 'Emergency surgery; do not attempt reduction.' }
    ]
  },
  severity(s) {
    const drivers = [];
    if (Y(s, 'perit')) drivers.push('Peritoneal signs');
    if (Y(s, 'skin')) drivers.push('Skin changes over the hernia');
    if (Y(s, 'obstexam') || Y(s, 'obst')) drivers.push('Bowel obstruction');
    if (Y(s, 'lact')) drivers.push('Lactate > 2 mmol/L');
    const level = (Y(s, 'perit') || Y(s, 'skin') || Y(s, 'lact')) ? 'high' : drivers.length ? 'moderate' : 'low';
    return {
      level,
      label: level === 'high' ? 'Strangulation / bowel necrosis' : level === 'moderate' ? 'Incarceration with strangulation risk' : 'Irreducible hernia without strangulation',
      note: level === 'high'
        ? 'Emergency surgery, resection of non-viable bowel, repair without mesh in the infected field.'
        : level === 'moderate'
          ? 'Urgent surgery after brief preparation; inpatient observation.'
          : 'The surgeon decides between urgent and elective repair.',
      drivers
    };
  },
  plan(s) {
    const strang = Y(s, 'skin') || Y(s, 'perit') || Y(s, 'lact');
    return [
      {
        tone: 'urgent', title: 'Immediate actions', items: [
          'Emergency admission to surgery; call the surgeon and anaesthetist.',
          'Nil by mouth, nasogastric tube for obstruction, crystalloids, urinary catheter and hourly urine output.',
          'Analgesia, electrolyte correction, monitoring.',
          'Do not attempt reduction when strangulation is suspected.'
        ]
      },
      {
        tone: 'proc', title: 'Surgical treatment', items: [
          'Emergency herniotomy: inspect the contents and assess bowel viability.',
          'Bowel necrosis — resection with anastomosis (stable patient, clean field) or a stoma.',
          'Hernia repair: tissue repair only in the infected field, no mesh.',
          strang ? 'With strangulation and peritonitis — laparotomy or laparoscopy with lavage; mesh is not used.' : 'Without strangulation, laparoscopic or open mesh repair is possible.'
        ]
      },
      {
        tone: 'drug', title: 'Medical support', items: [
          'Cefazolin 2 g IV + metronidazole 500 mg IV before surgery; continue for 24–48 h after bowel resection.',
          s.patient.penAllergy
            ? 'Penicillin allergy: replace cefazolin with clindamycin 600–900 mg IV + gentamicin (dosed for eGFR) or ciprofloxacin + metronidazole.'
            : 'Alternative: amoxicillin/clavulanate 1.2 g IV three times daily.',
          s.patient.anticoag ? 'Anticoagulants: assess the need for reversal before surgery with the anaesthetist.' : 'VTE prophylaxis with LMWH after surgery.',
          LOW_RENAL(s) ? 'eGFR < 30: adjust antibiotic doses and fluid therapy.' : 'Adjust doses if eGFR < 30.'
        ]
      },
      {
        tone: 'monitor', title: 'After surgery', items: [
          'Watch bowel function, urine output, signs of bowel ischaemia and sepsis.',
          'Check white cell count, lactate and electrolytes; ultrasound/CT if the patient deteriorates.',
          'Early mobilisation, VTE prophylaxis, analgesia.'
        ]
      },
      {
        tone: 'avoid', title: 'What to avoid', items: [
          'Do not force reduction in strangulation — risk of perforation and peritonitis.',
          'Do not use mesh in an infected field.',
          'Do not delay surgery for CT in an unstable patient.'
        ]
      }
    ];
  }
},

/* ============================ 6. PERFORATED ULCER ============================ */
perforation: {
  name: 'Perforated peptic ulcer',
  short: 'Sudden severe pain, board-like abdomen, free air. Boey score, emergency repair, PPI and antibiotics.',
  pearls: [
    'Free air under the diaphragm is seen on plain radiography in 70–80%.',
    'CT is more accurate than plain film when the picture is equivocal and the patient is stable.',
    'Omental patch repair (Graham’s procedure) is the standard of emergency care.'
  ],
  redFlags: [
    'Shock on admission and comorbidity — Boey 2–3, high mortality.',
    'Symptoms > 24 h — worse prognosis, aggressive resuscitation.',
    'Peritonitis with multiorgan failure — damage control.'
  ],
  diff: {
    ul: 'Perforated ulcer',
    dv: 'Perforated diverticulitis',
    ap: 'Perforated appendicitis',
    p: 'Pancreatitis',
    mi: 'Mesenteric ischaemia',
    c: 'Cholecystitis'
  },
  stages: {
    hx: {
      title: 'History and symptoms',
      findings: {
        sudden: 'Sudden “dagger-like” pain',
        epi: 'Onset in the epigastrium spreading across the abdomen',
        ulcerhx: 'History of ulcer disease, NSAIDs or glucocorticoids',
        priorpain: 'Previous epigastric pain relieved by antacids',
        vomit: 'Nausea and vomiting',
        divert: 'History of diverticulosis',
        af: 'Atrial fibrillation or atherosclerosis',
        late: 'Symptoms lasting > 24 h',
        comorbid: 'Severe comorbidity (heart failure, COPD, cirrhosis, cancer)'
      }
    },
    ex: {
      title: 'Physical examination',
      findings: {
        rigid: 'Board-like abdomen, rigidity',
        liver: 'Loss of liver dullness',
        epiT: 'Diffuse tenderness maximal in the epigastrium',
        shock: 'Hypotension, tachycardia or shock',
        distend: 'Distension, absent bowel sounds'
      }
    },
    lab: {
      title: 'Laboratory tests',
      findings: {
        wbc: 'White cell count > 12 × 10⁹/L',
        lact: 'Lactate > 2 mmol/L',
        lipase: 'Lipase > 3 × upper limit of normal',
        bili: 'Raised bilirubin or ALP',
        amylase: 'Moderately raised amylase'
      }
    },
    img: {
      title: 'Imaging',
      findings: {
        xray: 'Plain radiography: free air under the diaphragm',
        ct: 'CT: free air, fluid, wall thickening, defect',
        us: 'Ultrasound: free fluid, gas',
        cta: 'CT angiography: mesenteric vascular occlusion'
      }
    }
  },
  score: {
    name: 'Boey',
    items: ['Comorbidity', 'Shock on admission', 'Symptoms > 24 h'],
    bands: [
      { label: 'Low risk', note: 'Low mortality; laparoscopic repair.' },
      { label: 'High risk', note: 'Mortality 10–20%; resuscitate and decide on the extent of surgery.' },
      { label: 'Very high risk', note: 'Mortality up to 40%; damage control, ICU.' }
    ]
  },
  severity(s) {
    const drivers = [];
    if (Y(s, 'shock')) drivers.push('Shock on admission');
    if (Y(s, 'comorbid')) drivers.push('Severe comorbidity');
    if (Y(s, 'late')) drivers.push('Late presentation (> 24 h)');
    if (Y(s, 'lact')) drivers.push('Lactate > 2 mmol/L');
    const boey = s.score ? s.score.total : 0;
    const level = boey >= 3 || Y(s, 'shock') ? 'high' : boey === 2 ? 'moderate' : 'low';
    return {
      level,
      label: 'Boey ' + boey + (Y(s, 'rigid') ? ' · generalised peritonitis' : ''),
      note: level === 'high'
        ? 'High risk: ICU, minimally invasive repair or damage control, broad-spectrum antibiotics.'
        : level === 'moderate'
          ? 'Laparoscopic repair after stabilisation, antibiotics and a PPI.'
          : 'Emergency laparoscopic repair with an omental patch.',
      drivers
    };
  },
  plan(s) {
    const unstable = Y(s, 'shock');
    const sealed = !Y(s, 'rigid') && !Y(s, 'shock') && !Y(s, 'lact') && !Y(s, 'late');
    return [
      {
        tone: 'urgent', title: 'Immediate actions', items: [
          'Emergency admission; call the surgeon and anaesthetist; ICU if unstable.',
          'Nil by mouth, nasogastric tube, two peripheral cannulas, crystalloid infusion.',
          'Analgesia, correction of electrolytes and acidosis; urine output monitoring.',
          'A single dose of antibiotics and a PPI IV before surgery.'
        ]
      },
      {
        tone: 'drug', title: 'Medical therapy', items: [
          'Omeprazole 80 mg IV bolus, then 8 mg/h for 72 h or 40 mg IV twice daily.',
          s.patient.penAllergy ? 'Penicillin allergy: ciprofloxacin 400 mg IV twice daily + metronidazole 500 mg three times daily.' : 'Ceftriaxone 2 g IV once daily + metronidazole 500 mg IV three times daily.',
          s.patient.anticoag ? 'Anticoagulants: assess reversal before surgery with the anaesthetist.' : 'VTE prophylaxis with LMWH after surgery.',
          'H. pylori eradication after stabilisation (test and treat).'
        ]
      },
      {
        tone: 'proc', title: 'Surgical treatment', items: [
          'Emergency laparoscopy: omental patch repair, lavage of the abdominal cavity.',
          unstable ? 'If unstable with severe peritonitis — open access, damage control, delayed definitive surgery.' : 'Open access for technical difficulty or late presentation.',
          'Drainage as indicated; nasogastric decompression.',
          sealed ? 'Selected patients with a “sealed” perforation and no peritonitis may be managed conservatively (PPI, antibiotics, tube, observation) with readiness for surgery.' : 'Conservative management is not appropriate with free air and peritonitis.'
        ]
      },
      {
        tone: 'monitor', title: 'After surgery', items: [
          'ICU if Boey ≥ 2; monitor lactate, urine output and white cell count.',
          'PPI IV for 72 h, then orally for 4–8 weeks.',
          'Check haemoglobin and watch for repair failure.',
          'Early mobilisation, VTE prophylaxis.'
        ]
      },
      {
        tone: 'avoid', title: 'What to avoid', items: [
          'Avoid NSAIDs and glucocorticoids unless absolutely necessary.',
          'Do not delay surgery for a complete work-up in an unstable patient.',
          'Do not perform emergency gastrectomy without a clear indication.'
        ]
      }
    ];
  }
}
,

/* ============================ 7. BLEEDING ULCER ============================ */
bleeding: {
  name: 'Bleeding peptic ulcer',
  short: 'Haematemesis, melena, anaemia. Glasgow–Blatchford, high-dose PPI, endoscopic haemostasis, TAE or surgery.',
  pearls: [
    'Restrictive transfusion (Hb < 70 g/L) improves survival.',
    'Endoscopy within 24 h after stabilisation; if unstable — after resuscitation.',
    'Signs of cirrhosis change management: variceal bleeding is treated differently.'
  ],
  redFlags: [
    'Haemodynamic instability — resuscitate before endoscopy, two large-bore cannulas.',
    'Forrest Ia–IIb — high rebleeding risk, endoscopic haemostasis is mandatory.',
    'Rebleeding after endoscopy — repeat endoscopy, then TAE, then surgery.'
  ],
  diff: {
    ul: 'Bleeding ulcer',
    va: 'Variceal bleeding',
    mw: 'Mallory–Weiss syndrome',
    tu: 'Tumour',
    er: 'Erosive gastritis',
    ad: 'Angiodysplasia'
  },
  stages: {
    hx: {
      title: 'History and symptoms',
      findings: {
        hematemesis: 'Haematemesis or “coffee-ground” vomit',
        melena: 'Melena',
        ulcerhx: 'History of ulcer disease, NSAIDs or aspirin',
        cirrhosis: 'Cirrhosis, alcohol misuse or signs of portal hypertension',
        retch: 'Vomiting without blood beforehand',
        weight: 'Weight loss or dysphagia',
        syncope: 'Syncope or presyncope',
        hf: 'Chronic heart failure',
        anticoag: 'Anticoagulant or antiplatelet therapy'
      }
    },
    ex: {
      title: 'Physical examination',
      findings: {
        sbp: 'Systolic blood pressure < 100 mmHg',
        hr: 'Heart rate > 100 bpm',
        pale: 'Pallor, cold sweat, orthostasis',
        stig: 'Ascites, splenomegaly, spider naevi',
        mass: 'Palpable mass or cachexia',
        epiSoft: 'Soft abdomen with mild epigastric tenderness'
      }
    },
    lab: {
      title: 'Laboratory tests',
      findings: {
        hb: 'Haemoglobin < 100 g/L',
        urea: 'Urea > 6.5 mmol/L',
        plt: 'Platelets < 100 × 10⁹/L or INR > 1.5',
        wbc: 'Leucocytosis',
        liverlabs: 'Raised liver enzymes or bilirubin'
      }
    },
    endo: {
      title: 'Oesophagogastroduodenoscopy',
      findings: {
        endoActive: 'Endoscopy: active bleeding or a visible vessel (Forrest Ia–IIb)',
        varices: 'Endoscopy: oesophageal or gastric varices',
        mw: 'Endoscopy: mucosal tear at the cardia',
        tumor: 'Endoscopy: tumour or ulcer suspicious for malignancy',
        cta: 'CT angiography: contrast extravasation or vascular malformation'
      }
    }
  },
  score: {
    name: 'Glasgow–Blatchford (available criteria)',
    items: ['Hb < 100 g/L', 'Urea > 6.5', 'SBP < 100', 'HR > 100', 'Melena', 'Syncope', 'Liver disease', 'Cardiac failure'],
    bands: [
      { label: 'Very low risk', note: 'Outpatient care possible after active bleeding is excluded.' },
      { label: 'Intermediate risk', note: 'Admission, endoscopy within 24 h, high-dose PPI.' },
      { label: 'High risk', note: 'Resuscitation, endoscopy after stabilisation, ICU, readiness for TAE/surgery.' }
    ]
  },
  severity(s) {
    const gbs = s.score ? s.score.total : 0;
    const drivers = [];
    if (Y(s, 'sbp')) drivers.push('Systolic blood pressure < 100 mmHg');
    if (Y(s, 'endoActive')) drivers.push('Active bleeding Forrest Ia–IIb');
    if (Y(s, 'varices')) drivers.push('Variceal bleeding');
    if (gbs >= 7) drivers.push('Glasgow–Blatchford ≥ 7');
    const level = (Y(s, 'sbp') || Y(s, 'endoActive') || Y(s, 'varices') || gbs >= 7) ? 'high' : gbs >= 2 ? 'moderate' : 'low';
    return {
      level,
      label: level === 'high' ? 'Severe bleeding' : level === 'moderate' ? 'Moderate bleeding' : 'Low rebleeding risk',
      note: level === 'high'
        ? 'Resuscitation, high-dose PPI, endoscopic haemostasis after stabilisation; for varices — a vasoactive drug and band ligation.'
        : level === 'moderate'
          ? 'Admission, PPI, endoscopy within 24 h, observation for 48–72 h.'
          : 'Observation, PPI, early discharge if stable.',
      drivers
    };
  },
  plan(s) {
    const variceal = Y(s, 'varices') || (Y(s, 'cirrhosis') && Y(s, 'hematemesis'));
    return [
      {
        tone: 'urgent', title: 'Resuscitation', items: [
          'Two large-bore cannulas, monitoring, oxygen; if unstable — activate the massive transfusion protocol.',
          'Restrictive strategy: red cells if Hb < 70 g/L (< 80 with ischaemic heart disease).',
          'Correct coagulopathy according to bleeding, not numbers; reverse anticoagulants as indicated.',
          'A nasogastric tube is acceptable for assessment and decompression.'
        ]
      },
      {
        tone: 'drug', title: 'Medical therapy', items: [
          'Omeprazole 80 mg IV bolus, then 8 mg/h for 72 h (or pantoprazole by the same regimen).',
          variceal
            ? 'Variceal bleeding: terlipressin 2 mg IV every 4 h or octreotide 50 µg bolus + 50 µg/h; ceftriaxone 1 g/day for 7 days.'
            : 'Antibiotics are not routinely indicated in non-variceal bleeding.',
          'Continue an oral PPI for 8 weeks after haemostasis.',
          'After stabilisation — test for H. pylori and eradicate.'
        ]
      },
      {
        tone: 'proc', title: 'Endoscopy and intervention', items: [
          'Endoscopy within 24 h; if unstable — after resuscitation, but no later than 12 h.',
          'Haemostasis: injection + thermal coagulation or clips; band ligation for varices.',
          'Rebleeding: repeat endoscopy; if it fails — transarterial embolisation (TAE), then surgical underrunning.',
          s.patient.anticoag ? 'Anticoagulants: restart after haemostasis according to individual thrombotic risk.' : 'Antiplatelets: decide on restarting after endoscopy.'
        ]
      },
      {
        tone: 'monitor', title: 'Observation', items: [
          'Monitor Hb, haemodynamics and urine output; repeat bloods after 6–12 h.',
          'Forrest IIc–III — low rebleeding risk, early discharge possible.',
          'Prevention: avoid NSAIDs, use a PPI when needed, eradicate H. pylori.'
        ]
      },
      {
        tone: 'avoid', title: 'What to avoid', items: [
          'Do not transfuse red cells liberally when Hb > 80 g/L without ischaemia.',
          'Do not prescribe NSAIDs or continue anticoagulants without a risk assessment.',
          'Do not perform endoscopy in an unstable patient without resuscitation.'
        ]
      }
    ];
  }
},

/* ============================ 8. MESENTERIC ISCHAEMIA ============================ */
ischemia: {
  name: 'Acute mesenteric ischaemia',
  short: 'Pain out of proportion, atrial fibrillation, lactate. Immediate CT angiography, revascularisation, bowel resection.',
  pearls: [
    '“Pain out of proportion” is the key feature of superior mesenteric artery occlusion.',
    'CT angiography is the test of choice; do not wait for peritoneal signs.',
    'Time is bowel: every delay increases the extent of resection.'
  ],
  redFlags: [
    'Peritoneal signs — bowel necrosis, immediate surgery.',
    'Lactate > 4 and metabolic acidosis — high mortality.',
    'Atrial fibrillation with acute pain — SMA embolism until proven otherwise.'
  ],
  diff: {
    art: 'Arterial occlusion (embolism/thrombosis)',
    ven: 'Venous thrombosis',
    nomi: 'Non-occlusive ischaemia',
    okn: 'Bowel obstruction',
    p: 'Pancreatitis',
    perf: 'Hollow viscus perforation'
  },
  stages: {
    hx: {
      title: 'History and symptoms',
      findings: {
        disproportion: 'Pain out of proportion to the examination',
        af: 'Atrial fibrillation, valvular disease or previous thrombosis',
        athero: 'Atherosclerosis, coronary disease or gradually worsening pain',
        nausea: 'Nausea, vomiting, diarrhoea',
        blood: 'Blood in the stool',
        obst: 'No stool or flatus, distension',
        venrisk: 'Cancer, thrombophilia or previous venous thrombosis'
      }
    },
    ex: {
      title: 'Physical examination',
      findings: {
        soft: 'Soft abdomen, tenderness without peritoneal signs despite severe pain',
        perit: 'Peritoneal signs or rigidity',
        distend: 'Distension, tympany, succussion splash',
        aperist: 'Absent bowel sounds',
        murmur: 'Atrial fibrillation or a vascular bruit',
        shock: 'Hypotension or shock'
      }
    },
    lab: {
      title: 'Laboratory tests',
      findings: {
        lact: 'Lactate > 2 mmol/L',
        acid: 'Metabolic acidosis (pH < 7.30, BE < −4)',
        wbc: 'White cell count > 15 × 10⁹/L',
        ddim: 'D-dimer > 2 × upper limit of normal',
        amylase: 'Raised amylase or lipase',
        renal: 'Rising creatinine or hyperkalaemia'
      }
    },
    img: {
      title: 'CT angiography',
      findings: {
        cta: 'CT angiography: occlusion of the superior mesenteric artery or its branches',
        venous: 'CT: venous occlusion, mesenteric oedema',
        pneumatosis: 'CT: pneumatosis intestinalis or portal venous gas',
        levels: 'CT/plain film: dilated loops with air–fluid levels',
        wall: 'CT: bowel wall thickening, reduced enhancement'
      }
    }
  },
  score: null,
  severity(s) {
    const drivers = [];
    if (Y(s, 'perit')) drivers.push('Peritoneal signs — bowel necrosis');
    if (Y(s, 'lact')) drivers.push('Lactate > 2 mmol/L');
    if (Y(s, 'acid')) drivers.push('Metabolic acidosis');
    if (Y(s, 'shock')) drivers.push('Hypotension');
    const level = (Y(s, 'perit') || Y(s, 'acid') || Y(s, 'shock')) ? 'high' : drivers.length ? 'moderate' : 'low';
    return {
      level,
      label: level === 'high' ? 'Bowel necrosis / peritonitis' : level === 'moderate' ? 'Ischaemia without peritonitis' : 'Early ischaemia without transmural necrosis',
      note: level === 'high'
        ? 'Immediate surgery, resection of non-viable bowel, second look after 24–48 h.'
        : level === 'moderate'
          ? 'Immediate CT angiography, heparinisation, revascularisation; be ready for surgery.'
          : 'Urgent CT angiography and a decision on revascularisation.',
      drivers
    };
  },
  plan(s) {
    const peritonitis = Y(s, 'perit');
    const venous = Y(s, 'venous');
    return [
      {
        tone: 'urgent', title: 'Immediate actions', items: [
          'ICU, nil by mouth, nasogastric tube, two cannulas, crystalloids, correction of acidosis and electrolytes.',
          'CT angiography within 30–60 minutes — do not delay for laboratory tests.',
          'Analgesia; broad-spectrum antibiotics before surgery.',
          'Urinary catheter, hourly urine output, lactate every 4–6 h.'
        ]
      },
      {
        tone: 'proc', title: 'Surgical strategy', items: [
          peritonitis ? 'Peritonitis — emergency laparotomy (preferred if unstable), resection of non-viable bowel, lavage.' : 'Without peritonitis — urgent revascularisation: endovascular embolectomy/stenting or open embolectomy.',
          'A mandatory second look after 24–48 h when bowel viability is uncertain.',
          venous ? 'Venous thrombosis: therapeutic anticoagulation; surgery only for peritonitis or necrosis.' : 'Arterial occlusion: revascularise before resection if the bowel is still viable.',
          'Do not perform extensive resection “just in case” — preserve every viable loop.'
        ]
      },
      {
        tone: 'drug', title: 'Medical therapy', items: [
          'Piperacillin/tazobactam 4.5 g IV three to four times daily (or a carbapenem in severe sepsis).',
          'Unfractionated heparin: 80 U/kg bolus, then infusion titrated to APTT — for arterial embolism and venous thrombosis after bleeding risk assessment.',
          venous ? 'Long-term anticoagulation: 3–6 months for provoked thrombosis, longer if unprovoked or recurrent.' : 'For embolism — anticoagulation and a search for the source (echocardiography, Holter monitoring).',
          'Avoid excessive vasopressors: they worsen bowel ischaemia.',
          LOW_RENAL(s) ? 'eGFR < 30: adjust antibiotic and heparin doses.' : 'Adjust doses if eGFR < 30.'
        ]
      },
      {
        tone: 'monitor', title: 'Observation', items: [
          'Reassess the abdomen every 2–4 h; persistent pain is an indication for re-laparotomy.',
          'Lactate, acidosis, urine output, electrolytes; CT if the patient deteriorates.',
          'Nutritional support after stabilisation; VTE prophylaxis after surgery.',
          'Mortality 50–80%: involve vascular surgery and intensive care early.'
        ]
      },
      {
        tone: 'avoid', title: 'What to avoid', items: [
          'Do not wait for peritoneal signs — they mean necrosis.',
          'Do not rely on plain radiography when ischaemia is suspected.',
          'Do not delay surgery for a complete laboratory work-up.'
        ]
      }
    ];
  }
},

/* ============================ 9. BOWEL OBSTRUCTION ============================ */
obstruction: {
  name: 'Acute intestinal obstruction',
  short: 'Colicky pain, distension, vomiting, no flatus. CT, nasogastric tube, fluids; surgery for strangulation.',
  pearls: [
    'Adhesions are the most common cause of small bowel obstruction after previous abdominal surgery.',
    'Contrast-enhanced CT distinguishes obstruction, strangulation and ileus more accurately than plain radiography.',
    'Without signs of strangulation, conservative management with water-soluble contrast and reassessment at 4–6 h is acceptable.'
  ],
  redFlags: [
    'Peritoneal signs or fever — strangulation and necrosis, emergency surgery.',
    'Lactate > 2 mmol/L, acidosis, instability — resuscitation in parallel with the operating room.',
    'Incarcerated hernia or a closed loop on CT — conservative treatment is unacceptable.'
  ],
  diff: {
    ob: 'Adhesive small bowel obstruction',
    st: 'Strangulation: volvulus, knot, intussusception',
    tu: 'Colonic obstruction from a tumour',
    il: 'Paralytic (adynamic) ileus',
    he: 'Incarcerated hernia',
    mi: 'Mesenteric ischaemia'
  },
  stages: {
    hx: {
      title: 'History and symptoms',
      findings: {
        cramps: 'Colicky pain with pain-free intervals',
        vomit: 'Vomiting, initially gastric contents then stagnant fluid',
        nostool: 'No stool or flatus',
        priorsurg: 'Previous abdominal surgery',
        herniahx: 'Hernia or a swelling in the history',
        weight: 'Weight loss, blood in the stool or anaemia',
        af: 'Atrial fibrillation, atherosclerosis or previous thrombosis',
        constant: 'Constant pain without pain-free intervals'
      }
    },
    ex: {
      title: 'Physical examination',
      findings: {
        distend: 'Abdominal distension, tympany on percussion',
        perist: 'Hyperactive, “tinkling” bowel sounds',
        splash: 'Succussion splash or visible peristalsis',
        perit: 'Peritoneal signs or rigidity',
        asym: 'Asymmetry or a palpable mass',
        herniaex: 'Incarcerated hernia on examination',
        silent: 'Silent abdomen, absent bowel sounds',
        shock: 'Hypotension (SBP < 90 mmHg) or heart rate > 100 bpm'
      }
    },
    lab: {
      title: 'Laboratory tests',
      findings: {
        wbc: 'White cell count > 12 × 10⁹/L',
        lact: 'Lactate > 2 mmol/L or acidosis',
        hct: 'Haemoconcentration: haematocrit > 48%',
        crp: 'CRP > 50 mg/L',
        lytes: 'Hypokalaemia or hypochloraemia, metabolic alkalosis',
        amylase: 'Moderately raised amylase',
        renal: 'Rising creatinine or oliguria'
      }
    },
    img: {
      title: 'Imaging',
      findings: {
        xray: 'Plain radiography: dilated loops and air–fluid levels',
        ctlevels: 'CT: dilated loops > 3 cm, air–fluid levels, transition point',
        norectalgas: 'CT/plain film: no gas in the rectum',
        closedloop: 'CT: closed loop, volvulus or non-enhancing wall',
        tumor: 'CT: mass, stenosis or enlarged lymph nodes',
        ischemia: 'CT: pneumatosis, reduced wall enhancement, free fluid',
        herniact: 'CT: incarceration at the hernia orifice'
      }
    }
  },
  score: null,
  severity(s) {
    const drivers = [];
    if (Y(s, 'perit')) drivers.push('Peritoneal signs');
    if (Y(s, 'closedloop')) drivers.push('Closed loop or volvulus on CT');
    if (Y(s, 'lact')) drivers.push('Lactate > 2 mmol/L');
    if (Y(s, 'ischemia')) drivers.push('Signs of bowel ischaemia');
    if (Y(s, 'herniaex')) drivers.push('Incarcerated hernia');
    if (Y(s, 'shock')) drivers.push('Hypotension');
    const high = Y(s, 'perit') || Y(s, 'closedloop') || Y(s, 'lact') || Y(s, 'ischemia') || Y(s, 'herniaex') || Y(s, 'shock');
    const level = high ? 'high' : (Y(s, 'ctlevels') || Y(s, 'xray')) ? 'moderate' : 'low';
    return {
      level,
      label: high ? 'Strangulation / peritonitis' : level === 'moderate' ? 'Obstruction without strangulation' : 'Intestinal colic, obstruction not confirmed',
      note: high
        ? 'Emergency surgery: bowel inspection, resection of non-viable segments, lavage. Conservative management is not appropriate.'
        : level === 'moderate'
          ? 'Tube decompression, fluids and electrolytes; surgery if there is no resolution within 24–48 h or the patient deteriorates.'
          : 'Observation, repeat examination and imaging; exclude alternative causes of pain.',
      drivers
    };
  },
  plan(s) {
    const strang = Y(s, 'perit') || Y(s, 'closedloop') || Y(s, 'lact') || Y(s, 'ischemia') || Y(s, 'herniaex') || Y(s, 'shock');
    const tumor = Y(s, 'tumor');
    return [
      {
        tone: 'urgent', title: 'Immediate actions', items: [
          'Admit to surgery; nil by mouth, nasogastric tube, urinary catheter and hourly urine output.',
          'Crystalloids and electrolyte correction; analgesia (paracetamol, opioids) and antiemetics.',
          'Contrast-enhanced CT within 1–2 h if stable; if unstable — resuscitation and the operating room.',
          'Assess hernia orifices, surgical scars and signs of strangulation; repeat examination every 2–4 h.'
        ]
      },
      {
        tone: 'drug', title: 'Medical therapy', items: [
          strang
            ? 'Strangulation or peritonitis: ceftriaxone 2 g IV + metronidazole 500 mg IV 60 minutes before surgery; continue for 3–5 days.'
            : 'Uncomplicated obstruction: antibiotics are not routinely indicated; with fever, leucocytosis and risk of translocation — ceftriaxone 2 g IV once daily + metronidazole 500 mg IV three times daily.',
          s.patient.penAllergy
            ? 'Penicillin allergy: with anaphylaxis — ciprofloxacin 400 mg IV twice daily + metronidazole.'
            : 'Alternative: amoxicillin/clavulanate 1.2 g IV three times daily.',
          'Ondansetron 4–8 mg IV for vomiting; avoid NSAIDs if eGFR < 30 and there is hypovolaemia.',
          LOW_RENAL(s) ? 'eGFR < 30: adjust antibiotic doses and infuse fluids cautiously.' : 'Adjust doses if eGFR < 30.'
        ]
      },
      {
        tone: 'proc', title: 'Surgical strategy', items: [
          strang ? 'Emergency laparotomy or laparoscopy: adhesiolysis, bowel inspection, resection of non-viable segments, lavage.' : 'Without strangulation — a conservative trial: tube decompression, fluids, water-soluble contrast (Gastrografin) with a plain film at 4–6 h.',
          'No contrast in the colon at 24 h or clinical deterioration — an indication for surgery.',
          tumor ? 'Tumour obstruction: CT staging; for left-sided lesions — stenting or a decompressing colostomy, for right-sided — single-stage resection.' : 'With a closed loop or volvulus of the small bowel, and with strangulation — surgery only; sigmoid volvulus without peritonitis may be decompressed endoscopically.',
          Y(s, 'herniaex') ? 'Incarcerated hernia: herniotomy, assess viability, resect if necrotic, repair without mesh in the infected field.' : 'Adhesive obstruction: laparoscopic adhesiolysis in selected patients, open access with distension and late presentation.'
        ]
      },
      {
        tone: 'monitor', title: 'Observation', items: [
          'Nasogastric output, urine output, electrolytes and acid–base status every 12–24 h.',
          'Repeat abdominal examination and plain radiography if there is no resolution at 24–48 h.',
          'Early mobilisation and VTE prophylaxis with LMWH once ongoing bleeding is excluded.',
          'Nutritional support after bowel function returns; prevention of recurrent adhesions.'
        ]
      },
      {
        tone: 'avoid', title: 'What to avoid', items: [
          'Do not give laxatives, cleansing enemas or prokinetics before mechanical obstruction is excluded.',
          'Do not perform barium contrast studies when perforation or strangulation is suspected.',
          'Do not attempt to reduce an incarcerated hernia or delay surgery for a “complete work-up”.'
        ]
      }
    ];
  }
},

/* ============================ 10. ABDOMINAL TRAUMA ============================ */
trauma: {
  name: 'Abdominal trauma',
  short: 'Mechanism, pain, instability. FAST and CT, damage control, non-operative management of solid organ injury.',
  pearls: [
    'A hypotensive patient with a positive FAST goes to the operating room, not to CT.',
    'A single normal haemoglobin does not exclude ongoing bleeding — the trend matters.',
    'With stable haemodynamics, splenic and hepatic injuries are managed non-operatively with angioembolisation as indicated.'
  ],
  redFlags: [
    'Instability with a positive FAST — immediate laparotomy.',
    'Free air, peritonitis or evisceration — hollow viscus injury, surgery.',
    'Pelvic fracture with bleeding — pelvic binder, angioembolisation, massive transfusion protocol.'
  ],
  diff: {
    sp: 'Splenic or hepatic injury',
    ho: 'Hollow viscus injury',
    rp: 'Retroperitoneal haematoma or renal injury',
    aw: 'Abdominal wall injury without organ injury',
    pv: 'Pelvic fracture with retroperitoneal bleeding',
    di: 'Diaphragmatic rupture'
  },
  stages: {
    hx: {
      title: 'History and mechanism',
      findings: {
        mech: 'High-energy mechanism: road traffic collision, fall from height, blow',
        seatbelt: 'Steering wheel impact or a seat-belt mark',
        pain: 'Abdominal pain and tenderness',
        alcohol: 'Alcohol, anticoagulants or NSAID use',
        shoulder: 'Shoulder-tip pain or radiation to the neck',
        dyspnea: 'Dyspnoea or pain on breathing',
        hematuriahx: 'Haematuria reported by the patient or on catheterisation'
      }
    },
    ex: {
      title: 'Physical examination',
      findings: {
        perit: 'Peritoneal signs or rigidity',
        distend: 'Distension and diffuse abdominal tenderness',
        shock: 'Hypotension, tachycardia or pallor',
        belt: 'Seat-belt bruising (“seat belt sign”)',
        flank: 'Flank tenderness, swelling, bruising',
        pelvis: 'Pelvic tenderness or instability',
        abwall: 'Local haematoma and abdominal wall tenderness without peritonism',
        breath: 'Reduced breath sounds or tympany over the chest',
        urethra: 'Blood at the urethral meatus, high-riding prostate'
      }
    },
    lab: {
      title: 'Laboratory tests',
      findings: {
        hb: 'Falling haemoglobin or haematocrit',
        wbc: 'White cell count > 12 × 10⁹/L',
        lact: 'Lactate > 2 mmol/L or base deficit',
        ast: 'AST or ALT > 2 × upper limit of normal',
        amylase: 'Amylase or lipase > 2 × upper limit of normal',
        hematuria: 'Haematuria (> 20 red cells per high-power field)',
        coag: 'Coagulopathy or thrombocytopenia'
      }
    },
    img: {
      title: 'Imaging',
      findings: {
        fast: 'FAST: free fluid in the abdominal cavity',
        ct: 'Contrast-enhanced CT: organ injury, haematoma, contrast extravasation',
        freeair: 'CT or plain film: free air, extraluminal fluid',
        pelvisx: 'Radiography or CT: pelvic fracture',
        cysto: 'CT cystography or urography: bladder or renal injury',
        diaphragm: 'CT/radiography: gas or loops in the chest, elevated diaphragm',
        angio: 'CT angiography: extravasation, pseudoaneurysm or vessel occlusion'
      }
    }
  },
  score: null,
  severity(s) {
    const drivers = [];
    if (Y(s, 'shock')) drivers.push('Haemodynamic instability');
    if (Y(s, 'perit')) drivers.push('Peritoneal signs');
    if (Y(s, 'freeair')) drivers.push('Free air — hollow viscus injury');
    if (Y(s, 'lact')) drivers.push('Lactate > 2 mmol/L');
    if (Y(s, 'pelvisx')) drivers.push('Pelvic fracture');
    if (Y(s, 'fast') || Y(s, 'ct')) drivers.push('Confirmed organ injury');
    const high = Y(s, 'shock') || Y(s, 'perit') || Y(s, 'freeair') || Y(s, 'lact');
    const level = high ? 'high' : (Y(s, 'fast') || Y(s, 'ct') || Y(s, 'pelvisx')) ? 'moderate' : 'low';
    return {
      level,
      label: high ? 'Severe trauma: instability or peritonitis' : level === 'moderate' ? 'Stable trauma with organ injury' : 'Trauma without organ injury',
      note: high
        ? 'Resuscitation and emergency surgery; if unstable — damage control with packing and delayed definitive repair.'
        : level === 'moderate'
          ? 'Non-operative management in ICU with haemoglobin and lactate monitoring; angioembolisation for extravasation.'
          : 'Observation, haemoglobin monitoring and repeat examination; imaging according to mechanism and symptoms.',
      drivers
    };
  },
  plan(s) {
    const unstable = Y(s, 'shock') || Y(s, 'perit') || Y(s, 'freeair');
    const pelvic = Y(s, 'pelvisx');
    return [
      {
        tone: 'urgent', title: 'Immediate actions', items: [
          'ABCDE assessment, two large-bore cannulas, monitoring, oxygen; if unstable — activate the massive transfusion protocol.',
          'FAST on arrival and repeat if the patient deteriorates; plain chest and pelvic radiographs.',
          unstable ? 'An unstable patient with peritonitis or a positive FAST — immediate laparotomy, do not spend time on CT.' : 'A stable patient — contrast-enhanced CT of the abdomen (or whole body) within 60 minutes.',
          pelvic ? 'Pelvic binder, fracture immobilisation, angioembolisation for ongoing bleeding.' : 'Warming, correction of acidosis and coagulopathy; avoid excessive crystalloid.'
        ]
      },
      {
        tone: 'drug', title: 'Medical and transfusion therapy', items: [
          'Tranexamic acid 1 g IV over 10 minutes, then 1 g over 8 h if within 3 h of injury.',
          'Balanced transfusion 1:1:1 (red cells : plasma : platelets) for massive bleeding; intravenous calcium.',
          Y(s, 'freeair') ? 'Hollow viscus injury: ceftriaxone 2 g IV + metronidazole 500 mg IV, continued after surgery.' : 'Antibiotics for open trauma, hollow viscus injury and after laparotomy.',
          s.patient.anticoag ? 'Anticoagulants: reversal according to protocol (protamine, factor concentrate or PCC) before surgery.' : 'Tetanus prophylaxis according to the wound.',
          LOW_RENAL(s) ? 'eGFR < 30: cautious fluid therapy, dose adjustment, urine output monitoring.' : 'Monitor urine output and creatinine after contrast CT.'
        ]
      },
      {
        tone: 'proc', title: 'Surgical strategy', items: [
          unstable ? 'Emergency laparotomy: control bleeding, packing, repair or resection; damage control with temporary abdominal closure.' : 'Splenic or hepatic injury without extravasation — non-operative management in ICU with stable haemodynamics.',
          Y(s, 'angio') || Y(s, 'fast') ? 'Angioembolisation for contrast extravasation or active bleeding from a solid organ.' : 'Repeat CT if haemoglobin falls without an obvious source of bleeding.',
          Y(s, 'diaphragm') ? 'Diaphragmatic rupture: thoracoscopy or laparotomy with repair and pleural drainage.' : 'Renal injury: conservative management if stable; urology and stenting for extravasation or collecting-system disruption.',
          Y(s, 'freeair') ? 'Hollow viscus injury: repair or resection with anastomosis, abdominal lavage; a stoma if unstable.' : 'Laparotomy for deterioration, peritonitis, or when a hollow viscus injury cannot be excluded.'
        ]
      },
      {
        tone: 'monitor', title: 'Observation', items: [
          'Haemoglobin, lactate and haemodynamics every 4–6 h in the first day; repeat FAST if the patient deteriorates.',
          'ICU for instability, solid organ injury and pelvic fracture.',
          'VTE prophylaxis with LMWH after 24–48 h once bleeding is controlled.',
          'Early mobilisation, nutritional support and analgesia; watch for anastomotic failure.'
        ]
      },
      {
        tone: 'avoid', title: 'What to avoid', items: [
          'Do not send an unstable patient to CT — the operating room comes first.',
          'Do not perform splenectomy in a stable patient when angioembolisation is possible.',
          'Do not prescribe NSAIDs with renal injury and reduced eGFR; avoid fluid boluses without monitoring.'
        ]
      }
    ];
  }
}

});

/* Build the English dataset from the Russian source: likelihood tables, priors and scores stay shared. */
const DISEASES_EN = DISEASES.map(d => {
  const e = EN[d.id];
  return {
    ...d,
    name: e.name,
    short: e.short,
    pearls: e.pearls,
    redFlags: e.redFlags,
    differential: d.differential.map(x => ({ id: x.id, label: e.diff[x.id] })),
    stages: d.stages.map(st => {
      const es = e.stages[st.id];
      return {
        ...st,
        title: es.title,
        findings: st.findings.map(f => ({ ...f, t: es.findings[f.id] }))
      };
    }),
    score: d.score ? {
      ...d.score,
      name: e.score.name,
      items: d.score.items.map((it, i) => ({ ...it, label: e.score.items[i] })),
      bands: d.score.bands.map((b, i) => ({ ...b, label: e.score.bands[i].label, note: e.score.bands[i].note }))
    } : null,
    severity: e.severity,
    plan: e.plan
  };
});
