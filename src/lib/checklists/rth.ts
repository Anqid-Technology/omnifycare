export type ChecklistItem = {
  id: string
  t: string
  p: 'high' | 'medium' | 'low'
  d?: string
  doc?: boolean
  dtype?: string
}

export type ChecklistCategory = {
  id: string
  label: string
  items: ChecklistItem[]
}

export const RTH_CHECKLIST: ChecklistCategory[] = [
  {
    id: 'pre', label: 'Pre-Application Tasks', items: [
      { id: 'abn_reg', t: 'Register ABN — facility name (e.g. Alexander House)', p: 'high', d: 'Register Assumed Business Name with Oregon SOS at sos.oregon.gov/business. Required as File #3 in OHA submission.' },
      { id: 'hire_qmhp', t: 'Hire QMHP — Clinical Director', p: 'high', d: 'Required clinical supervisor per OAR 309-019-0125. Must have current Oregon QMHP certification through MHACBO.' },
      { id: 'hire_admin', t: 'Hire Program Administrator', p: 'high', d: 'Minimum 2 years MH experience. Must provide corroborating docs: signed letterhead letters, licenses, training records.' },
      { id: 'hire_staff', t: 'Hire 4–5 Direct Care Staff', p: 'high', d: '2 day staff, 1 night staff minimum at launch. All require background checks, CPR/First Aid, and pre-service training.' },
      { id: 'cmhp_contact', t: 'Contact Washington County CMHP (LifeWorks NW)', p: 'high', d: 'Obtain CMHP Acknowledgement Letter. Background checks also submitted through CMHP. Call to start relationship early.' },
      { id: 'fire_sched', t: 'Schedule Fire Marshal Inspection', p: 'high', d: 'Washington County fire authority. Must pass with no outstanding violations before OHA licensure.' },
      { id: 'npi', t: 'Obtain NPI Number from CMS', p: 'high', d: 'Apply at nppes.cms.hhs.gov — required for Medicaid billing.' },
      { id: 'medicaid', t: 'Apply for Medicaid Provider Enrollment', p: 'high', d: 'Call 800-336-6016 or email provider.enrollment@oha.oregon.gov' },
      { id: 'tax_cert', t: 'Obtain Oregon Tax Compliance Certificate', p: 'high', d: 'From Oregon DOR at revenueonline.dor.oregon.gov. Valid 6–12 months.' },
      { id: 'insurance', t: 'Obtain Liability Insurance — $1M/$2M', p: 'high', d: 'General Liability + Professional Liability/E&O + Workers Comp. Min $1M per occurrence, $2M aggregate.' },
      { id: 'sprinkler', t: 'Verify/Install Sprinkler System', p: 'high', d: 'Required per OSSC Chapter 9. Get current maintenance tag from licensed fire safety contractor.' },
      { id: 'cert_use', t: 'Obtain Certificate of Use / Certificate of Occupancy', p: 'high', d: 'From Washington County building authority — required for change of use to residential treatment setting.' },
      { id: 'bg_owner', t: 'Background Checks — Owner and Administrator', p: 'high', d: 'Submit through LifeWorks NW to Oregon DHS BCU under OAR 407-007. Valid 2 years. Use BHD ORCHARDS form.' },
      { id: 'sos_check', t: 'Verify Oregon SOS Active Business Status', p: 'medium', d: 'Confirm Beacon Recovery Residence LLC shows active at sos.oregon.gov.' },
      { id: 'pre_meeting', t: 'Pre-Application Meeting with OHA (optional but recommended)', p: 'medium', d: 'Email BHD.MH.Applications@oha.oregon.gov to request meeting. Helps catch issues early.' },
    ]
  },
  {
    id: 'biz', label: 'Business & Program Docs', items: [
      { id: 'sos_doc', t: 'File 2 — Oregon SOS Business Registry Verification', p: 'high' },
      { id: 'ein_doc', t: 'File 4 — IRS Form SS-4 / EIN Verification (CP 575 Letter)', p: 'high' },
      { id: 'abn_doc', t: 'File 3 — ABN Registration Certificate', p: 'high', d: 'If facility name differs from LLC name. Print from Oregon SOS after registering ABN.' },
      { id: 'app_fee', t: 'Application Fee — $30 for RTH', p: 'low', d: 'Pay online at or.accessgov.com/dhshoha or mail check to OHA BHD Licensing, 500 Summer St NE E86, Salem OR 97301.' },
      { id: 'cmhp_letter', t: 'File 5 — CMHP Acknowledgement Letter', p: 'high', d: 'Official letter from LifeWorks NW confirming awareness of your program.' },
      { id: 'prog_desc', t: 'File 6 — Description of Program Services', p: 'high', doc: true, dtype: 'Program Services Description for Alexander House RTH — Beacon Recovery Residence LLC' },
      { id: 'admin_exp', t: 'File 7 — Proof of Administrator Experience', p: 'high', d: 'Signed letters on letterhead showing 2+ years MH experience including job titles, dates, duties, and populations served.' },
      { id: 'bg_owner_doc', t: 'File 8 — Background Check Approval Letters — Owner and Administrator', p: 'high' },
    ]
  },
  {
    id: 'fin', label: 'Financial & Legal', items: [
      { id: 'op_plan', t: 'File 9 — Operational Plan', p: 'high', doc: true, dtype: 'Comprehensive Operational Plan for Alexander House RTH — Beacon Recovery Residence LLC, Aloha Oregon' },
      { id: 'budget', t: 'File 10 — Proposed Annual Operating Budget', p: 'high', doc: true, dtype: 'Proposed Annual Operating Budget — Alexander House, 5-Bed RTH, Aloha Washington County Oregon' },
      { id: 'cash_res', t: 'File 11 — Cash Reserves Documentation — 3 months minimum', p: 'high', d: 'Bank statements (last 60 days) or financial institution letter showing 3 months of operating expenses in accessible funds.' },
      { id: 'debt_disc', t: 'File 12 — Financial Disclosure (Pending Debts / Bankruptcies)', p: 'medium', doc: true, dtype: 'Financial Disclosure Statement — Beacon Recovery Residence LLC / Horizon Healthcare Group' },
      { id: 'tax_cert_doc', t: 'File 13 — Oregon Tax Compliance Certificate', p: 'high' },
      { id: 'ins_cert', t: 'File 14 — Certificate of Liability Insurance', p: 'high' },
      { id: 'lease_doc', t: 'File 15 — Current Lease / Rental Agreement', p: 'high', d: 'Must show Beacon Recovery Residence LLC as tenant, facility address, term, rent, and all signatures. Address must match application exactly.' },
    ]
  },
  {
    id: 'fac', label: 'Facility & Safety', items: [
      { id: 'fac_plans', t: 'File 16 — Facility Plans and Specs', p: 'medium', d: 'Required if new or altered structure. Architectural drawings, scope of work, permits, compliance documentation.' },
      { id: 'floor_plan', t: 'File 17 — Detailed Floor Plan', p: 'high', d: 'Label all rooms with dimensions, bed capacity, exits, fire extinguishers, smoke detectors, sprinklers, medication storage, ADA features.' },
      { id: 'fire_report', t: 'File 18 — Approved Fire Marshal Inspection Report', p: 'high' },
      { id: 'sprinkler_doc', t: 'File 19 — Sprinkler System Verification + Maintenance Tag', p: 'high', d: 'Photo of current maintenance tag + most recent inspection report from licensed contractor. Within past 12 months.' },
      { id: 'cert_occ', t: 'File 20 — Certificate of Use or Certificate of Occupancy', p: 'high', d: 'From Washington County building authority. Must not be marked temporary or conditional.' },
      { id: 'water', t: 'File 21 — Safe Water Supply — N/A if city water', p: 'low', d: 'Aloha uses Tualatin Valley Water District. Confirm city water and mark N/A.' },
    ]
  },
  {
    id: 'staff', label: 'Staffing & Training', items: [
      { id: 'job_desc', t: 'File 22 — Job Descriptions — all staff positions', p: 'high', doc: true, dtype: 'Job Descriptions Package — Alexander House RTH: Administrator, QMHP Clinical Director, Day Staff, Night Staff' },
      { id: 'train_plan', t: 'File 23 — Startup and Pre-Service Training Plan', p: 'high', doc: true, dtype: 'Startup and Pre-Service Training Plan — Alexander House RTH Staff' },
      { id: 'train_evid', t: 'File 24 — Evidence of Training Completion (all staff)', p: 'high', d: 'Certificates, training logs with trainer signatures, CPR cards — one combined file covering all staff.' },
      { id: 'prof_lic', t: 'File 25 — Professional Licenses and Certifications', p: 'high', d: 'One file per licensed staff member. Current license from Oregon licensing board. Required for QMHP, LCSW, RN, etc.' },
      { id: 'bg_staff', t: 'File 8 — Background Check Approval Letters — all staff', p: 'high', d: 'One separate file per staff member using BHD ORCHARDS form.' },
      { id: 'emerg_proc', t: 'Emergency Procedures review documentation', p: 'high', doc: true, dtype: 'Emergency Procedures Document — Alexander House RTH' },
      { id: 'deesc', t: 'Behavior management and de-escalation training curriculum', p: 'high', doc: true, dtype: 'Behavior Management and De-escalation Training Curriculum — Alexander House RTH' },
      { id: 'rights_train', t: 'Resident Rights training overview', p: 'high', doc: true, dtype: 'Resident Rights Training Document — Alexander House RTH' },
      { id: 'med_train', t: 'Medication management procedures training', p: 'high', doc: true, dtype: 'Medication Management Procedures Training — Alexander House RTH' },
      { id: 'cult_train', t: 'Culturally responsive care training', p: 'medium', doc: true, dtype: 'Culturally Responsive Care Training — Alexander House RTH' },
      { id: 'abuse_train', t: 'Mandatory abuse reporting training', p: 'high', doc: true, dtype: 'Mandatory Abuse Reporting Training — Alexander House RTH' },
      { id: 'lgbtq', t: 'LGBTQIA2S+ residents and HIV training', p: 'medium', doc: true, dtype: 'LGBTQIA2S+ and HIV Training — Alexander House RTH' },
    ]
  },
  {
    id: 'hcbs', label: 'HCBS, Residency & Rules', items: [
      { id: 'hcbs_self', t: 'File 26 — Completed HCBS Self-Assessment', p: 'high', d: 'Download from oregon.gov/odhs/providers-partners. Signed by Administrator. Required for Medicaid eligibility.' },
      { id: 'house_rules', t: 'File 27 — House Rules document', p: 'high', doc: true, dtype: 'House Rules for Alexander House RTH — Beacon Recovery Residence LLC' },
      { id: 'res_agree', t: 'File 28 — Residency Agreement', p: 'high', doc: true, dtype: 'Residency Agreement for Alexander House RTH — OHP and Medicaid compliant, OAR 309-035-0190' },
    ]
  },
  {
    id: 'pp', label: 'Policies & Procedures', items: [
      { id: 'pp1', t: 'P&P: Personnel practices and staff training', p: 'high', doc: true, dtype: 'Policy and Procedure: Personnel Practices and Staff Training — Alexander House RTH' },
      { id: 'pp2', t: 'P&P: Resident screening and admission', p: 'high', doc: true, dtype: 'Policy and Procedure: Resident Screening and Admission — Alexander House RTH' },
      { id: 'pp3', t: 'P&P: Fire drills, emergency procedures, safety and abuse reporting', p: 'high', doc: true, dtype: 'Policy and Procedure: Fire Drills, Emergency Procedures, Safety and Abuse Reporting — Alexander House RTH' },
      { id: 'pp4', t: 'P&P: Health and sanitation', p: 'high', doc: true, dtype: 'Policy and Procedure: Health and Sanitation — Alexander House RTH' },
      { id: 'pp5', t: 'P&P: Records maintenance and confidentiality (HIPAA)', p: 'high', doc: true, dtype: 'Policy and Procedure: Records Maintenance and Confidentiality — Alexander House RTH' },
      { id: 'pp6', t: 'P&P: Residential service plans, services and activities', p: 'high', doc: true, dtype: 'Policy and Procedure: Residential Service Plans, Services and Activities — Alexander House RTH' },
      { id: 'pp7', t: 'P&P: Behavior management and seclusion/restraints', p: 'high', doc: true, dtype: 'Policy and Procedure: Behavior Management Interventions — Alexander House RTH' },
      { id: 'pp8', t: 'P&P: Food service', p: 'medium', doc: true, dtype: 'Policy and Procedure: Food Service — Alexander House RTH' },
      { id: 'pp9', t: 'P&P: Medication administration and storage', p: 'high', doc: true, dtype: 'Policy and Procedure: Medication Administration and Storage — Alexander House RTH' },
      { id: 'pp10', t: 'P&P: Resident belongings, storage and funds', p: 'medium', doc: true, dtype: 'Policy and Procedure: Resident Belongings, Storage and Funds — Alexander House RTH' },
      { id: 'pp11', t: 'P&P: Resident rights, freedoms and protections', p: 'high', doc: true, dtype: 'Policy and Procedure: Resident Rights, Freedoms and Protections (OAR 309-035-0190) — Alexander House RTH' },
      { id: 'pp12', t: 'P&P: Advanced mental health and medical directives', p: 'medium', doc: true, dtype: 'Policy and Procedure: Advanced Mental Health and Medical Directives — Alexander House RTH' },
      { id: 'pp13', t: 'P&P: Complaints and grievances', p: 'high', doc: true, dtype: 'Policy and Procedure: Complaints and Grievances — Alexander House RTH' },
      { id: 'pp14', t: 'P&P: Setting maintenance', p: 'medium', doc: true, dtype: 'Policy and Procedure: Setting Maintenance — Alexander House RTH' },
      { id: 'pp15', t: 'P&P: Evacuation capability determination', p: 'high', doc: true, dtype: 'Policy and Procedure: Evacuation Capability Determination — Alexander House RTH' },
      { id: 'pp16', t: 'P&P: Fees and money management', p: 'medium', doc: true, dtype: 'Policy and Procedure: Fees and Money Management — Alexander House RTH' },
      { id: 'pp17', t: 'P&P: Cultural competency', p: 'medium', doc: true, dtype: 'Policy and Procedure: Cultural Competency — Alexander House RTH' },
    ]
  },
  {
    id: 'forms', label: 'Sample Forms', items: [
      { id: 'f1', t: 'File 31 — Resident Summary Sheet', p: 'high', doc: true, dtype: 'Form Template: Resident Summary Sheet — Alexander House RTH' },
      { id: 'f2', t: 'File 32 — Admission Documents Package', p: 'high', doc: true, dtype: 'Form Template: Admission Documents Package — Alexander House RTH' },
      { id: 'f3', t: 'File 33 — Release of Information (HIPAA compliant)', p: 'high', doc: true, dtype: 'Form Template: HIPAA Release of Information — Alexander House RTH' },
      { id: 'f4', t: 'File 34 — Residential Service Plan template', p: 'high', doc: true, dtype: 'Form Template: Residential Service Plan (RSP) — Alexander House RTH' },
      { id: 'f5', t: 'File 37 — Daily Progress Notes template', p: 'high', doc: true, dtype: 'Form Template: Daily Progress Notes — Alexander House RTH' },
      { id: 'f6', t: 'File 35 — Monthly Summary template', p: 'medium', doc: true, dtype: 'Form Template: Monthly Summary — Alexander House RTH' },
      { id: 'f7', t: 'File 36 — Notice of Involuntary Discharge (30-day and less than 30-day)', p: 'medium', doc: true, dtype: 'Form Template: Notice of Involuntary Discharge — Alexander House RTH' },
    ]
  },
  {
    id: 'submission', label: 'Final Submission', items: [
      { id: 'sub_review', t: 'Review all 37 required files are named correctly', p: 'high', d: 'Files must use exact OHA naming convention. Wrong file name = rejection. Source: OHA MHLC File Naming Convention (03/26).' },
      { id: 'sub_app', t: 'File 1 — Initial Application form completed', p: 'high', d: 'Download current form at oregon.gov/oha/HSD/AMH-LC/Pages/RT.aspx. Submit at least 60 days before planned opening.' },
      { id: 'sub_fee', t: 'Application fee payment ready — $30 RTH', p: 'high', d: 'Pay online at or.accessgov.com/dhshoha (includes payment) or mail separately.' },
      { id: 'sub_submit', t: 'Submit online at or.accessgov.com/dhshoha', p: 'high', d: 'Or email to BHD.MH.Applications@oha.oregon.gov. Mail payment to OHA BHD Licensing, 500 Summer St NE E86, Salem OR 97301.' },
      { id: 'sub_roads', t: 'Register with ROADS within 2 weeks of receiving Medicaid ID', p: 'high', d: 'Required per OAR attestation once Medicaid ID number is received.' },
    ]
  },
  {
    id: 'compliance', label: 'Compliance Monitoring', items: [
      { id: 'c_oar', t: 'Monitor OAR Chapter 309 Division 35 for rule changes', p: 'high', d: 'Check monthly: secure.sos.state.or.us/oard/displayDivisionRules.action?selectedDivision=1029. Temporary rule active through June 27, 2026.' },
      { id: 'c_oha', t: 'Monitor OHA RT page for updated forms and guides', p: 'high', d: 'Check monthly: oregon.gov/oha/HSD/AMH-LC/Pages/RT.aspx' },
      { id: 'c_govdelivery', t: 'Sign up for OHA GovDelivery rule update alerts', p: 'high', d: 'Subscribe at GovDelivery for automatic alerts when OHA updates rules and announcements.' },
      { id: 'c_license_exp', t: 'Track license expiration — renewal due 60 days before', p: 'high', d: 'License valid up to 2 years (initial). Renewal submitted minimum 60 days before expiration. OHA conducts onsite review before renewal.' },
      { id: 'c_bg_renewal', t: 'Track background check renewals — valid 2 years each', p: 'medium', d: 'All staff background checks expire every 2 years. Set reminders 90 days before each expiration.' },
      { id: 'c_ins_renewal', t: 'Track liability insurance certificate renewals', p: 'high', d: 'Certificate must remain valid at all times. Provide renewal certificates to OHA before expiration.' },
      { id: 'c_abn_renewal', t: 'Track ABN (Alexander House) registration renewal with Oregon SOS', p: 'medium', d: 'Confirm renewal dates at sos.oregon.gov to keep DBA active.' },
    ]
  },
]

export function getChecklistForType(type: string): ChecklistCategory[] {
  if (type === 'rth') return RTH_CHECKLIST
  return []
}

export function calcStats(cats: ChecklistCategory[], statuses: Record<string, string>) {
  let total = 0, done = 0, inprog = 0, blocked = 0
  cats.forEach(c => c.items.forEach(i => {
    total++
    const s = statuses[i.id] || 'not_started'
    if (s === 'complete' || s === 'na') done++
    else if (s === 'in_progress') inprog++
    else if (s === 'blocked') blocked++
  }))
  return { total, done, inprog, blocked, pct: total ? Math.round(done / total * 100) : 0 }
}