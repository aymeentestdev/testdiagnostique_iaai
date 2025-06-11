import React from 'react';
import MathRenderer from './MathRenderer';

interface QuestionRendererProps {
  content: string;
  className?: string;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ content, className = '' }) => {
  // Parse content to identify math expressions
  const parseContent = (text: string) => {
    const parts = [];
    let currentIndex = 0;
    
    // Find inline math expressions (wrapped in $...$)
    const inlineMathRegex = /\$([^$]+)\$/g;
    // Find block math expressions (wrapped in $$...$$)
    const blockMathRegex = /\$\$([^$]+)\$\$/g;
    
    // First handle block math
    let blockMatch;
    const blockMatches = [];
    while ((blockMatch = blockMathRegex.exec(text)) !== null) {
      blockMatches.push({
        start: blockMatch.index,
        end: blockMatch.index + blockMatch[0].length,
        math: blockMatch[1],
        type: 'block'
      });
    }
    
    // Then handle inline math (excluding those inside block math)
    let inlineMatch;
    const inlineMatches = [];
    while ((inlineMatch = inlineMathRegex.exec(text)) !== null) {
      // Check if this inline match is inside a block match
      const isInsideBlock = blockMatches.some(block => 
        inlineMatch.index >= block.start && inlineMatch.index < block.end
      );
      
      if (!isInsideBlock) {
        inlineMatches.push({
          start: inlineMatch.index,
          end: inlineMatch.index + inlineMatch[0].length,
          math: inlineMatch[1],
          type: 'inline'
        });
      }
    }
    
    // Combine and sort all matches
    const allMatches = [...blockMatches, ...inlineMatches].sort((a, b) => a.start - b.start);
    
    // Build the result
    allMatches.forEach((match, index) => {
      // Add text before this match
      if (currentIndex < match.start) {
        const textPart = text.slice(currentIndex, match.start);
        if (textPart) {
          parts.push(<span key={`text-${index}`}>{textPart}</span>);
        }
      }
      
      // Add the math component
      parts.push(
        <MathRenderer
          key={`math-${index}`}
          math={match.math}
          block={match.type === 'block'}
        />
      );
      
      currentIndex = match.end;
    });
    
    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      if (remainingText) {
        parts.push(<span key="text-final">{remainingText}</span>);
      }
    }
    
    return parts.length > 0 ? parts : [text];
  };
  
  const renderedContent = parseContent(content);
  
  return (
    <div className={className}>
      {renderedContent}
    </div>
  );
};

export default QuestionRenderer;