type Props = { content: string }

export default function MarkdownRenderer({ content }: Props) {
  const lines = content.split('\n')
  let key = 0

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1A1916', lineHeight: 1.85 }}>
      {lines.map(line => {
        const trimmed = line.trim()
        key++

        if (!trimmed) return <div key={key} style={{ height: 12 }} />

        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={key} style={{
              fontSize: 20, fontWeight: 700, color: '#1B4332', fontFamily: 'Arial, sans-serif',
              marginTop: 28, marginBottom: 12, paddingBottom: 8,
              borderBottom: '2px solid #DCFCE7'
            }}>
              {trimmed.slice(2)}
            </h1>
          )
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={key} style={{
              fontSize: 16, fontWeight: 700, color: '#1A1916', fontFamily: 'Arial, sans-serif',
              marginTop: 24, marginBottom: 8
            }}>
              {trimmed.slice(3)}
            </h2>
          )
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={key} style={{
              fontSize: 14, fontWeight: 700, color: '#374151', fontFamily: 'Arial, sans-serif',
              marginTop: 18, marginBottom: 6
            }}>
              {trimmed.slice(4)}
            </h3>
          )
        }

        if (trimmed === '---') {
          return <hr key={key} style={{ border: 'none', borderTop: '1px solid #E2DED6', margin: '16px 0' }} />
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 4, paddingLeft: 8 }}>
              <span style={{ color: '#1B4332', fontWeight: 700, flexShrink: 0 }}>•</span>
              <span>{renderInline(trimmed.slice(2))}</span>
            </div>
          )
        }

        if (/^\d+\.\s/.test(trimmed)) {
          const num = trimmed.match(/^(\d+)\./)?.[1]
          return (
            <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 4, paddingLeft: 8 }}>
              <span style={{ color: '#1B4332', fontWeight: 700, flexShrink: 0, minWidth: 20 }}>{num}.</span>
              <span>{renderInline(trimmed.replace(/^\d+\.\s/, ''))}</span>
            </div>
          )
        }

        return (
          <p key={key} style={{ marginBottom: 8, marginTop: 0 }}>
            {renderInline(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}