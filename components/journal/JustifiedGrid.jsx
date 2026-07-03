import React, { useState, useEffect } from 'react';

const JustifiedGrid = ({ 
  images = [], 
  targetRowHeight = 250, 
  maxImagesPerRow = 4,
  spacing = 2,
  renderImage = null,
  animate = false,
  watermarkText = "UEF"
}) => {
  const [loadedImages, setLoadedImages] = useState([]);

  // Load image dimensions
  useEffect(() => {
    let active = true;
    const loadDimensions = async () => {
      const promises = images.map(async (imgObj) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ ...imgObj, aspectRatio: img.naturalWidth / Math.max(1, img.naturalHeight) });
          img.onerror = () => resolve({ ...imgObj, aspectRatio: 1 });
          img.src = imgObj.content || imgObj.url;
        });
      });

      const results = await Promise.all(promises);
      if (active) setLoadedImages(results);
    };
    loadDimensions();
    return () => { active = false; };
  }, [images]);

  if (loadedImages.length === 0) {
    return <div className="w-full h-full"></div>;
  }

  // Partition images into rows
  const rows = [];
  let currentGroup = [];
  let currentRowRatio = 0;

  loadedImages.forEach((image, index) => {
    currentGroup.push(image);
    currentRowRatio += image.aspectRatio;

    // Estimate row height if width was ~800 to determine row breaks
    const estimatedHeight = 800 / currentRowRatio;
    
    if (estimatedHeight <= targetRowHeight || currentGroup.length >= maxImagesPerRow || index === loadedImages.length - 1) {
      rows.push({
        images: currentGroup,
        flexWeight: 1 / currentRowRatio // natural height is proportional to 1 / sum(aspectRatios)
      });
      currentGroup = [];
      currentRowRatio = 0;
    }
  });

  return (
    <div 
      className="flex flex-col w-full relative overflow-hidden" 
      style={{ gap: `${spacing}px` }}
    >
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex flex-row w-full" 
          style={{ gap: `${spacing}px` }}
        >
          {row.images.map((img, colIndex) => (
            <div 
              key={img.id || colIndex} 
              style={{ 
                flex: `${img.aspectRatio} 1 0%`, 
                minWidth: 0, 
                position: 'relative', 
                overflow: 'hidden',
                aspectRatio: `${img.aspectRatio} / 1`
              }}
              className={`${animate ? "transition-all duration-300" : ""}`}
            >
              {renderImage ? renderImage(img) : (
                <>
                  <img 
                    src={img.content || img.url} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    alt="" 
                    draggable={false}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider pointer-events-none">
                    {watermarkText}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default JustifiedGrid;
