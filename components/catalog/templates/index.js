import { renderClassic } from './classic.js';
import { renderModern } from './modern.js';
import { renderAsymmetrical } from './asymmetrical.js';
import { renderCustomCanvas } from './custom_canvas.js';

export function generatePreviewHTML(payload, sortedEnabled) {
  if (payload.layoutMode === 'custom_canvas') {
    return renderCustomCanvas(payload, sortedEnabled);
  }

  switch (payload.layoutTheme) {
    case 'classic': return renderClassic(payload, sortedEnabled);
    case 'modern': return renderModern(payload, sortedEnabled);
    case 'asymmetrical': return renderAsymmetrical(payload, sortedEnabled);
    default: return renderModern(payload, sortedEnabled);
  }
}

export function generatePrintReadyHTML(payload, artworks) {
  const html = generatePreviewHTML(payload, artworks);
  const printCSS = `
    <style>
      @media print {
        @page { size: ${payload.pdfSize === 'A4' ? 'A4 portrait' : '210mm 210mm'}; margin: 0; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .page, .cover, .page-foreword, .page-toc, .page-closing, .page-spread, .page-body {
          page-break-after: always !important;
          break-after: page !important;
        }
        .page-spread > div, .work-card, .article-card, .highlight-box, .stat-item, .work-block, [style*="border:1px solid"] {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        body { margin: 0 !important; }
      }
    </style>
  `;
  return html.replace('</head>', printCSS + '</head>');
}
