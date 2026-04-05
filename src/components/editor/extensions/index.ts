import { Node, mergeAttributes } from '@tiptap/core';

// ---------------------------------------------------------------------------
// Brand tokens
// ---------------------------------------------------------------------------
const COLORS = {
  primaryGreen: '#1B4332',
  lightGreen: '#DCFCE7',
  darkText: '#1A1916',
  midText: '#5C5A54',
  lightBg: '#F7F5F0',
  border: '#E2DED6',
  teal: '#0D9488',
  amber: '#D97706',
  blue: '#2563EB',
  red: '#DC2626',
} as const;

// ---------------------------------------------------------------------------
// 1. FormFieldExtension
// ---------------------------------------------------------------------------
export const FormFieldExtension = Node.create({
  name: 'formField',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      label: { default: '' },
      field_type: { default: 'text' },
      required: { default: false },
      value: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-form-field]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-form-field': '',
        'data-label': HTMLAttributes.label,
        'data-field-type': HTMLAttributes.field_type,
        'data-required': HTMLAttributes.required,
        'data-value': HTMLAttributes.value,
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      Object.assign(dom.style, {
        background: COLORS.lightBg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '6px',
        padding: '12px 16px',
        marginBottom: '8px',
      });

      const render = () => {
        const { label, field_type, required, value } = node.attrs;
        dom.innerHTML = '';

        // Label
        const labelEl = document.createElement('div');
        Object.assign(labelEl.style, {
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: COLORS.midText,
          marginBottom: '6px',
        });
        labelEl.textContent = label;
        if (required) {
          const asterisk = document.createElement('span');
          asterisk.textContent = ' *';
          asterisk.style.color = COLORS.red;
          labelEl.appendChild(asterisk);
        }
        dom.appendChild(labelEl);

        // Field area
        if (field_type === 'checkbox') {
          const box = document.createElement('div');
          Object.assign(box.style, {
            width: '18px',
            height: '18px',
            border: `2px solid ${COLORS.border}`,
            borderRadius: '3px',
            display: 'inline-block',
            verticalAlign: 'middle',
          });
          if (value === 'true') {
            box.style.background = COLORS.primaryGreen;
            box.textContent = '✓';
            Object.assign(box.style, {
              color: '#fff',
              textAlign: 'center',
              lineHeight: '16px',
              fontSize: '12px',
            });
          }
          dom.appendChild(box);
        } else if (field_type === 'textarea') {
          const area = document.createElement('div');
          Object.assign(area.style, {
            minHeight: '64px',
            borderBottom: `2px dotted ${COLORS.border}`,
            padding: '4px 0',
            color: COLORS.darkText,
            fontSize: '14px',
          });
          area.textContent = value || '';
          dom.appendChild(area);
        } else if (field_type === 'date') {
          const input = document.createElement('div');
          Object.assign(input.style, {
            borderBottom: `2px dotted ${COLORS.border}`,
            padding: '4px 0',
            color: value ? COLORS.darkText : COLORS.midText,
            fontSize: '14px',
          });
          input.textContent = value || '';
          const hint = document.createElement('span');
          hint.textContent = value ? '' : '  (MM/DD/YYYY)';
          hint.style.color = COLORS.midText;
          hint.style.fontSize = '11px';
          input.appendChild(hint);
          dom.appendChild(input);
        } else {
          // text / select
          const input = document.createElement('div');
          Object.assign(input.style, {
            borderBottom: `2px dotted ${COLORS.border}`,
            padding: '4px 0',
            color: value ? COLORS.darkText : COLORS.midText,
            fontSize: '14px',
            minHeight: '24px',
          });
          input.textContent = value || '';
          dom.appendChild(input);
        }
      };

      render();

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== 'formField') return false;
          node = updatedNode;
          render();
          return true;
        },
      };
    };
  },
});

// ---------------------------------------------------------------------------
// 2. SignatureBlockExtension
// ---------------------------------------------------------------------------
export const SignatureBlockExtension = Node.create({
  name: 'signatureBlock',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      role: { default: 'Administrator' },
      label: { default: '' },
      signed: { default: false },
      signature_data: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-signature-block]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-signature-block': '',
        'data-role': HTMLAttributes.role,
        'data-label': HTMLAttributes.label,
        'data-signed': HTMLAttributes.signed,
        'data-signature-data': HTMLAttributes.signature_data,
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      Object.assign(dom.style, {
        marginBottom: '12px',
      });

      const render = () => {
        const { role, signed } = node.attrs;
        dom.innerHTML = '';

        // Role label
        const roleLabel = document.createElement('div');
        Object.assign(roleLabel.style, {
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: COLORS.midText,
          marginBottom: '4px',
        });
        roleLabel.textContent = role;
        dom.appendChild(roleLabel);

        // Signature box
        const sigBox = document.createElement('div');
        Object.assign(sigBox.style, {
          height: '80px',
          border: `2px dashed ${COLORS.border}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        });

        if (signed) {
          const signedEl = document.createElement('div');
          signedEl.style.textAlign = 'center';
          const check = document.createElement('div');
          check.textContent = '✓ Signed';
          Object.assign(check.style, {
            color: COLORS.primaryGreen,
            fontWeight: '600',
            fontSize: '16px',
          });
          signedEl.appendChild(check);
          const dateEl = document.createElement('div');
          dateEl.textContent = new Date().toLocaleDateString();
          Object.assign(dateEl.style, {
            color: COLORS.midText,
            fontSize: '12px',
            marginTop: '2px',
          });
          signedEl.appendChild(dateEl);
          sigBox.appendChild(signedEl);
        } else {
          const placeholder = document.createElement('span');
          placeholder.textContent = 'Sign here';
          Object.assign(placeholder.style, {
            color: COLORS.midText,
            fontStyle: 'italic',
            fontSize: '14px',
          });
          sigBox.appendChild(placeholder);
        }
        dom.appendChild(sigBox);

        // Print Name and Date lines
        const linesContainer = document.createElement('div');
        Object.assign(linesContainer.style, {
          display: 'flex',
          gap: '24px',
          marginTop: '8px',
          fontSize: '13px',
          color: COLORS.midText,
        });

        const nameLine = document.createElement('div');
        nameLine.style.flex = '1';
        nameLine.innerHTML =
          'Print Name: <span style="border-bottom:1px solid ' +
          COLORS.border +
          ';display:inline-block;min-width:160px">&nbsp;</span>';
        linesContainer.appendChild(nameLine);

        const dateLine = document.createElement('div');
        dateLine.style.flex = '1';
        dateLine.innerHTML =
          'Date: <span style="border-bottom:1px solid ' +
          COLORS.border +
          ';display:inline-block;min-width:120px">&nbsp;</span>';
        linesContainer.appendChild(dateLine);

        dom.appendChild(linesContainer);
      };

      render();

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== 'signatureBlock') return false;
          node = updatedNode;
          render();
          return true;
        },
      };
    };
  },
});

// ---------------------------------------------------------------------------
// 3. OARReferenceExtension
// ---------------------------------------------------------------------------
export const OARReferenceExtension = Node.create({
  name: 'oarReference',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      rule_number: { default: '' },
      rule_title: { default: '' },
      description: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-oar-reference]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-oar-reference': '',
        'data-rule-number': HTMLAttributes.rule_number,
        'data-rule-title': HTMLAttributes.rule_title,
        'data-description': HTMLAttributes.description,
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      Object.assign(dom.style, {
        borderLeft: `3px solid ${COLORS.teal}`,
        background: '#F0FDFA',
        padding: '12px 16px',
        borderRadius: '0 6px 6px 0',
        marginBottom: '8px',
      });

      const render = () => {
        const { rule_number, rule_title, description } = node.attrs;
        dom.innerHTML = '';

        const numberEl = document.createElement('div');
        Object.assign(numberEl.style, {
          fontWeight: '700',
          color: COLORS.teal,
          fontSize: '13px',
          marginBottom: '2px',
        });
        numberEl.textContent = rule_number;
        dom.appendChild(numberEl);

        const titleEl = document.createElement('div');
        Object.assign(titleEl.style, {
          fontWeight: '600',
          color: COLORS.darkText,
          fontSize: '14px',
          marginBottom: '4px',
        });
        titleEl.textContent = rule_title;
        dom.appendChild(titleEl);

        if (description) {
          const descEl = document.createElement('div');
          Object.assign(descEl.style, {
            color: COLORS.midText,
            fontSize: '12px',
            lineHeight: '1.4',
          });
          descEl.textContent = description;
          dom.appendChild(descEl);
        }
      };

      render();

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== 'oarReference') return false;
          node = updatedNode;
          render();
          return true;
        },
      };
    };
  },
});

// ---------------------------------------------------------------------------
// 4. ComplianceCalloutExtension
// ---------------------------------------------------------------------------
const CALLOUT_STYLES = {
  warning: { bg: '#FFFBEB', border: COLORS.amber, icon: '\u26A0' },
  info: { bg: '#EFF6FF', border: COLORS.blue, icon: '\u2139' },
  required: { bg: '#FEF2F2', border: COLORS.red, icon: '!' },
} as const;

export const ComplianceCalloutExtension = Node.create({
  name: 'complianceCallout',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      callout_type: { default: 'info' },
      text: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-compliance-callout]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-compliance-callout': '',
        'data-callout-type': HTMLAttributes.callout_type,
        'data-text': HTMLAttributes.text,
      }),
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');

      const render = () => {
        const { callout_type, text } = node.attrs;
        const style =
          CALLOUT_STYLES[callout_type as keyof typeof CALLOUT_STYLES] ??
          CALLOUT_STYLES.info;

        dom.innerHTML = '';
        Object.assign(dom.style, {
          background: style.bg,
          borderLeft: `3px solid ${style.border}`,
          padding: '12px 16px',
          borderRadius: '0 6px 6px 0',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
        });

        const iconEl = document.createElement('span');
        Object.assign(iconEl.style, {
          fontWeight: '700',
          fontSize: '16px',
          lineHeight: '1.4',
          flexShrink: '0',
          color: style.border,
        });
        iconEl.textContent = style.icon;
        dom.appendChild(iconEl);

        const textEl = document.createElement('div');
        Object.assign(textEl.style, {
          color: COLORS.darkText,
          fontSize: '14px',
          lineHeight: '1.5',
        });
        textEl.textContent = text;
        dom.appendChild(textEl);
      };

      render();

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== 'complianceCallout') return false;
          node = updatedNode;
          render();
          return true;
        },
      };
    };
  },
});

// ---------------------------------------------------------------------------
// 5. SectionBlockExtension
// ---------------------------------------------------------------------------
export const SectionBlockExtension = Node.create({
  name: 'sectionBlock',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      section_number: { default: '' },
      section_title: { default: '' },
      oar_ref: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-section-block]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-section-block': '',
        'data-section-number': HTMLAttributes.section_number,
        'data-section-title': HTMLAttributes.section_title,
        'data-oar-ref': HTMLAttributes.oar_ref,
      }),
      0,
    ];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('div');
      Object.assign(dom.style, {
        borderTop: `2px solid ${COLORS.primaryGreen}`,
        paddingTop: '12px',
        marginBottom: '16px',
      });

      // Header area (rebuilt on update)
      const header = document.createElement('div');
      header.style.marginBottom = '8px';
      dom.appendChild(header);

      // Content area for nested blocks
      const contentDOM = document.createElement('div');
      contentDOM.style.paddingLeft = '4px';
      dom.appendChild(contentDOM);

      const renderHeader = () => {
        const { section_number, section_title, oar_ref } = node.attrs;
        header.innerHTML = '';

        if (section_number) {
          const badge = document.createElement('span');
          Object.assign(badge.style, {
            display: 'inline-block',
            background: COLORS.lightGreen,
            color: COLORS.primaryGreen,
            fontSize: '11px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '4px',
            marginBottom: '4px',
          });
          badge.textContent = section_number;
          header.appendChild(badge);
          header.appendChild(document.createElement('br'));
        }

        const titleEl = document.createElement('div');
        Object.assign(titleEl.style, {
          fontWeight: '700',
          fontSize: '18px',
          color: COLORS.darkText,
          marginBottom: '2px',
        });
        titleEl.textContent = section_title;
        header.appendChild(titleEl);

        if (oar_ref) {
          const refEl = document.createElement('div');
          Object.assign(refEl.style, {
            fontSize: '12px',
            fontStyle: 'italic',
            color: COLORS.midText,
          });
          refEl.textContent = oar_ref;
          header.appendChild(refEl);
        }
      };

      renderHeader();

      return {
        dom,
        contentDOM,
        update(updatedNode) {
          if (updatedNode.type.name !== 'sectionBlock') return false;
          node = updatedNode;
          renderHeader();
          return true;
        },
      };
    };
  },
});

// ---------------------------------------------------------------------------
// Combined export
// ---------------------------------------------------------------------------
export const complianceExtensions = [
  FormFieldExtension,
  SignatureBlockExtension,
  OARReferenceExtension,
  ComplianceCalloutExtension,
  SectionBlockExtension,
];
