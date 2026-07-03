import React, { useState, useEffect, useRef } from 'react';

const JustifiedGrid = ({ 
  images = [], 
  targetRowHeight = 250, 
  maxImagesPerRow = 4,
  spacing = 2,
  renderImage = null,
  animate = false,
  watermarkText = "UEF",
  targetWidth = 0,
  targetHeight = 0
}) => {
  const [loadedImages, setLoadedImages] = useState([]);
  const [containerSize, setContainerSize] = useState({ width: targetWidth || 800, height: targetHeight || 600 });
  const containerRef = useRef(null);

  // Measure container
  useEffect(() => {
    if (targetWidth > 0 && targetHeight > 0) {
      setContainerSize({ width: targetWidth, height: targetHeight });
      return;
    }
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        if (width > 0 && height > 0) {
          setContainerSize({ width, height });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [targetWidth, targetHeight]);

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
    if (images && images.length > 0) {
      loadDimensions();
    } else {
      setLoadedImages([]);
    }
    return () => { active = false; };
  }, [images]);

  if (loadedImages.length === 0) {
    return <div ref={containerRef} className="w-full h-full min-h-[10px]"></div>;
  }

  const targetAspect = containerSize.width / Math.max(1, containerSize.height);

  let bestPartition = null;
  let bestScore = Infinity;
  let bestRg = 1;

  // Find the partition that has a natural aspect ratio closest to the container's aspect ratio
  for (let trh = 50; trh <= 1200; trh += 50) {
    const rows = [];
    let currentGroup = [];
    let currentRowRatio = 0;
    
    loadedImages.forEach((image, index) => {
      currentGroup.push(image);
      currentRowRatio += image.aspectRatio;

      const estimatedHeight = containerSize.width / currentRowRatio;
      
      if (estimatedHeight <= trh || currentGroup.length >= maxImagesPerRow || index === loadedImages.length - 1) {
        rows.push({
          images: currentGroup,
          flexWeight: 1 / currentRowRatio
        });
        currentGroup = [];
        currentRowRatio = 0;
      }
    });

    let sumInverseS = 0;
    rows.forEach(r => sumInverseS += r.flexWeight);
    const Rg = 1 / sumInverseS;
    
    const score = Math.max(Rg / targetAspect, targetAspect / Rg);
    
    if (score < bestScore) {
      bestScore = score;
      bestPartition = rows;
      bestRg = Rg;
    }
  }

  const rows = bestPartition || [];

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center w-full h-full overflow-hidden" 
    >
      <div 
        className="flex flex-col relative"
        style={{ 
          aspectRatio: `${bestRg} / 1`,
          width: bestRg >= targetAspect ? '100%' : 'auto',
          height: bestRg < targetAspect ? '100%' : 'auto',
          maxHeight: '100%',
          maxWidth: '100%',
          gap: `${spacing}px` 
        }}
      >
        {rows.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className="flex flex-row w-full" 
            style={{ gap: `${spacing}px`, flex: `${row.flexWeight} 1 0%` }}
          >
            {row.images.map((img, colIndex) => (
              <div 
                key={img.id || colIndex} 
                style={{ 
                  flex: `${img.aspectRatio} 1 0%`, 
                  minWidth: 0, 
                  position: 'relative', 
                  overflow: 'hidden'
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
    </div>
  );
};

export default JustifiedGrid;
