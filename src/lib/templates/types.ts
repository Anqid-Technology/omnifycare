// =============================================================================
// Omnify Care — Document Template Type Definitions
// =============================================================================

/** Broad category of the document */
export type DocCategory =
  | 'policy'
  | 'form'
  | 'agreement'
  | 'operational'
  | 'training';

/** Oregon program type codes */
export type ProgramType =
  | 'rth'
  | 'rtf'
  | 'srtf'
  | 'group_home'
  | 'apd'
  | 'odds_children'
  | 'outpatient'
  | 'other';

/** A single signature captured on a document */
export interface SignatureEntry {
  /** Unique identifier for this signature */
  id: string;
  /** Role of the signer (e.g. "Program Director", "Resident", "Witness") */
  role: string;
  /** Full legal name of the signer */
  name: string;
  /** ISO-8601 timestamp when the signature was captured */
  signed_at: string;
  /** Base-64 encoded signature image data */
  signature_data: string;
  /** IP address of the device used to sign */
  ip_address: string;
}

/** Master template that ships with the platform */
export interface DocumentTemplate {
  /** Unique identifier for the template */
  id: string;
  /** Human-readable title shown in the template library */
  title: string;
  /** Short document-type label (e.g. "policy", "form") */
  doc_type: string;
  /** Oregon program type this template is written for */
  program_type: ProgramType;
  /** Regulatory agency that governs this document */
  agency: string;
  /** Broad category tag */
  category: DocCategory;
  /** One-paragraph description displayed in the template picker */
  description: string;
  /** Full TipTap JSON document tree */
  content: any;
  /** Oregon Administrative Rule reference(s) */
  oar_reference: string;
  /** Whether this template requires a paid subscription */
  is_premium: boolean;
  /** Display order within its category */
  sort_order: number;
}

/** A document that lives inside a user's program studio */
export interface StudioDocument {
  /** Unique identifier */
  id: string;
  /** ID of the program this document belongs to */
  program_id: string;
  /** ID of the user who owns / last edited this document */
  user_id: string;
  /** Document title */
  title: string;
  /** Short document-type label */
  doc_type: string;
  /** Oregon program type */
  program_type: ProgramType;
  /** Broad category tag */
  category: DocCategory;
  /** Full TipTap JSON document tree */
  content: any;
  /** Workflow status */
  status: 'draft' | 'complete' | 'signed';
  /** Whether this document was saved as a reusable template */
  is_template: boolean;
  /** ID of the master template this document was created from (if any) */
  template_id: string | null;
  /** Ordered list of signatures collected on this document */
  signatures: SignatureEntry[];
  /** Arbitrary key-value metadata (tags, audit flags, etc.) */
  metadata: Record<string, any>;
  /** Monotonically increasing version number */
  version: number;
  /** ISO-8601 creation timestamp */
  created_at: string;
  /** ISO-8601 last-updated timestamp */
  updated_at: string;
}
