export type Screen =
  | 'login'
  | 'signup'
  | 'home'
  | 'upload'
  | 'results'
  | 'chat'
  | 'ai'
  | 'settings'
  | 'profile'

export type Severity = 'normal' | 'watch' | 'critical'
export type DocType = 'blood' | 'prescription' | 'xray' | 'thyroid'
export type UploadMode = 'report' | 'profile'

export interface CriticalHit {
  value: string
  unit: string
  meaning: string
  isCritical: boolean
}

export interface Report {
  id: string
  title: string
  date: string
  preview: string
  severity: Severity
  docType: DocType
  overview: string
  criticalHits: CriticalHit[]
}

export interface Message {
  id: string
  role: 'user' | 'ai'
  text: string
}

export interface Profile {
  name: string
  email: string
  phone: string
  dob: string
}

export const mockReports: Report[] = [
  {
    id: '1',
    title: 'Blood Test — Aug 12, 2026',
    date: 'Aug 12, 2026',
    preview:
      'Most values within normal range. Fasting glucose and LDL cholesterol slightly elevated — worth a follow-up conversation with your doctor.',
    severity: 'watch',
    docType: 'blood',
    overview:
      "This blood panel shows most values are in a healthy range. Your red blood cells, hemoglobin, and white blood cell counts are all normal. Kidney and liver markers look fine too. Two things are worth discussing with your doctor: your fasting glucose is slightly above the typical range, and your LDL (bad) cholesterol is borderline high. Neither of these are emergencies, but a conversation and a follow-up in a few months makes sense.",
    criticalHits: [
      {
        value: '142',
        unit: 'mg/dL',
        meaning:
          'Your fasting glucose is above the normal range of 70–99 mg/dL. This can sometimes indicate prediabetes. Worth discussing with your doctor — diet changes often make a big difference.',
        isCritical: true,
      },
      {
        value: '128',
        unit: 'mg/dL',
        meaning:
          'LDL (bad cholesterol) is at the high end of borderline (optimal is below 100 mg/dL). Dietary adjustments and a recheck in 3 months are typically recommended.',
        isCritical: false,
      },
    ],
  },
  {
    id: '2',
    title: 'Thyroid Panel — Jul 28, 2026',
    date: 'Jul 28, 2026',
    preview: 'All thyroid values within normal limits. No further action needed at this time.',
    severity: 'normal',
    docType: 'thyroid',
    overview:
      "Great news — your thyroid function test results all fall within healthy reference ranges. TSH, Free T3, and Free T4 are all normal, which suggests your thyroid is working exactly as it should. No medications or follow-up tests are indicated based on these results. Your doctor may recommend a routine recheck in 12 months.",
    criticalHits: [],
  },
  {
    id: '3',
    title: 'Prescription — Jul 15, 2026',
    date: 'Jul 15, 2026',
    preview: 'Amoxicillin 500mg for 7 days. Take with food. Avoid alcohol during treatment.',
    severity: 'normal',
    docType: 'prescription',
    overview:
      "Your doctor has prescribed Amoxicillin 500mg, an antibiotic for bacterial infections. Take one capsule three times a day for 7 days, preferably with meals to reduce stomach upset. Finish the full course even if you start feeling better early — stopping too soon can let bacteria bounce back. Avoid alcohol during the 7 days. If you notice a skin rash, difficulty breathing, or severe stomach pain, stop taking it and contact your doctor or go to urgent care.",
    criticalHits: [],
  },
  {
    id: '4',
    title: 'Chest X-Ray — Jun 30, 2026',
    date: 'Jun 30, 2026',
    preview:
      'Radiologist notes a small area of concern in the lower right lung. Follow-up CT scan recommended.',
    severity: 'critical',
    docType: 'xray',
    overview:
      "Your chest X-ray has been reviewed by a radiologist. Most of the image looks normal — your heart size is appropriate, and there's no sign of fluid around the lungs. However, there's a small area of increased density (opacification) in the lower right lung. This can have many causes — some minor (like a resolving infection) and some that need closer attention. Your doctor has ordered a CT scan to get a clearer picture. Please schedule that soon.",
    criticalHits: [
      {
        value: '1.8',
        unit: 'cm',
        meaning:
          "A small area of opacity (shadow) in the lower right lung lobe. It's not normal, but 1.8cm is small. A CT scan will clarify whether this needs treatment. Don't delay scheduling it.",
        isCritical: true,
      },
    ],
  },
]

export const suggestedQuestions: Record<string, string[]> = {
  '1': [
    'What does a glucose of 142 mg/dL mean for me?',
    'How can I lower LDL cholesterol naturally?',
    'Should I be tested for prediabetes?',
  ],
  '2': [
    'What is TSH and why does it matter?',
    'Are these thyroid levels normal for my age?',
    'How often should I get a thyroid panel?',
  ],
  '3': [
    'Can I take Amoxicillin with dairy products?',
    'What happens if I miss a dose?',
    'Which side effects should I watch out for?',
  ],
  '4': [
    'What could cause opacity in the lung?',
    'How serious is a 1.8cm finding?',
    'What should I expect at the CT scan?',
  ],
}

export const aiResponses: Record<string, string> = {
  default:
    "That's a great question. Based on the document you shared, I can help clarify that. Medical reports often use clinical shorthand that's hard to parse — let me break it down in plain language for you.",
  glucose:
    'A fasting glucose of 142 mg/dL is above the normal range of 70–99 mg/dL and technically falls in the "prediabetes" zone (100–125 mg/dL) or early diabetes territory (126+ mg/dL). The most important next step is a follow-up fasting glucose test to confirm, along with an HbA1c test which shows your average blood sugar over 3 months. Diet changes — reducing refined carbs and sugars — can make a meaningful difference in early cases.',
  cholesterol:
    "LDL below 100 mg/dL is considered optimal, so 128 mg/dL is borderline. The good news is this is very manageable. Regular aerobic exercise (30 min, 5 days a week), reducing saturated fats (red meat, full-fat dairy, fried foods), and increasing soluble fiber (oats, beans, fruit) can lower LDL by 10–20% over a few months. If lifestyle changes aren't enough after 3–6 months, your doctor may discuss a statin.",
  thyroid:
    'TSH (Thyroid Stimulating Hormone) is produced by your pituitary gland and tells your thyroid how much thyroid hormone to make. A normal TSH means the system is well-regulated. Low TSH would suggest the thyroid is overactive (hyperthyroidism); high TSH suggests underactive (hypothyroidism). Since yours is normal, no changes are needed.',
}
