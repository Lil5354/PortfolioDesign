export function renderCustomCanvas(payload, artworks) {
  const items = payload.canvasItems || [];
  
  const bgImage = payload.customBackgroundUrl ? `url('${payload.customBackgroundUrl}')` : 'none';
  const widthPx = payload.canvasWidth || 1123;
  const heightPx = payload.canvasHeight || 794;

  let itemsHtml = '';
  items.forEach(item => {
    if (item.type === 'text') {
      itemsHtml += `
        <div style="position: absolute; left: ${item.left}; top: ${item.top}; width: ${item.width}; height: ${item.height}; z-index: ${item.zIndex}; overflow: hidden; display: flex; align-items: center; justify-content: center; color: ${item.color || '#000'}; font-family: '${item.fontFamily || 'Arial'}', sans-serif; font-size: ${item.fontSize || '16px'}; font-weight: ${item.fontWeight || 'normal'};">
          ${item.content}
        </div>
      `;
    } else {
      const art = artworks.find(a => a.id === item.artworkId);
      if (!art) return;
      itemsHtml += `
        <div style="position: absolute; left: ${item.left}; top: ${item.top}; width: ${item.width}; height: ${item.height}; z-index: ${item.zIndex}; overflow: hidden; display: flex; align-items: center; justify-content: center;">
          <img src="${art.coverImageUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="${art.title}" />
        </div>
      `;
    }
  });

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${payload.journalTitle} - Custom Canvas</title>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Barlow+Condensed:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Lora:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { 
      margin: 0; padding: 0; 
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .print-container {
      position: relative;
      background-color: #fff;
      background-image: ${bgImage};
      background-size: 100% 100%;
      background-position: center;
      background-repeat: no-repeat;
      overflow: hidden;
      width: ${widthPx}px;
      height: ${heightPx}px;
    }
    @media print {
      @page { 
        size: ${widthPx}px ${heightPx}px;
        margin: 0; 
      }
      body { background: transparent; display: block; }
      .print-container {
        box-shadow: none;
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="print-container" id="custom-canvas-container">
    ${itemsHtml}
  </div>
</body>
</html>
  `;
}
