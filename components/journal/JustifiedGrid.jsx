import React, { useState, useEffect, useRef } from 'react';

const JustifiedGrid = ({ 
  images = [], 
  containerWidth = 800, 
  targetRowHeight = 250, 
  maxImagesPerRow = 4,
  spacing = 2 
}) => {
  const [loadedImages, setLoadedImages] = useState([]);
  const [layoutRows, setLayoutRows] = useState([]);

  // Load image dimensions
  useEffect(() => {
    let active = true;
    const loadDimensions = async () => {
      const promises = images.map(async (imgObj) => {
        if (imgObj.width && imgObj.height) return imgObj;
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve({ ...imgObj, width: img.naturalWidth, height: img.naturalHeight });
          };
          img.onerror = () => {
            resolve({ ...imgObj, width: 800, height: 600 }); // Fallback
          };
          img.src = imgObj.content || imgObj.url;
        });
      });

      const results = await Promise.all(promises);
      if (active) {
        setLoadedImages(results);
      }
    };
    loadDimensions();
    return () => { active = false; };
  }, [images]);

  // Compute layout when containerWidth or loadedImages change
  useEffect(() => {
    if (loadedImages.length === 0) {
      setLayoutRows([]);
      return;
    }

    const rows = [];
    let currentRow = [];
    let currentRowRatio = 0;

    loadedImages.forEach((image, index) => {
      const aspectRatio = image.width / image.height;
      currentRow.push({ ...image, aspectRatio });
      currentRowRatio += aspectRatio;

      // Check if row is full enough or reached max images
      const expectedHeight = (containerWidth - (currentRow.length - 1) * spacing) / currentRowRatio;
      
      if (expectedHeight <= targetRowHeight || currentRow.length >= maxImagesPerRow || index === loadedImages.length - 1) {
        // Finalize row
        let finalHeight = expectedHeight;
        
        // If it's the last row and it's not full, don't stretch it too much
        if (index === loadedImages.length - 1 && expectedHeight > targetRowHeight * 1.5) {
          finalHeight = targetRowHeight;
        }

        const sizedImages = currentRow.map(img => ({
          ...img,
          renderedWidth: img.aspectRatio * finalHeight,
          renderedHeight: finalHeight
        }));

        rows.push({
          images: sizedImages,
          height: finalHeight
        });

        currentRow = [];
        currentRowRatio = 0;
      }
    });

    setLayoutRows(rows);
  }, [loadedImages, containerWidth, spacing, targetRowHeight, maxImagesPerRow]);

  if (loadedImages.length === 0) {
    return (
      <div className="w-full min-h-[200px] bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-300">
        <span className="text-gray-400 font-medium">Empty Grid</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col" style={{ gap: `${spacing}px` }}>
      {layoutRows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className="flex flex-row w-full overflow-hidden" 
          style={{ height: row.height, gap: `${spacing}px` }}
        >
          {row.images.map((img, imgIndex) => (
            <div 
              key={img.id || `${rowIndex}-${imgIndex}`}
              className="relative overflow-hidden bg-gray-100"
              style={{ width: img.renderedWidth, height: row.height }}
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
          ))}
        </div>
      ))}
    </div>
  );
};

export default JustifiedGrid;
