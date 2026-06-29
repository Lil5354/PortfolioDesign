import React, { useState, useEffect, useRef } from 'react';

const JustifiedGrid = ({ 
  images = [], 
  containerWidth = 'auto', 
  targetRowHeight = 250, 
  maxImagesPerRow = 4,
  spacing = 2,
  renderImage = null,
  animate = false
}) => {
  const [loadedImages, setLoadedImages] = useState([]);
  const [layoutImages, setLayoutImages] = useState([]);
  const [measuredWidth, setMeasuredWidth] = useState(typeof containerWidth === 'number' ? containerWidth : 800);
  const containerRef = useRef(null);

  // Measure container width if 'auto'
  useEffect(() => {
    if (containerWidth !== 'auto') {
      setMeasuredWidth(containerWidth);
      return;
    }
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        // Adjust width slightly to avoid rounding issues causing premature wrapping
        setMeasuredWidth(entries[0].contentRect.width - 1);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerWidth]);

  // Load image dimensions
  useEffect(() => {
    let active = true;
    const loadDimensions = async () => {
      const promises = images.map(async (imgObj) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ ...imgObj, width: img.naturalWidth, height: img.naturalHeight });
          img.onerror = () => resolve({ ...imgObj, width: 800, height: 600 });
          img.src = imgObj.content || imgObj.url;
        });
      });

      const results = await Promise.all(promises);
      if (active) setLoadedImages(results);
    };
    loadDimensions();
    return () => { active = false; };
  }, [images]);

  // Compute layout
  useEffect(() => {
    if (loadedImages.length === 0 || measuredWidth <= 0) {
      setLayoutImages([]);
      return;
    }

    const computedImages = [];
    let currentRow = [];
    let currentRowRatio = 0;

    loadedImages.forEach((image, index) => {
      const aspectRatio = image.width / image.height;
      currentRow.push({ ...image, aspectRatio });
      currentRowRatio += aspectRatio;

      const safeWidth = Math.max(0, measuredWidth - 1); // Subtract 1px to prevent floating point layout wrapping issues
      const expectedHeight = (safeWidth - (currentRow.length - 1) * spacing) / currentRowRatio;
      
      if (expectedHeight <= targetRowHeight || currentRow.length >= maxImagesPerRow || index === loadedImages.length - 1) {
        let finalHeight = expectedHeight;

        currentRow.forEach(img => {
          computedImages.push({
            ...img,
            renderedWidth: img.aspectRatio * finalHeight,
            renderedHeight: finalHeight
          });
        });

        currentRow = [];
        currentRowRatio = 0;
      }
    });

    setLayoutImages(computedImages);
  }, [loadedImages, measuredWidth, spacing, targetRowHeight, maxImagesPerRow]);

  if (loadedImages.length === 0) {
    return (
      <div className="w-full min-h-[200px] bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-300">
        <span className="text-gray-400 font-medium">Empty Grid</span>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`flex flex-row flex-wrap mx-auto ${containerWidth === 'auto' ? 'w-full' : ''}`} 
      style={{ 
        gap: `${spacing}px`, 
        width: containerWidth !== 'auto' ? `${containerWidth}px` : undefined,
        maxWidth: '100%' 
      }}
    >
      {layoutImages.map((img, index) => {
        const key = img.id || index;
        if (renderImage) {
          return (
            <div 
              key={key} 
              className={animate ? "transition-all duration-300 ease-out" : ""}
              style={{ width: img.renderedWidth, height: img.renderedHeight }}
            >
              {renderImage(img)}
            </div>
          );
        }
        return (
          <div 
            key={key}
            className={`relative overflow-hidden bg-gray-100 ${animate ? 'transition-all duration-300 ease-out' : ''}`}
            style={{ width: img.renderedWidth, height: img.renderedHeight }}
          >
            <img 
              src={img.content || img.url} 
              className="w-full h-full object-cover" 
              alt="" 
              draggable={false}
            />
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
              UEF
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JustifiedGrid;
