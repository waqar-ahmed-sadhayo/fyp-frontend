// Friendly presentation layer on top of the raw feature names the backend
// models were trained on. Keys must match app/ml/train_models.py exactly.

// Colors are deliberately desaturated to sit in the same quiet register as
// the rest of the palette (see styles.css's Panel Indigo system) — they're
// here for wayfinding across 5 services, not as decorative brand accents.
// Referenced as CSS custom properties (not literal hex) because each has a
// separate, lighter dark-mode value defined in styles.css — a literal hex
// here would keep the light-mode tone in dark mode and drop under 3:1
// contrast against a dark surface.
export const DISEASE_META = {
  heart: {
    label: "Heart Disease",
    tagline: "Cardiovascular risk from resting clinical measurements",
    color: "var(--disease-heart)",
  },
  diabetes: {
    label: "Diabetes",
    tagline: "Type 2 diabetes risk from metabolic panel values",
    color: "var(--disease-diabetes)",
  },
  breast_cancer: {
    label: "Breast Cancer",
    tagline: "Malignancy risk from cell nuclei measurements",
    color: "var(--disease-breast_cancer)",
  },
  kidney: {
    label: "Kidney Disease",
    tagline: "Chronic kidney disease risk from blood & urine panel",
    color: "var(--disease-kidney)",
  },
  liver: {
    label: "Liver Disease",
    tagline: "Liver disease risk from enzyme & bilirubin panel",
    color: "var(--disease-liver)",
  },
};

// Groups the multi-field lab panel into the sections a clinician would
// actually read it in, for the grouped form layout on the Predict page.
// Purely presentational — field keys/order here don't affect what's sent
// to the API (see Predict.jsx, which still iterates the backend's raw
// `features` list for the actual payload).
export const FIELD_GROUPS = {
  heart: [
    { title: "Vitals", fields: ["age", "sex", "trestbps", "chol"] },
    { title: "ECG & Exercise Test", fields: ["fbs", "restecg", "thalach", "exang", "oldpeak", "slope"] },
    { title: "History", fields: ["ca", "cp", "thal"] },
  ],
  diabetes: [
    { title: "Metabolic Panel", fields: ["Glucose", "Insulin", "BMI", "BloodPressure", "SkinThickness"] },
    { title: "History", fields: ["Pregnancies", "DiabetesPedigreeFunction", "Age"] },
  ],
  kidney: [
    { title: "Vitals & Urinalysis", fields: ["age", "bp", "sg", "al", "su", "rbc", "pc", "pcc", "ba"] },
    { title: "Blood Chemistry", fields: ["bgr", "bu", "sc", "sod", "pot"] },
    { title: "Hematology", fields: ["hemo", "pcv", "wc", "rc"] },
    { title: "History & Symptoms", fields: ["htn", "dm", "cad", "appet", "pe", "ane"] },
  ],
  liver: [
    { title: "Bilirubin & Enzymes", fields: [
      "Total_Bilirubin", "Direct_Bilirubin", "Alkaline_Phosphotase",
      "Alamine_Aminotransferase", "Aspartate_Aminotransferase",
    ] },
    { title: "Protein Panel", fields: ["Total_Protiens", "Albumin", "Albumin_and_Globulin_Ratio"] },
    { title: "Patient Info", fields: ["Age", "Gender"] },
  ],
};

// breast_cancer's 30 sklearn features aren't individually named above —
// they're generic "mean radius" / "radius error" / "worst radius" triples
// — so classify them by that naming pattern instead of hand-listing 30 keys.
function classifyBreastCancerField(name) {
  if (name.startsWith("worst ")) return "Worst (Largest) Values";
  if (name.endsWith("error")) return "Standard Error";
  return "Mean Values";
}

// Returns [{ title, fields }] for the grouped form layout, given the raw
// feature list the backend actually returned for this disease (GET
// /api/diseases). Filters FIELD_GROUPS against that list rather than
// trusting it blindly, so a schema change on the backend can't silently
// drop a field from the form — anything unrecognized lands in "Other".
export function groupFields(disease, features) {
  const explicit = FIELD_GROUPS[disease];
  if (explicit) {
    const known = new Set(explicit.flatMap((g) => g.fields));
    const groups = explicit
      .map((g) => ({ title: g.title, fields: g.fields.filter((f) => features.includes(f)) }))
      .filter((g) => g.fields.length > 0);
    const leftover = features.filter((f) => !known.has(f));
    if (leftover.length) groups.push({ title: "Other", fields: leftover });
    return groups;
  }

  if (disease === "breast_cancer") {
    const byTitle = new Map();
    for (const f of features) {
      const title = classifyBreastCancerField(f);
      if (!byTitle.has(title)) byTitle.set(title, []);
      byTitle.get(title).push(f);
    }
    const order = ["Mean Values", "Standard Error", "Worst (Largest) Values"];
    return order.filter((t) => byTitle.has(t)).map((title) => ({ title, fields: byTitle.get(title) }));
  }

  return [{ title: "Panel", fields: features }];
}

const FIELD_META = {
  // heart
  age: { label: "Age", unit: "years", min: 1, max: 120 },
  sex: { label: "Sex", type: "select", options: [{ v: 1, l: "Male" }, { v: 0, l: "Female" }] },
  cp: { label: "Chest pain type", type: "select", options: [
      { v: 0, l: "Typical angina" }, { v: 1, l: "Atypical angina" },
      { v: 2, l: "Non-anginal pain" }, { v: 3, l: "Asymptomatic" } ] },
  trestbps: { label: "Resting blood pressure", unit: "mm Hg", min: 60, max: 260 },
  chol: { label: "Serum cholesterol", unit: "mg/dl", min: 80, max: 700 },
  fbs: { label: "Fasting blood sugar > 120 mg/dl", type: "select",
    options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
  restecg: { label: "Resting ECG result", type: "select", options: [
      { v: 0, l: "Normal" }, { v: 1, l: "ST-T abnormality" }, { v: 2, l: "LV hypertrophy" } ] },
  thalach: { label: "Max heart rate achieved", unit: "bpm", min: 50, max: 250 },
  exang: { label: "Exercise-induced angina", type: "select",
    options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
  oldpeak: { label: "ST depression (exercise vs rest)", unit: "mm", step: 0.1, min: 0, max: 10 },
  slope: { label: "Slope of peak exercise ST segment", type: "select", options: [
      { v: 0, l: "Upsloping" }, { v: 1, l: "Flat" }, { v: 2, l: "Downsloping" } ] },
  ca: { label: "Major vessels colored by fluoroscopy", min: 0, max: 4 },
  thal: { label: "Thalassemia", type: "select", options: [
      { v: 1, l: "Normal" }, { v: 2, l: "Fixed defect" }, { v: 3, l: "Reversible defect" } ] },

  // diabetes
  Pregnancies: { label: "Pregnancies", unit: "count", min: 0, max: 20 },
  Glucose: { label: "Plasma glucose (OGTT)", unit: "mg/dl", min: 0, max: 300 },
  BloodPressure: { label: "Diastolic blood pressure", unit: "mm Hg", min: 0, max: 200 },
  SkinThickness: { label: "Triceps skinfold thickness", unit: "mm", min: 0, max: 100 },
  Insulin: { label: "2-hour serum insulin", unit: "mu U/ml", min: 0, max: 900 },
  BMI: { label: "Body mass index", unit: "kg/m²", step: 0.1, min: 0, max: 80 },
  DiabetesPedigreeFunction: { label: "Diabetes pedigree function", step: 0.001, min: 0, max: 3 },
  Age: { label: "Age", unit: "years", min: 1, max: 120 },

  // breast cancer (sklearn feature names, snake-ish with spaces)
  // handled generically below since there are 30 continuous features

  // kidney
  bp: { label: "Blood pressure", unit: "mm Hg", min: 40, max: 200 },
  sg: { label: "Urine specific gravity", step: 0.001, min: 1, max: 1.03 },
  al: { label: "Albumin (urine)", min: 0, max: 5 },
  su: { label: "Sugar (urine)", min: 0, max: 5 },
  rbc: { label: "Red blood cells (urine)", type: "select", options: [{ v: 1, l: "Normal" }, { v: 0, l: "Abnormal" }] },
  pc: { label: "Pus cells (urine)", type: "select", options: [{ v: 1, l: "Normal" }, { v: 0, l: "Abnormal" }] },
  pcc: { label: "Pus cell clumps", type: "select", options: [{ v: 1, l: "Present" }, { v: 0, l: "Not present" }] },
  ba: { label: "Bacteria (urine)", type: "select", options: [{ v: 1, l: "Present" }, { v: 0, l: "Not present" }] },
  bgr: { label: "Blood glucose random", unit: "mg/dl", min: 20, max: 500 },
  bu: { label: "Blood urea", unit: "mg/dl", min: 1, max: 400 },
  sc: { label: "Serum creatinine", unit: "mg/dl", step: 0.1, min: 0, max: 40 },
  sod: { label: "Sodium", unit: "mEq/L", min: 90, max: 170 },
  pot: { label: "Potassium", unit: "mEq/L", step: 0.1, min: 1, max: 15 },
  hemo: { label: "Hemoglobin", unit: "g/dl", step: 0.1, min: 2, max: 20 },
  pcv: { label: "Packed cell volume", unit: "%", min: 5, max: 60 },
  wc: { label: "White blood cell count", unit: "cells/cmm", min: 1000, max: 30000 },
  rc: { label: "Red blood cell count", unit: "millions/cmm", step: 0.1, min: 1, max: 8 },
  htn: { label: "Hypertension", type: "select", options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
  dm: { label: "Diabetes mellitus", type: "select", options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
  cad: { label: "Coronary artery disease", type: "select", options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
  // v matches the trained model's actual category_encodings (good=0, poor=1)
  // — do not "fix" this to look symmetric with the other yes/no fields
  // without checking backend/app/ml/models/kidney.joblib's
  // category_encodings first; that mismatch was a real bug once already.
  appet: { label: "Appetite", type: "select", options: [{ v: 0, l: "Good" }, { v: 1, l: "Poor" }] },
  pe: { label: "Pedal edema", type: "select", options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },
  ane: { label: "Anemia", type: "select", options: [{ v: 1, l: "Yes" }, { v: 0, l: "No" }] },

  // liver
  Gender: { label: "Gender", type: "select", options: [{ v: 1, l: "Male" }, { v: 0, l: "Female" }] },
  Total_Bilirubin: { label: "Total bilirubin", unit: "mg/dl", step: 0.1, min: 0, max: 80 },
  Direct_Bilirubin: { label: "Direct bilirubin", unit: "mg/dl", step: 0.1, min: 0, max: 40 },
  Alkaline_Phosphotase: { label: "Alkaline phosphotase", unit: "IU/L", min: 0, max: 2200 },
  Alamine_Aminotransferase: { label: "Alamine aminotransferase (ALT)", unit: "IU/L", min: 0, max: 2100 },
  Aspartate_Aminotransferase: { label: "Aspartate aminotransferase (AST)", unit: "IU/L", min: 0, max: 5000 },
  Total_Protiens: { label: "Total proteins", unit: "g/dl", step: 0.1, min: 0, max: 10 },
  Albumin: { label: "Albumin", unit: "g/dl", step: 0.1, min: 0, max: 6 },
  Albumin_and_Globulin_Ratio: { label: "Albumin/globulin ratio", step: 0.01, min: 0, max: 3 },
};

function titleCase(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getFieldMeta(featureName) {
  if (FIELD_META[featureName]) return { key: featureName, ...FIELD_META[featureName] };
  // breast-cancer sklearn feature names: "mean radius", "worst texture", etc.
  return { key: featureName, label: titleCase(featureName), step: 0.0001, min: 0 };
}
