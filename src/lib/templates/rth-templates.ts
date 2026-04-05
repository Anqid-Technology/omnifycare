// =============================================================================
// Omnify Care — RTH (Residential Treatment Home) Document Templates
// Complete OHA-compliant TipTap JSON content for Oregon RTH programs
// =============================================================================

import { DocumentTemplate } from './types';

// ---------------------------------------------------------------------------
// Helper: shorthand node builders (keeps the file readable)
// ---------------------------------------------------------------------------
const text = (t: string, marks?: Array<{ type: string }>) =>
  marks ? { type: 'text' as const, text: t, marks } : { type: 'text' as const, text: t };

const bold = (t: string) => text(t, [{ type: 'bold' }]);

const p = (...nodes: any[]) => ({ type: 'paragraph' as const, content: nodes });

const h = (level: number, ...nodes: any[]) => ({
  type: 'heading' as const,
  attrs: { level },
  content: nodes,
});

const li = (...paragraphs: any[]) => ({
  type: 'listItem' as const,
  content: paragraphs,
});

const ul = (...items: any[]) => ({ type: 'bulletList' as const, content: items });

const ol = (...items: any[]) => ({ type: 'orderedList' as const, content: items });

// =============================================================================
// TEMPLATE 1 — Medication Administration and Storage Policy
// =============================================================================
const medicationPolicy: DocumentTemplate = {
  id: 'rth-medication-admin-storage',
  title: 'Medication Administration and Storage Policy',
  doc_type: 'policy',
  program_type: 'rth',
  agency: 'OHA — Behavioral Health Division',
  category: 'policy',
  description:
    'Comprehensive policy governing the receipt, storage, administration, documentation, and disposal of medications in a Residential Treatment Home, in compliance with OAR 309-035-0150.',
  oar_reference: 'OAR 309-035-0150',
  is_premium: false,
  sort_order: 1,
  content: {
    type: 'doc',
    content: [
      // ── Title ───────────────────────────────────────────────────────
      h(1, text('Medication Administration and Storage Policy')),

      // ── 1. Purpose ──────────────────────────────────────────────────
      h(2, text('1. Purpose')),
      p(
        text(
          'The purpose of this policy is to establish clear, consistent, and safe procedures for the administration, storage, documentation, and disposal of all medications within this Residential Treatment Home (RTH). This policy is designed to protect the health and safety of every resident by ensuring that medications are handled only by authorized and trained personnel, in strict compliance with Oregon Administrative Rules and applicable federal regulations.',
        ),
      ),
      p(
        text(
          'This policy further aims to minimize the risk of medication errors, adverse drug reactions, and diversion of controlled substances. It provides the framework through which the program meets the standards set forth by the Oregon Health Authority (OHA) Behavioral Health Division under OAR 309-035-0150 and related rules.',
        ),
      ),
      p(
        text(
          'All staff members involved in medication-related activities shall be familiar with this policy and shall receive training before assuming any medication responsibilities. The Program Director is ultimately responsible for ensuring full compliance with this policy at all times.',
        ),
      ),

      // ── 2. Scope ────────────────────────────────────────────────────
      h(2, text('2. Scope')),
      p(
        text(
          'This policy applies to all employees, contractors, volunteers, and any other personnel who may handle, administer, store, document, or dispose of medications within the facility. It applies to all categories of medications, including prescription medications, over-the-counter medications, controlled substances, PRN medications, nutritional supplements prescribed by a licensed prescriber, and sample medications.',
        ),
      ),
      p(
        text(
          'This policy covers every resident currently receiving services in the RTH regardless of payer source, legal status, or length of stay. Temporary or respite residents are also subject to all provisions of this policy while present in the facility.',
        ),
      ),

      // ── 3. Policy Statement ─────────────────────────────────────────
      h(2, text('3. Policy Statement')),
      p(
        text(
          'It is the policy of this Residential Treatment Home that all medications shall be administered, stored, and disposed of in a manner that ensures the safety and well-being of residents, prevents medication errors and diversion, and complies with all applicable Oregon Administrative Rules, Oregon Revised Statutes, and federal regulations. Only personnel who have completed the facility\'s approved medication training program shall administer medications to residents.',
        ),
      ),
      p(
        text(
          'The facility shall maintain a current Medication Administration Record (MAR) for each resident. All medication orders shall originate from a licensed prescriber and shall be verified by qualified staff before the first dose is administered. No medication shall be administered without a valid, current order.',
        ),
      ),
      p(
        text(
          'Controlled substances shall be subject to additional safeguards, including double-lock storage, dual-signature counts at each shift change, and immediate reporting of any discrepancy to the Program Director and, when required, to the appropriate regulatory authority.',
        ),
      ),

      // ── 4. Definitions ──────────────────────────────────────────────
      h(2, text('4. Definitions')),
      p(
        bold('Medication: '),
        text(
          'Any substance prescribed or ordered by a licensed prescriber for the diagnosis, cure, mitigation, treatment, or prevention of disease, or any substance recognized in the United States Pharmacopeia or National Formulary.',
        ),
      ),
      p(
        bold('Controlled Substance: '),
        text(
          'Any drug or substance listed in Schedules I through V of the federal Controlled Substances Act (21 U.S.C. §812) or classified as a controlled substance under Oregon Revised Statutes Chapter 475. Examples include opioid analgesics, benzodiazepines, and stimulant medications.',
        ),
      ),
      p(
        bold('PRN Medication: '),
        text(
          'A medication ordered by a prescriber to be administered on an "as needed" basis according to specified parameters, including indication, dose, frequency limits, and maximum daily dose.',
        ),
      ),
      p(
        bold('Over-the-Counter (OTC): '),
        text(
          'A medication that may be purchased without a prescription but, when used in the facility, must still be ordered or approved by the resident\'s prescriber and documented on the MAR.',
        ),
      ),
      p(
        bold('Medication Administration Record (MAR): '),
        text(
          'A document — electronic or paper — that serves as the legal record of every medication administered to a resident, including the date, time, dose, route, administering staff member, and any relevant observations.',
        ),
      ),
      p(
        bold('Prescriber: '),
        text(
          'A physician (MD or DO), nurse practitioner (NP), physician assistant (PA), dentist, or other practitioner authorized under Oregon law to prescribe medications.',
        ),
      ),
      p(
        bold('Self-Administration: '),
        text(
          'The act of a resident managing and taking their own medications independently, as documented in an individualized self-administration assessment approved by the treatment team and the prescriber.',
        ),
      ),
      p(
        bold('Medication Error: '),
        text(
          'Any preventable event that may cause or lead to inappropriate medication use or resident harm while the medication is in the control of the facility. This includes wrong resident, wrong medication, wrong dose, wrong route, wrong time, and omission errors.',
        ),
      ),

      // ── 5. Procedures for Receiving Medications ─────────────────────
      h(2, text('5. Procedures for Receiving Medications')),
      ol(
        li(
          p(
            text(
              'All medications delivered to the facility — whether by pharmacy courier, mail-order service, family member, or resident upon admission — shall be received by a designated trained staff member and documented on the Medication Intake Log within one hour of receipt.',
            ),
          ),
        ),
        li(
          p(
            text(
              'The receiving staff member shall verify the resident\'s name, medication name, dosage form, strength, quantity, prescriber name, and pharmacy label against the current medication order on file. Any discrepancy shall be reported to the pharmacy and the Program Director before the medication is stored.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Controlled substances shall be counted by two staff members at the time of receipt. Both staff members shall sign the Controlled Substance Receipt Log with the date, time, medication name, strength, quantity received, and both signatures.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Medications requiring refrigeration shall be placed in the designated medication refrigerator immediately upon receipt. The refrigerator temperature shall be verified to be between 36°F and 46°F (2°C and 8°C) before storage.',
            ),
          ),
        ),
        li(
          p(
            text(
              'No medication shall be accepted if the packaging is damaged, the expiration date has passed, or the label is illegible. Such medications shall be returned to the pharmacy with documentation of the reason for refusal.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Sample medications provided by a prescriber may be accepted only if accompanied by a written order and properly labeled with the resident\'s name, medication name, strength, directions for use, and prescriber name.',
            ),
          ),
        ),
      ),

      // ── 6. Procedures for Verification ──────────────────────────────
      h(2, text('6. Procedures for Verification')),
      ol(
        li(
          p(
            text(
              'Before the first dose of any new medication is administered, a designated staff member shall verify the prescriber\'s order against the pharmacy label. The verification shall confirm: resident name, medication name, dose, route, frequency, and any special instructions.',
            ),
          ),
        ),
        li(
          p(
            text(
              'The verifying staff member shall document the verification on the MAR by initialing the "New Order Verified" field and recording the date and time of verification.',
            ),
          ),
        ),
        li(
          p(
            text(
              'If a verbal or telephone order is received, the staff member shall read the order back to the prescriber to confirm accuracy. Verbal orders shall be documented immediately and co-signed by the prescriber within 72 hours.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Any medication order that is unclear, incomplete, or potentially contraindicated shall not be administered until the prescriber has been contacted and the order has been clarified or corrected in writing.',
            ),
          ),
        ),
        li(
          p(
            text(
              'A complete medication reconciliation shall be performed at admission, upon return from any hospital stay or leave of absence exceeding 24 hours, and whenever a new prescriber assumes care of the resident.',
            ),
          ),
        ),
      ),

      // ── 7. Procedures for Storage ───────────────────────────────────
      h(2, text('7. Procedures for Storage')),
      ol(
        li(
          p(
            text(
              'All medications shall be stored in a locked cabinet, closet, or room that is accessible only to authorized personnel. The medication storage area shall be clean, dry, well-lit, and maintained at a temperature between 59°F and 77°F (15°C and 25°C) unless specific medications require alternative conditions.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Controlled substances shall be stored in a separately locked container (double-lock system) within the locked medication storage area. The inner lock shall use a different key or combination than the outer lock. Only the Program Director and designated staff shall have access to both keys.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Medications requiring refrigeration shall be stored in a dedicated medication refrigerator or in a locked container within a shared refrigerator. The refrigerator temperature shall be logged twice daily (morning and evening shifts) and maintained between 36°F and 46°F (2°C and 8°C).',
            ),
          ),
        ),
        li(
          p(
            text(
              'External-use medications (topical creams, eye drops, ear drops) shall be stored separately from internal-use medications to prevent cross-contamination and administration errors.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Each resident\'s medications shall be stored in an individually labeled container or bin within the medication storage area. Medications shall not be commingled between residents under any circumstances.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Emergency medications (e.g., epinephrine auto-injectors, naloxone) shall be stored in a readily accessible location known to all on-duty staff. The location shall be clearly marked and the expiration dates checked monthly.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Medication storage areas shall be inspected monthly by the Program Director or designee. The inspection shall verify proper temperature, cleanliness, organization, absence of expired medications, and integrity of controlled substance locks. Inspection results shall be documented on the Medication Storage Inspection Log.',
            ),
          ),
        ),
      ),

      // ── 8. Procedures for Administration ────────────────────────────
      h(2, text('8. Procedures for Administration')),
      ol(
        li(
          p(
            text(
              'Only staff who have successfully completed the facility\'s Medication Administration Training and demonstrated competency may administer medications. Competency shall be verified annually through direct observation and written examination.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Before administering any medication the staff member shall verify the "Six Rights": Right Resident, Right Medication, Right Dose, Right Route, Right Time, and Right Documentation.',
            ),
          ),
        ),
        li(
          p(
            text(
              'The staff member shall perform hand hygiene immediately before preparing and administering medications. Gloves shall be worn when administering topical medications or when there is potential for contact with bodily fluids.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Medications shall be administered within one hour before or after the scheduled time unless the prescriber\'s order specifies a more restrictive timeframe. Time-critical medications (e.g., insulin, anticoagulants) shall be administered within 30 minutes of the ordered time.',
            ),
          ),
        ),
        li(
          p(
            text(
              'The staff member shall remain with the resident until oral medications have been swallowed. Medications shall not be left at the bedside or on a table for the resident to take later unless a self-administration protocol is in effect.',
            ),
          ),
        ),
        li(
          p(
            text(
              'For PRN medications, the staff member shall assess and document the indication, notify the resident of the medication being administered, administer the dose, and follow up within the timeframe specified in the order to evaluate effectiveness. The follow-up assessment shall be recorded on the MAR.',
            ),
          ),
        ),
        li(
          p(
            text(
              'If a resident refuses a medication, the staff member shall document the refusal on the MAR including the reason given. If the refused medication is critical to the resident\'s health, the prescriber and Program Director shall be notified within two hours.',
            ),
          ),
        ),
      ),

      // ── 9. Procedures for Documentation ─────────────────────────────
      h(2, text('9. Procedures for Documentation')),
      ol(
        li(
          p(
            text(
              'Every medication administered shall be documented on the resident\'s MAR immediately after administration. The entry shall include the date, time, medication name, dose, route, and the initials or electronic signature of the administering staff member.',
            ),
          ),
        ),
        li(
          p(
            text(
              'PRN medication entries shall additionally include the reason for administration, the time of follow-up assessment, and the resident\'s response to the medication.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Controlled substance administration shall be documented on both the MAR and the Controlled Substance Count Log. The count log shall reflect the running balance after each dose administered.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Medication refusals, omissions, and held doses shall be documented on the MAR with a corresponding note explaining the circumstance. The prescriber shall be notified of patterns of refusal or any single refusal of a critical medication.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Medication errors and adverse reactions shall be documented on an Incident Report in addition to the MAR entry. The Incident Report shall be completed before the end of the shift in which the event occurred.',
            ),
          ),
        ),
        li(
          p(
            text(
              'All MARs shall be reviewed by the Program Director or designee at least monthly for completeness, accuracy, and compliance with current orders. Discrepancies shall be corrected and the corrective action documented.',
            ),
          ),
        ),
      ),

      // ── 10. Procedures for Disposal ─────────────────────────────────
      h(2, text('10. Procedures for Disposal')),
      ol(
        li(
          p(
            text(
              'Expired, discontinued, or damaged medications shall be segregated from active medications immediately upon identification and stored in a clearly labeled "Awaiting Disposal" container within the locked medication area.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Non-controlled medications shall be disposed of by returning them to the pharmacy or through a DEA-authorized collection program. If neither option is available, non-controlled medications may be rendered irretrievable by mixing them with an undesirable substance (e.g., coffee grounds, kitty litter) and placed in a sealed container in the facility\'s regular waste.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Controlled substances shall be disposed of only by two authorized staff members together. Both staff members shall verify the medication name, strength, quantity, and resident name. The disposal shall be witnessed, and both staff shall sign the Controlled Substance Disposal Log with the date, time, method of disposal, and signatures.',
            ),
          ),
        ),
        li(
          p(
            text(
              'Medications belonging to a resident who has been discharged or transferred shall be returned to the resident if clinically appropriate and legally permissible. Otherwise, the medications shall be disposed of according to the procedures described above within 30 days of discharge.',
            ),
          ),
        ),
        li(
          p(
            text(
              'All disposal activities shall be documented and the documentation retained for at least seven years in accordance with OAR recordkeeping requirements.',
            ),
          ),
        ),
      ),

      // ── 11. Self-Administration Assessment ──────────────────────────
      h(2, text('11. Self-Administration Assessment')),
      p(
        text(
          'A resident may self-administer medications only after a formal Self-Administration Assessment has been completed by a qualified clinician and approved by the prescriber. The assessment shall evaluate the resident\'s understanding of each medication\'s name, purpose, dose, timing, potential side effects, and proper storage requirements.',
        ),
      ),
      p(
        text(
          'The assessment shall be documented using the facility\'s Self-Administration Assessment Form and shall be reviewed at least every 90 days or whenever there is a significant change in the resident\'s medications, cognitive status, or clinical condition. Approval for self-administration may be revoked at any time if the treatment team determines that the resident can no longer safely manage their own medications.',
        ),
      ),
      p(
        text(
          'Residents approved for self-administration shall be provided with a lockable container for storing their medications in their room. Controlled substances are not eligible for self-administration and must remain in the facility\'s double-locked storage at all times.',
        ),
      ),

      // ── 12. Medication Errors and Adverse Reactions ─────────────────
      h(2, text('12. Medication Errors and Adverse Reactions')),
      p(
        text(
          'A medication error is defined as any preventable event that may cause or lead to inappropriate medication use or resident harm. Examples include administration of the wrong medication, wrong dose, wrong route, wrong time, omission of a scheduled dose, or administration to the wrong resident.',
        ),
      ),
      p(
        text(
          'When a medication error or adverse reaction occurs, the staff member shall immediately assess the resident\'s condition and provide any necessary first aid or emergency intervention. The resident\'s prescriber shall be contacted without delay. If the resident\'s condition warrants, emergency medical services (911) shall be activated.',
        ),
      ),
      p(
        text(
          'The staff member shall notify the on-duty supervisor and the Program Director as soon as the resident has been stabilized. An Incident Report shall be completed before the end of the shift. The report shall include a factual description of the event, the resident\'s condition, interventions taken, prescriber notification details, and the outcome.',
        ),
      ),
      p(
        text(
          'All medication errors shall be reviewed by the Program Director within 48 hours. Systemic issues shall be addressed through the facility\'s Quality Improvement process. A pattern of errors by an individual staff member shall trigger additional training, supervised practice, and, if necessary, removal of medication administration privileges.',
        ),
      ),

      // ── 13. Staff Responsibilities ──────────────────────────────────
      h(2, text('13. Staff Responsibilities')),
      ul(
        li(
          p(
            bold('Program Director: '),
            text(
              'Has overall accountability for medication management in the facility. Ensures that all policies and procedures are current, staff are trained and competent, controlled substance counts are accurate, and medication incidents are investigated and corrective actions implemented.',
            ),
          ),
        ),
        li(
          p(
            bold('Shift Supervisor: '),
            text(
              'Oversees medication administration during their shift. Conducts shift-change controlled substance counts with both outgoing and incoming staff. Reviews MARs for completeness and accuracy before the end of each shift.',
            ),
          ),
        ),
        li(
          p(
            bold('Medication-Trained Direct Care Staff: '),
            text(
              'Administers medications in accordance with this policy and the prescriber\'s orders. Documents all administrations, refusals, and observations on the MAR. Reports errors, adverse reactions, and discrepancies immediately to the Shift Supervisor.',
            ),
          ),
        ),
        li(
          p(
            bold('Consulting Pharmacist or Nurse (if applicable): '),
            text(
              'Reviews medication regimens quarterly or as contracted. Provides consultation on drug interactions, side effects, and storage requirements. Assists with medication reconciliation and staff training as needed.',
            ),
          ),
        ),
        li(
          p(
            bold('All Staff: '),
            text(
              'Shall never administer medications unless specifically trained and authorized. Shall report any observed medication mishandling, diversion, or unsafe practices to the Program Director immediately.',
            ),
          ),
        ),
      ),

      // ── 14. Training Requirements ───────────────────────────────────
      h(2, text('14. Training Requirements')),
      p(
        text(
          'All staff who administer medications shall complete an initial Medication Administration Training program of at least eight hours before administering any medications independently. The training shall cover medication terminology, the six rights of medication administration, routes of administration, documentation procedures, controlled substance handling, infection control, medication storage requirements, error reporting, and emergency procedures.',
        ),
      ),
      p(
        text(
          'Competency shall be demonstrated through a written examination (minimum passing score of 80%) and a direct-observation practical evaluation conducted by the Program Director or a licensed health professional. Competency evaluations shall be repeated annually.',
        ),
      ),
      p(
        text(
          'All medication-related training shall be documented in each staff member\'s personnel file, including the date, duration, topics covered, trainer name and credentials, and competency evaluation results.',
        ),
      ),

      // ── 15. Documentation Requirements ──────────────────────────────
      h(2, text('15. Documentation Requirements')),
      p(
        text('The following records shall be maintained by the facility:'),
      ),
      ul(
        li(p(text('Current Medication Administration Records (MARs) for each resident'))),
        li(p(text('Controlled Substance Receipt Logs'))),
        li(p(text('Controlled Substance Count Logs (shift-change counts)'))),
        li(p(text('Controlled Substance Disposal Logs'))),
        li(p(text('Medication Intake Logs'))),
        li(p(text('Medication Storage Inspection Logs'))),
        li(p(text('Refrigerator Temperature Logs'))),
        li(p(text('Self-Administration Assessment Forms'))),
        li(p(text('Medication Error / Incident Reports'))),
        li(p(text('Staff Medication Training Records and Competency Evaluations'))),
      ),
      p(
        text(
          'All medication-related documentation shall be retained for a minimum of seven years from the date of the last entry, or longer if required by applicable Oregon statute or federal regulation.',
        ),
      ),

      // ── 16. Regulatory References ───────────────────────────────────
      h(2, text('16. Regulatory References')),
      ul(
        li(p(text('OAR 309-035-0150 — Medication Management in Residential Treatment Homes'))),
        li(p(text('OAR 309-035-0100 through 0190 — General Standards for RTH Programs'))),
        li(p(text('Oregon Revised Statutes Chapter 475 — Controlled Substances'))),
        li(p(text('21 U.S.C. §812 — Federal Controlled Substances Schedules'))),
        li(p(text('Oregon State Board of Pharmacy Rules'))),
        li(p(text('Oregon Health Authority Behavioral Health Division Licensing Standards'))),
      ),

      // ── 17. Approval and Signature ──────────────────────────────────
      h(2, text('17. Approval and Signature')),
      p(
        text(
          'This policy has been reviewed and approved by the undersigned. It shall be reviewed at least annually and revised as necessary to maintain compliance with current Oregon Administrative Rules and best practices in medication management.',
        ),
      ),
      p(
        text(
          'Program Director Signature: ____________________________   Date: ____________',
        ),
      ),
      p(
        text(
          'Medical Consultant Signature: ____________________________   Date: ____________',
        ),
      ),
      p(
        text(
          'Quality Assurance Reviewer Signature: ____________________________   Date: ____________',
        ),
      ),
    ],
  },
};

// =============================================================================
// TEMPLATE 2 — HIPAA Release of Information Form
// =============================================================================
const hipaaReleaseForm: DocumentTemplate = {
  id: 'rth-hipaa-release-of-information',
  title: 'HIPAA Release of Information Form',
  doc_type: 'form',
  program_type: 'rth',
  agency: 'OHA — Behavioral Health Division',
  category: 'form',
  description:
    'Authorization form for the release of protected health information in compliance with HIPAA (45 CFR §164) and Oregon Administrative Rules governing behavioral health records.',
  oar_reference: 'OAR 309-035-0200, 45 CFR §164',
  is_premium: false,
  sort_order: 2,
  content: {
    type: 'doc',
    content: [
      // ── Title ───────────────────────────────────────────────────────
      h(1, text('Authorization for Release of Protected Health Information')),
      p(
        text(
          'This form authorizes the disclosure of protected health information (PHI) in accordance with the Health Insurance Portability and Accountability Act (HIPAA), 45 CFR §164, and Oregon Administrative Rules governing the confidentiality of behavioral health and substance use disorder records.',
        ),
      ),

      // ── Resident Information ────────────────────────────────────────
      h(2, text('Section I — Resident Information')),
      p(bold('Full Legal Name: '), text('________________________________________')),
      p(bold('Date of Birth: '), text('______ / ______ / __________')),
      p(bold('Last Four Digits of SSN: '), text('XXX-XX- ________')),
      p(bold('Current Address: '), text('________________________________________')),
      p(bold('City / State / ZIP: '), text('________________________________________')),
      p(bold('Phone Number: '), text('(______) ______-__________')),
      p(bold('Email Address: '), text('________________________________________')),
      p(
        text(
          'The above information is required to positively identify the individual whose records are the subject of this authorization.',
        ),
      ),

      // ── Authorization to Release ────────────────────────────────────
      h(2, text('Section II — Authorization to Release')),
      p(
        text(
          'I, the undersigned, hereby authorize the following party to disclose my protected health information:',
        ),
      ),
      p(bold('Disclosing Party (Name of Facility / Provider): '), text('________________________________________')),
      p(bold('Address: '), text('________________________________________')),
      p(bold('Phone / Fax: '), text('________________________________________')),
      p(text('TO the following receiving party:')),
      p(bold('Receiving Party (Name of Person / Organization): '), text('________________________________________')),
      p(bold('Address: '), text('________________________________________')),
      p(bold('Phone / Fax: '), text('________________________________________')),
      p(
        text(
          'The disclosing party is authorized to share the information specified below with the receiving party only. Any re-disclosure of the information by the receiving party may not be protected by federal or state confidentiality laws.',
        ),
      ),

      // ── Information to Be Disclosed ─────────────────────────────────
      h(2, text('Section III — Information to Be Disclosed')),
      p(
        text(
          'I authorize the release of the following categories of information (check all that apply):',
        ),
      ),
      ul(
        li(p(text('Mental health assessment and treatment records'))),
        li(p(text('Substance use disorder assessment and treatment records (42 CFR Part 2 protected)'))),
        li(p(text('Medication records, including prescriptions and Medication Administration Records'))),
        li(p(text('Individualized treatment plans and treatment plan reviews'))),
        li(p(text('Progress notes and clinical observations'))),
        li(p(text('Discharge summaries and aftercare plans'))),
        li(p(text('Laboratory results and diagnostic testing'))),
        li(p(text('Psychological or neuropsychological evaluation reports'))),
        li(p(text('Incident reports (with resident identifying information only)'))),
        li(
          p(
            text(
              'Other (specify): ________________________________________',
            ),
          ),
        ),
      ),
      p(
        bold('Date Range of Records: '),
        text('From ______ / ______ / __________ To ______ / ______ / __________'),
      ),
      p(
        text(
          'Note: Records protected under 42 CFR Part 2 (substance use disorder treatment records) require this specific written authorization and may not be re-disclosed without the express written consent of the individual.',
        ),
      ),

      // ── Purpose of Disclosure ───────────────────────────────────────
      h(2, text('Section IV — Purpose of Disclosure')),
      p(
        text(
          'The purpose of this disclosure is (check all that apply):',
        ),
      ),
      ul(
        li(p(text('Continuity of care / coordination of treatment'))),
        li(p(text('Referral to another treatment provider or level of care'))),
        li(p(text('Legal proceedings or court order'))),
        li(p(text('Insurance or benefits determination'))),
        li(p(text('Personal records requested by the individual'))),
        li(p(text('Other (specify): ________________________________________'))),
      ),
      p(
        text(
          'If the purpose of disclosure is not specified, the authorization is considered to be at the request of the individual for their own use.',
        ),
      ),

      // ── Expiration ──────────────────────────────────────────────────
      h(2, text('Section V — Expiration')),
      p(
        text(
          'This authorization shall expire on the following date or event: ______ / ______ / __________. If no date is specified, this authorization shall expire automatically one year from the date of the individual\'s signature below, or upon discharge from the facility, whichever occurs first.',
        ),
      ),
      p(
        text(
          'Upon expiration, no further disclosures shall be made under this authorization. Any disclosures made prior to the expiration date or prior to receipt of a written revocation remain lawful and are not affected by the expiration or revocation.',
        ),
      ),

      // ── Right to Revoke ─────────────────────────────────────────────
      h(2, text('Section VI — Right to Revoke')),
      p(
        text(
          'I understand that I have the right to revoke this authorization at any time by submitting a written revocation to the disclosing party identified in Section II above. I understand that a revocation is not effective to the extent that the disclosing party has already acted in reliance on this authorization prior to receiving my written revocation, as specified in 45 CFR §164.508(b)(5).',
        ),
      ),
      p(
        text(
          'I understand that I may revoke this authorization by delivering a signed, written revocation to the Program Director of the disclosing facility. The revocation shall be effective upon receipt by the facility.',
        ),
      ),
      p(
        text(
          'I further understand that revocation of this authorization does not apply to information that has already been disclosed in reliance on this authorization, and that the disclosing party may retain a copy of this authorization and any revocation for its records.',
        ),
      ),

      // ── Understanding and Consent ───────────────────────────────────
      h(2, text('Section VII — Understanding and Consent')),
      p(
        text(
          'By signing this form, I acknowledge and confirm the following:',
        ),
      ),
      ul(
        li(
          p(
            text(
              'I have read this authorization in its entirety, or it has been read to me, and I understand its contents.',
            ),
          ),
        ),
        li(
          p(
            text(
              'I am signing this authorization voluntarily. My treatment, payment, enrollment, or eligibility for benefits will not be conditioned on whether I sign this authorization, except where the disclosure is necessary to determine eligibility for benefits or enrollment.',
            ),
          ),
        ),
        li(
          p(
            text(
              'I understand that information disclosed under this authorization may be subject to re-disclosure by the recipient and may no longer be protected by HIPAA, although re-disclosure of substance use disorder records is prohibited under 42 CFR Part 2 without additional authorization.',
            ),
          ),
        ),
        li(
          p(
            text(
              'I have been informed of my right to receive a copy of this signed authorization for my personal records.',
            ),
          ),
        ),
        li(
          p(
            text(
              'I understand that I may refuse to sign this authorization and that such refusal will not affect my ability to receive treatment at the facility.',
            ),
          ),
        ),
      ),

      // ── Signatures ─────────────────────────────────────────────────
      h(2, text('Section VIII — Signatures')),
      p(
        bold('Signature of Resident (or Legal Representative): '),
        text('____________________________'),
      ),
      p(bold('Printed Name: '), text('________________________________________')),
      p(bold('Date: '), text('______ / ______ / __________')),
      p(
        bold('Relationship to Resident (if signed by legal representative): '),
        text('____________________________'),
      ),
      p(text('')),
      p(
        bold('Witness Signature: '),
        text('____________________________'),
      ),
      p(bold('Witness Printed Name: '), text('________________________________________')),
      p(bold('Date: '), text('______ / ______ / __________')),
      p(text('')),
      p(
        bold('Staff Member Receiving Form: '),
        text('____________________________'),
      ),
      p(bold('Title: '), text('________________________________________')),
      p(bold('Date Received: '), text('______ / ______ / __________')),
    ],
  },
};

// =============================================================================
// TEMPLATE 3 — Operational Plan
// =============================================================================
const operationalPlan: DocumentTemplate = {
  id: 'rth-operational-plan',
  title: 'Operational Plan',
  doc_type: 'operational',
  program_type: 'rth',
  agency: 'OHA — Behavioral Health Division',
  category: 'operational',
  description:
    'Comprehensive operational plan for a Residential Treatment Home, addressing all required components under OAR 309-035-0120 including staffing, services, safety, resident rights, and quality improvement.',
  oar_reference: 'OAR 309-035-0120',
  is_premium: true,
  sort_order: 3,
  content: {
    type: 'doc',
    content: [
      // ── Title ───────────────────────────────────────────────────────
      h(1, text('Residential Treatment Home — Operational Plan')),
      p(
        text(
          'This Operational Plan is submitted in compliance with Oregon Administrative Rule 309-035-0120 and describes the organizational structure, staffing, services, and operational procedures of this Residential Treatment Home (RTH). It shall be reviewed and updated at least annually, or whenever a material change occurs in the program\'s operations, staffing model, or service array.',
        ),
      ),

      // ── 1. Program Overview ─────────────────────────────────────────
      h(2, text('1. Program Overview')),
      p(
        text(
          'This Residential Treatment Home provides 24-hour supervised residential treatment services for adults with mental health disorders, co-occurring substance use disorders, or both. The program operates under the authority of the Oregon Health Authority (OHA) Behavioral Health Division and is licensed in accordance with OAR 309-035-0100 through 309-035-0300.',
        ),
      ),
      p(
        text(
          'The facility is located in a residential neighborhood and is designed to provide a home-like therapeutic environment while delivering evidence-based clinical services. The program is committed to person-centered, trauma-informed, culturally responsive care that supports each resident\'s recovery, independence, and successful reintegration into the community.',
        ),
      ),
      p(
        text(
          'The program holds a current license issued by the OHA and maintains all required liability insurance, fire safety certifications, and local business permits. The facility is inspected at least annually by OHA and is subject to unannounced compliance reviews.',
        ),
      ),

      // ── 2. Mission Statement ────────────────────────────────────────
      h(2, text('2. Mission Statement')),
      p(
        text(
          'Our mission is to provide compassionate, evidence-based residential treatment in a safe, structured, and supportive environment that empowers individuals to achieve sustainable recovery, build resilience, and lead fulfilling lives in their communities. We are guided by the principles of respect, dignity, cultural humility, and the belief that recovery is possible for everyone.',
        ),
      ),
      p(
        text(
          'We achieve this mission by delivering individualized treatment planning, coordinated clinical services, and robust community integration support, all within a framework that honors each person\'s unique strengths, needs, preferences, and cultural background.',
        ),
      ),

      // ── 3. Facility Type and Capacity ───────────────────────────────
      h(2, text('3. Facility Type and Capacity')),
      p(
        text(
          'This facility is classified as a Residential Treatment Home (RTH) under OAR 309-035-0100. The maximum licensed capacity is [INSERT NUMBER] residents. The home is a single-family residential structure that has been adapted to meet all applicable building, fire, safety, and accessibility codes.',
        ),
      ),
      p(
        text(
          'The facility includes private and semi-private bedrooms, shared common areas including a living room, dining room, and recreation space, a fully equipped kitchen, medication storage area, staff office, and outdoor space. All areas of the home are accessible to residents with mobility limitations in compliance with the Americans with Disabilities Act (ADA) and applicable Oregon accessibility standards.',
        ),
      ),
      p(
        text(
          'Occupancy shall not exceed the licensed capacity at any time. Respite or temporary beds, if offered, shall be counted toward the total licensed capacity.',
        ),
      ),

      // ── 4. Target Population ────────────────────────────────────────
      h(2, text('4. Target Population')),
      p(
        text(
          'The program serves adults aged 18 and older who have been diagnosed with one or more of the following conditions: serious and persistent mental illness (SPMI), including but not limited to schizophrenia spectrum disorders, bipolar disorder, major depressive disorder, and post-traumatic stress disorder; co-occurring substance use disorders; and co-occurring intellectual or developmental disabilities when the primary need is behavioral health treatment.',
        ),
      ),
      p(
        text(
          'Residents typically present with functional impairments that prevent them from living independently in the community without structured support. Common characteristics of the population served include a history of psychiatric hospitalization, chronic homelessness, involvement with the criminal justice system, difficulty maintaining stable housing and employment, and limited natural support systems.',
        ),
      ),
      p(
        text(
          'The program does not accept individuals whose primary treatment need is medical detoxification, individuals who pose an imminent and unmanageable risk of harm to themselves or others, individuals who require 24-hour skilled nursing care, or registered sex offenders when prohibited by local zoning or licensing restrictions.',
        ),
      ),
      p(
        text(
          'Admission decisions are made without regard to race, ethnicity, national origin, religion, gender identity, sexual orientation, disability, or payer source, consistent with federal and state civil rights laws.',
        ),
      ),

      // ── 5. Staffing Model — 24-Hour Coverage ────────────────────────
      h(2, text('5. Staffing Model — 24-Hour Coverage')),
      p(
        text(
          'The program maintains awake, on-site staff coverage 24 hours per day, 7 days per week, 365 days per year. The staffing model is designed to ensure the safety and therapeutic engagement of all residents at all times. The following shifts are maintained:',
        ),
      ),
      ul(
        li(
          p(
            bold('Day Shift (7:00 AM – 3:00 PM): '),
            text(
              'Minimum of [INSERT NUMBER] direct care staff on-site, plus the Program Director or Clinical Supervisor. This shift supports morning medication administration, group programming, individual sessions, and coordination with external providers.',
            ),
          ),
        ),
        li(
          p(
            bold('Swing Shift (3:00 PM – 11:00 PM): '),
            text(
              'Minimum of [INSERT NUMBER] direct care staff on-site. This shift supports afternoon and evening programming, dinner, evening medication administration, community outings, and structured recreation.',
            ),
          ),
        ),
        li(
          p(
            bold('Overnight Shift (11:00 PM – 7:00 AM): '),
            text(
              'Minimum of [INSERT NUMBER] awake staff on-site at all times. Overnight staff conduct regular wellness checks at intervals not exceeding 60 minutes, respond to resident needs, ensure building security, and complete required documentation.',
            ),
          ),
        ),
      ),
      p(
        text(
          'The Program Director or Clinical Supervisor is available by phone during all non-business hours and shall be able to respond on-site within 30 minutes if needed. Staff-to-resident ratios shall never fall below the minimums required by OAR 309-035-0120 and the facility\'s approved operational plan.',
        ),
      ),

      // ── 6. Staff Qualifications ─────────────────────────────────────
      h(2, text('6. Staff Qualifications')),
      p(
        text(
          'The Program Director shall possess a master\'s degree in a behavioral health discipline (social work, counseling, psychology) and hold current Oregon licensure (LCSW, LPC, or equivalent), or a bachelor\'s degree with a minimum of five years of supervisory experience in a residential behavioral health setting. The Program Director shall have demonstrated knowledge of Oregon Administrative Rules applicable to RTH programs.',
        ),
      ),
      p(
        text(
          'Clinical staff providing direct therapeutic services (individual therapy, group therapy, assessment) shall hold current Oregon licensure or be registered as an associate-level clinician under the supervision of a licensed professional.',
        ),
      ),
      p(
        text(
          'Direct care staff shall have a minimum of a high school diploma or GED and shall complete the facility\'s pre-service orientation and training program before working independently. Preferred qualifications include Certified Recovery Mentor (CRM) or Peer Support Specialist (PSS) credentials, experience in residential behavioral health settings, and current First Aid / CPR certification.',
        ),
      ),
      p(
        text(
          'All staff shall pass a comprehensive criminal background check through the Oregon Background Check Unit prior to hire and shall maintain eligibility throughout employment. Staff shall not have any founded abuse reports on the OHA abuse registry.',
        ),
      ),

      // ── 7. Supervision Structure ────────────────────────────────────
      h(2, text('7. Supervision Structure')),
      p(
        text(
          'The Program Director provides overall administrative and clinical oversight of the facility. The Program Director directly supervises the Clinical Supervisor (if applicable), the Lead Direct Care Staff, and any contract clinical providers.',
        ),
      ),
      p(
        text(
          'Direct care staff receive a minimum of one hour of individual supervision per month and participate in at least two hours of group supervision or staff meeting time per month. Supervision shall address clinical case review, crisis response review, professional development, policy compliance, and self-care.',
        ),
      ),
      p(
        text(
          'Associate-level clinicians receive clinical supervision in accordance with the requirements of their licensing board. Supervision records shall be maintained in each staff member\'s personnel file.',
        ),
      ),

      // ── 8. Training Plan ────────────────────────────────────────────
      h(2, text('8. Training Plan')),
      p(
        text(
          'All new staff shall complete a pre-service orientation of at least 40 hours before working independently. The orientation includes the following topics:',
        ),
      ),
      ul(
        li(p(text('Facility policies and procedures, including this Operational Plan'))),
        li(p(text('Oregon Administrative Rules governing RTH programs (OAR 309-035)'))),
        li(p(text('Resident rights and grievance procedures'))),
        li(p(text('Trauma-informed care principles and practices'))),
        li(p(text('Cultural competency and health equity'))),
        li(p(text('Crisis prevention, de-escalation, and intervention techniques'))),
        li(p(text('Medication administration training (for staff who will administer medications)'))),
        li(p(text('Infection control and universal precautions'))),
        li(p(text('First Aid, CPR, and AED use'))),
        li(p(text('Mandatory reporting of abuse, neglect, and exploitation'))),
        li(p(text('HIPAA and confidentiality requirements'))),
        li(p(text('Fire safety, emergency evacuation, and disaster response'))),
        li(p(text('Documentation standards and electronic health record use'))),
        li(p(text('Suicide risk assessment and intervention'))),
      ),
      p(
        text(
          'All staff shall complete a minimum of 24 hours of in-service training annually. Training topics shall be determined based on identified needs, incident trends, regulatory changes, and staff development goals. All training shall be documented in the staff member\'s personnel file.',
        ),
      ),

      // ── 9. Admission Process ────────────────────────────────────────
      h(2, text('9. Admission Process')),
      p(
        text(
          'Referrals are accepted from community mental health agencies, hospitals, corrections and parole/probation officers, self-referrals, and other sources. All referrals are screened by the Program Director or Clinical Supervisor to determine preliminary appropriateness based on the program\'s target population, current bed availability, and the applicant\'s assessed needs.',
        ),
      ),
      p(
        text(
          'A pre-admission assessment is conducted either in person or by telehealth and includes a review of the applicant\'s psychiatric history, substance use history, medical history, current medications, legal status, support system, and personal goals. The assessment determines whether the program can safely and effectively meet the applicant\'s needs.',
        ),
      ),
      p(
        text(
          'Upon admission, the resident receives a comprehensive orientation that includes a tour of the facility, introduction to staff and current residents, review of house rules and daily schedule, explanation of resident rights and grievance procedures, completion of all intake paperwork, and a review of the individualized treatment plan development process. The initial individualized treatment plan shall be completed within 14 days of admission.',
        ),
      ),

      // ── 10. Daily Routine Schedule ──────────────────────────────────
      h(2, text('10. Daily Routine Schedule')),
      p(
        text(
          'The following daily schedule provides a structured, therapeutic framework that balances clinical programming, daily living activities, recreation, and rest. The schedule may be adapted on weekends and holidays to include additional leisure and community activities.',
        ),
      ),
      p(
        bold('6:30 AM — '),
        text('Wake-up. Staff conduct wellness checks and assist residents with morning routines as needed.'),
      ),
      p(
        bold('7:00 AM – 7:45 AM — '),
        text('Breakfast. Residents are encouraged to participate in meal preparation and cleanup as part of daily living skills development.'),
      ),
      p(
        bold('8:00 AM – 8:30 AM — '),
        text('Morning medication administration. Staff administer medications in accordance with the Medication Administration and Storage Policy.'),
      ),
      p(
        bold('8:30 AM – 9:00 AM — '),
        text('Morning community meeting. Residents and staff discuss the day\'s schedule, share goals, and address any immediate concerns.'),
      ),
      p(
        bold('9:00 AM – 11:30 AM — '),
        text('Morning programming block. This includes group therapy sessions (e.g., CBT skills group, process group, psychoeducation), individual therapy appointments, and case management meetings. Programming is aligned with each resident\'s individualized treatment plan.'),
      ),
      p(
        bold('11:30 AM – 12:00 PM — '),
        text('Midday medication administration for residents with noon doses.'),
      ),
      p(
        bold('12:00 PM – 12:45 PM — '),
        text('Lunch. Menus are planned to meet nutritional guidelines and accommodate dietary restrictions and cultural food preferences.'),
      ),
      p(
        bold('1:00 PM – 3:00 PM — '),
        text('Afternoon programming block. Activities include life skills training (budgeting, cooking, job readiness), creative arts therapy, physical wellness activities, community outings for appointments, and peer support group sessions.'),
      ),
      p(
        bold('3:00 PM – 3:30 PM — '),
        text('Shift change. Day shift staff brief swing shift staff on resident status, incidents, and upcoming appointments. Controlled substance count completed by outgoing and incoming staff.'),
      ),
      p(
        bold('3:30 PM – 5:00 PM — '),
        text('Free time and self-directed activities. Residents may use this time for personal phone calls, reading, journaling, exercise, or visiting with approved guests.'),
      ),
      p(
        bold('5:00 PM – 5:45 PM — '),
        text('Dinner. Evening medication administration occurs concurrently for residents with dinnertime doses.'),
      ),
      p(
        bold('6:00 PM – 7:30 PM — '),
        text('Evening programming. This may include 12-step or mutual aid meetings (on-site or in the community), relapse prevention group, recreational activities, or movie and discussion night.'),
      ),
      p(
        bold('7:30 PM – 9:00 PM — '),
        text('Free time. Residents may socialize, watch television, work on personal projects, or participate in quiet activities.'),
      ),
      p(
        bold('9:00 PM — '),
        text('Evening snack available. Bedtime medication administration for residents with evening doses.'),
      ),
      p(
        bold('10:00 PM — '),
        text('Quiet hours begin. All residents are expected to be in their rooms. Lights out is encouraged but not mandatory for residents who wish to read or engage in quiet personal activities in their rooms.'),
      ),
      p(
        bold('11:00 PM – 7:00 AM — '),
        text('Overnight. Awake staff maintain building security and conduct wellness checks at least hourly. Staff complete required documentation and prepare for the following day\'s activities.'),
      ),

      // ── 11. Core Treatment Services ─────────────────────────────────
      h(2, text('11. Core Treatment Services')),
      p(
        text('The program offers the following core treatment services:'),
      ),
      ul(
        li(
          p(
            bold('Individual Therapy: '),
            text('Each resident receives a minimum of one hour of individual therapy per week from a licensed or associate-level clinician. Therapeutic modalities include Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT) skills, Motivational Interviewing (MI), and trauma-focused approaches such as EMDR or Seeking Safety.'),
          ),
        ),
        li(
          p(
            bold('Group Therapy: '),
            text('A minimum of five structured group therapy sessions are offered per week, covering topics such as coping skills, emotion regulation, interpersonal effectiveness, substance use psychoeducation, and relapse prevention.'),
          ),
        ),
        li(
          p(
            bold('Psychiatric Services: '),
            text('A psychiatrist or psychiatric nurse practitioner provides medication evaluation and management services on-site or via telehealth at least bi-weekly. Emergency psychiatric consultation is available 24/7 through the program\'s on-call provider or the local crisis line.'),
          ),
        ),
        li(
          p(
            bold('Case Management: '),
            text('Staff coordinate with external providers, insurance companies, housing agencies, employment services, and natural supports to facilitate continuity of care and community reintegration. Each resident has an identified case manager.'),
          ),
        ),
        li(
          p(
            bold('Peer Support: '),
            text('Certified Peer Support Specialists or Certified Recovery Mentors provide mentoring, advocacy, and recovery coaching grounded in shared lived experience.'),
          ),
        ),
        li(
          p(
            bold('Life Skills Training: '),
            text('Structured programming addresses daily living skills including meal planning and preparation, household management, personal hygiene, budgeting and money management, transportation navigation, and use of community resources.'),
          ),
        ),
      ),

      // ── 12. Individual Treatment Plans ──────────────────────────────
      h(2, text('12. Individual Treatment Plans')),
      p(
        text(
          'An individualized treatment plan shall be developed for each resident within 14 calendar days of admission. The treatment plan is developed collaboratively by the resident, the assigned clinician, and other members of the treatment team. The plan reflects the resident\'s strengths, needs, preferences, cultural considerations, and personal recovery goals.',
        ),
      ),
      p(
        text(
          'Each treatment plan shall include a comprehensive assessment summary, identified diagnoses, measurable goals and objectives with target dates, specific interventions and the responsible staff for each, frequency and type of services to be provided, crisis and safety planning, and discharge criteria and projected length of stay.',
        ),
      ),
      p(
        text(
          'Treatment plans shall be reviewed and updated at least every 90 days, or sooner if there is a significant change in the resident\'s condition, needs, or preferences. The resident shall participate in all treatment plan reviews and shall receive a copy of the current plan. Treatment plan reviews shall be documented in the clinical record.',
        ),
      ),

      // ── 13. Safety Protocols ────────────────────────────────────────
      h(2, text('13. Safety Protocols')),
      p(
        text(
          'The safety of residents and staff is the highest priority of the program. The following safety protocols are maintained:',
        ),
      ),
      ul(
        li(p(text('All exterior doors are equipped with alarm systems that alert staff when opened during overnight hours.'))),
        li(p(text('Sharp objects, cleaning chemicals, and other potentially dangerous items are stored in locked areas accessible only to staff.'))),
        li(p(text('Staff conduct visual wellness checks on all residents at intervals not exceeding 60 minutes during overnight hours and more frequently for residents on enhanced observation protocols.'))),
        li(p(text('A contraband search policy is in effect for all new admissions and following any off-site visit, in accordance with the resident handbook.'))),
        li(p(text('The facility maintains functioning smoke detectors, carbon monoxide detectors, fire extinguishers, and a sprinkler system (if required by code). These systems are tested monthly and inspected annually by a licensed fire protection company.'))),
        li(p(text('All staff are trained in crisis de-escalation techniques and are prohibited from using physical restraint or seclusion. The program does not use locked doors or other restrictive interventions.'))),
        li(p(text('A suicide risk screening is completed at intake and repeated whenever clinical indicators warrant. Residents identified as at elevated risk receive an individualized safety plan developed collaboratively with the clinical team.'))),
      ),

      // ── 14. Resident Rights ─────────────────────────────────────────
      h(2, text('14. Resident Rights')),
      p(
        text(
          'Each resident is entitled to the rights guaranteed under OAR 309-035-0160 and Oregon Revised Statutes. These rights are explained to each resident at intake, posted in a common area of the facility, and included in the Resident Handbook. Resident rights include, but are not limited to:',
        ),
      ),
      ul(
        li(p(text('The right to be treated with dignity and respect at all times.'))),
        li(p(text('The right to participate in the development and review of their individualized treatment plan.'))),
        li(p(text('The right to refuse any treatment, medication, or service, with the understanding that consequences of refusal will be explained.'))),
        li(p(text('The right to confidentiality of all personal and clinical information in accordance with HIPAA, 42 CFR Part 2, and Oregon law.'))),
        li(p(text('The right to communicate freely and privately with family, friends, legal counsel, clergy, and advocacy organizations.'))),
        li(p(text('The right to file a grievance without fear of retaliation and to receive a timely response.'))),
        li(p(text('The right to access their own clinical record and to request corrections.'))),
        li(p(text('The right to a safe, clean, and comfortable living environment.'))),
        li(p(text('The right to be free from abuse, neglect, exploitation, and any form of discrimination.'))),
        li(p(text('The right to manage personal funds and property, with assistance if requested.'))),
      ),

      // ── 15. Medication Storage and Administration ───────────────────
      h(2, text('15. Medication Storage and Administration')),
      p(
        text(
          'All medications shall be managed in accordance with the facility\'s Medication Administration and Storage Policy and OAR 309-035-0150. Medications are stored in a locked medication room accessible only to authorized staff. Controlled substances are stored in a separately locked container within the medication room (double-lock system).',
        ),
      ),
      p(
        text(
          'Medications are administered by staff who have completed the approved medication administration training and passed a competency evaluation. Medication Administration Records (MARs) are maintained for each resident and reviewed monthly by the Program Director. Controlled substance counts are conducted at every shift change by two staff members.',
        ),
      ),
      p(
        text(
          'The facility has a current agreement with a licensed pharmacy for medication supply, consultation, and emergency fills. A consulting pharmacist reviews all medication regimens quarterly and provides recommendations to prescribers regarding potential interactions, simplification of regimens, and cost-effective alternatives.',
        ),
      ),

      // ── 16. Food Services and Nutrition ─────────────────────────────
      h(2, text('16. Food Services and Nutrition')),
      p(
        text(
          'The facility provides three nutritious meals and two snacks per day at no additional cost to residents. Menus are planned on a rotating four-week cycle and are designed to meet the Dietary Guidelines for Americans. Menus accommodate residents\' medical dietary needs (e.g., diabetic, low-sodium), food allergies, cultural preferences, and religious dietary practices.',
        ),
      ),
      p(
        text(
          'Residents are encouraged to participate in meal planning, grocery shopping, and meal preparation as a component of daily living skills training. The kitchen is inspected in accordance with local health department requirements and the facility maintains a current food handler\'s permit.',
        ),
      ),
      p(
        text(
          'Food is stored, prepared, and served in compliance with Oregon food safety regulations. Staff responsible for food preparation shall have completed an Oregon Food Handler\'s certification. Food temperature logs are maintained for refrigerators and freezers.',
        ),
      ),

      // ── 17. Transportation ──────────────────────────────────────────
      h(2, text('17. Transportation')),
      p(
        text(
          'The facility provides or arranges transportation for residents to essential appointments, including medical and psychiatric visits, substance use treatment sessions, court appearances, benefits office visits, and other approved activities. Transportation is provided using the facility\'s vehicle(s), public transit passes, or contracted transportation providers.',
        ),
      ),
      p(
        text(
          'All facility vehicles are properly registered, insured, and maintained. Staff who operate facility vehicles must hold a valid Oregon driver\'s license, maintain a clean driving record, and complete a defensive driving course. Vehicle inspection logs are maintained and reviewed monthly.',
        ),
      ),
      p(
        text(
          'Residents are encouraged to develop independent transportation skills, including use of public transit, bicycle safety, and pedestrian navigation, as part of their community reintegration goals.',
        ),
      ),

      // ── 18. Facility Maintenance ────────────────────────────────────
      h(2, text('18. Facility Maintenance')),
      p(
        text(
          'The facility shall be maintained in a clean, safe, and sanitary condition at all times. A daily, weekly, and monthly cleaning schedule is posted and followed by staff and residents. Residents participate in household chores as part of daily living skills development and community responsibility.',
        ),
      ),
      p(
        text(
          'All maintenance requests shall be documented on the Maintenance Request Log and addressed within 48 hours. Emergency maintenance issues (e.g., plumbing failures, heating system failures, broken locks) shall be addressed immediately. The facility contracts with licensed professionals for HVAC, plumbing, electrical, and pest control services as needed.',
        ),
      ),
      p(
        text(
          'The grounds, including walkways, parking areas, and outdoor recreational spaces, are maintained to ensure safety and accessibility. Snow and ice removal is performed promptly during winter months.',
        ),
      ),

      // ── 19. Recordkeeping and Documentation ─────────────────────────
      h(2, text('19. Recordkeeping and Documentation')),
      p(
        text(
          'The facility maintains a clinical record for each resident that includes, at a minimum: intake and admission documentation, assessments, individualized treatment plans and reviews, progress notes, medication records, incident reports, correspondence with external providers, discharge summaries, and aftercare plans.',
        ),
      ),
      p(
        text(
          'Progress notes are completed by the assigned clinician and direct care staff at the frequency specified in the treatment plan, but no less than weekly for clinical notes and daily for shift notes. All entries shall be legible, signed (or electronically authenticated), and dated.',
        ),
      ),
      p(
        text(
          'Records are stored securely in compliance with HIPAA and 42 CFR Part 2. Electronic records are maintained in a password-protected electronic health record (EHR) system with role-based access controls. Paper records, if any, are stored in locked file cabinets. Records are retained for a minimum of seven years after discharge, or longer if required by law.',
        ),
      ),

      // ── 20. Compliance Monitoring ───────────────────────────────────
      h(2, text('20. Compliance Monitoring')),
      p(
        text(
          'The Program Director is responsible for ongoing compliance monitoring to ensure that the facility operates in accordance with all applicable Oregon Administrative Rules, Oregon Revised Statutes, federal regulations, and internal policies and procedures.',
        ),
      ),
      p(
        text(
          'Compliance monitoring activities include monthly review of a sample of clinical records for completeness and accuracy, monthly medication storage and documentation audits, quarterly review of incident reports and grievances for trends and corrective action, annual review and update of all policies and procedures, and preparation for and cooperation with all OHA licensing reviews and inspections.',
        ),
      ),
      p(
        text(
          'Compliance findings are documented, and corrective action plans are developed and implemented within 30 days of identification. The Program Director reports compliance status to the governing body or owner on a quarterly basis.',
        ),
      ),

      // ── 21. Quality Improvement ─────────────────────────────────────
      h(2, text('21. Quality Improvement')),
      p(
        text(
          'The facility operates a continuous Quality Improvement (QI) program designed to systematically monitor, evaluate, and improve the quality and effectiveness of services. The QI program is overseen by the Program Director and includes input from staff, residents, and external stakeholders.',
        ),
      ),
      p(
        text(
          'Quality indicators tracked by the program include resident satisfaction survey results, treatment plan goal attainment rates, medication error rates, incident and grievance trends, average length of stay, discharge disposition (e.g., independent living, step-down, hospitalization), 30-day readmission rates, and staff turnover and training compliance rates.',
        ),
      ),
      p(
        text(
          'QI meetings are held monthly and include review of data, identification of improvement opportunities, development of action plans, and follow-up on previously identified action items. Meeting minutes are maintained and available for review by OHA during licensing inspections.',
        ),
      ),
      p(
        text(
          'Resident feedback is actively solicited through anonymous satisfaction surveys administered at least semi-annually, a suggestion box in the common area, and inclusion of resident representatives in QI discussions when appropriate.',
        ),
      ),

      // ── 22. Grievance Procedures ────────────────────────────────────
      h(2, text('22. Grievance Procedures')),
      p(
        text(
          'Residents have the right to file a grievance regarding any aspect of their care, treatment, or living conditions without fear of retaliation. The grievance procedure is explained to each resident at intake, is posted in a common area, and is included in the Resident Handbook.',
        ),
      ),
      p(
        text(
          'Grievances may be filed verbally or in writing to any staff member, the Program Director, or the facility\'s designated Grievance Coordinator. All grievances are documented on a Grievance Form, assigned a tracking number, and logged in the Grievance Tracking Log.',
        ),
      ),
      p(
        text(
          'The Program Director or Grievance Coordinator shall acknowledge receipt of the grievance within two business days and shall investigate and provide a written response to the resident within 10 business days. If the resident is not satisfied with the response, they may appeal to the facility\'s owner or governing body within 10 business days of receiving the response.',
        ),
      ),
      p(
        text(
          'Residents are also informed of their right to contact the OHA Behavioral Health Division, the Oregon Advocacy Center, Disability Rights Oregon, or other external advocacy organizations if they feel their grievance has not been adequately addressed.',
        ),
      ),

      // ── 23. Emergency Preparedness ──────────────────────────────────
      h(2, text('23. Emergency Preparedness')),
      p(
        text(
          'The facility maintains a comprehensive Emergency Preparedness Plan that addresses natural disasters (earthquake, flood, wildfire, severe weather), fire, power outage, water supply disruption, public health emergencies (pandemic, infectious disease outbreak), active threat situations, and building evacuation.',
        ),
      ),
      p(
        text(
          'The Emergency Preparedness Plan includes procedures for immediate response, resident and staff accountability, communication with emergency services and families, temporary relocation to a pre-identified shelter site, continuity of medication and essential services during displacement, and post-event recovery and return to operations.',
        ),
      ),
      p(
        text(
          'Fire drills are conducted at least quarterly, including at least one drill during overnight hours annually. All fire drills are documented on the Fire Drill Log, including the date, time, duration of evacuation, number of residents and staff participating, and any identified deficiencies. Corrective actions are implemented immediately.',
        ),
      ),
      p(
        text(
          'All staff are trained on the Emergency Preparedness Plan during orientation and receive refresher training at least annually. The plan is reviewed and updated annually, or whenever an actual emergency reveals deficiencies in the current plan.',
        ),
      ),
      p(
        text(
          'The facility maintains a 72-hour emergency supply kit that includes drinking water, non-perishable food, first aid supplies, flashlights, batteries, blankets, a battery-operated weather radio, essential medications, copies of resident emergency contacts, and copies of critical facility documents.',
        ),
      ),
    ],
  },
};

// =============================================================================
// Export
// =============================================================================
export const RTH_TEMPLATES: DocumentTemplate[] = [
  medicationPolicy,
  hipaaReleaseForm,
  operationalPlan,
];
