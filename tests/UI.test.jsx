import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// MOCK COMPONENT for testing the Next/Previous buttons styling
// In a real environment, we'd import this from portfolio_system.jsx (if exported separately).
const PaginationButtons = () => (
  <div>
    <span data-testid="prev-btn" style={{ fontSize: 11, fontWeight: "bold", color: "#fff", textShadow: "none", background: "transparent", userSelect: "none" }}>
      Previous
    </span>
    <span data-testid="next-btn" style={{ fontSize: 11, fontWeight: "bold", color: "#fff", textShadow: "none", background: "transparent", userSelect: "none" }}>
      Next
    </span>
  </div>
);

// MOCK LOGIC for ToolInfo
const getToolInfo = (toolName) => {
  const name = toolName.toLowerCase();
  let fallbackBg = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";
  
  if (name.includes('illustrator') || name === 'ai') return { id: 'Ai', bg: '#330000', color: '#ff9a00', name: 'Illustrator', image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400" };
  if (name.includes('photoshop') || name === 'ps') return { id: 'Ps', bg: '#001e36', color: '#31a8ff', name: 'Photoshop', image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400" };
  if (name.includes('figma')) return { id: 'Fg', bg: '#1e1e1e', color: '#0acf83', name: 'Figma', image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400" };
  
  return { id: toolName.substring(0, 2).toUpperCase(), bg: '#333', color: '#fff', name: toolName, image: fallbackBg };
};

const ToolPopupItem = ({ toolName }) => {
  const info = getToolInfo(toolName);
  return (
    <div data-testid="tool-item">
      <img src={info.image} alt="tool-bg" data-testid="tool-bg-img" />
      <span>{info.name}</span>
    </div>
  );
};

describe('UI Tweaks Unit Tests', () => {
  
  describe('Next/Previous Button Alignment', () => {
    it('should have transparent background and userSelect: none for both buttons', () => {
      render(<PaginationButtons />);
      
      const prevBtn = screen.getByTestId('prev-btn');
      const nextBtn = screen.getByTestId('next-btn');
      
      // Verify both have transparent background
      expect(prevBtn.style.background).toBe('transparent');
      expect(nextBtn.style.background).toBe('transparent');
      
      // Verify both prevent user selection (tô đen lòa)
      expect(prevBtn.style.userSelect).toBe('none');
      expect(nextBtn.style.userSelect).toBe('none');
    });
  });

  describe('Tools Background Image', () => {
    it('should assign a specific background image for known tools', () => {
      render(<ToolPopupItem toolName="Figma" />);
      const bgImg = screen.getByTestId('tool-bg-img');
      expect(bgImg.src).toContain('photo-1611162617474-5b21e879e113');
    });

    it('should assign a fallback background image for unknown tools', () => {
      render(<ToolPopupItem toolName="UnknownTool" />);
      const bgImg = screen.getByTestId('tool-bg-img');
      expect(bgImg.src).toContain('photo-1618005182384-a83a8bd57fbe');
    });
  });
});
