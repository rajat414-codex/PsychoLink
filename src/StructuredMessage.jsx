import React from 'react';

const StructuredMessage = ({ content, accent = '#8b5cf6' }) => {
  if (!content) return null;

  // Split content into blocks based on double newlines
  const blocks = content.split(/\n\n+/);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', lineHeight: '1.6' }}>
      {blocks.map((block, idx) => {
        // Check if block is a heading (starts with an emoji and bold text or just bold text like **Title**)
        const isHeading = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2B05|\u2B06|\u2B07|\u2B1B|\u2B1C|\u2B50|\u2B55|\u231A|\u231B|\u2328|\u23CF|[\u23E9-\u23F3]|[\u23F8-\u23FA]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])?\s*\*\*.+?\*\*/.test(block.trim());
        
        if (isHeading) {
          // Extract the heading and the body of the block
          const lines = block.split('\n');
          const headingLine = lines[0];
          const bodyLines = lines.slice(1).join('\n');
          
          // Remove asterisks from heading
          const cleanHeading = headingLine.replace(/\*\*/g, '').trim();

          return (
            <div key={idx} style={{ 
              background: 'rgba(255,255,255,0.03)', 
              border: `1px solid ${accent}40`, 
              borderRadius: '12px', 
              padding: '14px 16px',
              borderLeft: `4px solid ${accent}`
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {cleanHeading}
              </h4>
              {bodyLines && (
                <div style={{ color: 'rgba(255,255,255,0.85)', whiteSpace: 'pre-wrap' }}>
                  {formatInlineText(bodyLines)}
                </div>
              )}
            </div>
          );
        }

        // Check if it's a list
        if (block.trim().startsWith('- ') || block.trim().startsWith('* ')) {
          const listItems = block.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('*'));
          return (
            <ul key={idx} style={{ margin: '0', paddingLeft: '20px', color: 'rgba(255,255,255,0.9)' }}>
              {listItems.map((item, i) => (
                <li key={i} style={{ marginBottom: '6px' }}>
                  {formatInlineText(item.replace(/^[-*]\s*/, ''))}
                </li>
              ))}
            </ul>
          );
        }

        // Regular paragraph
        return (
          <div key={idx} style={{ color: 'rgba(255,255,255,0.9)', whiteSpace: 'pre-wrap' }}>
            {formatInlineText(block)}
          </div>
        );
      })}
    </div>
  );
};

// Helper to format bold text (**text**) inline
const formatInlineText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: '#fff', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default StructuredMessage;
