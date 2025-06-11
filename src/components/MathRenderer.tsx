import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ math, block = false, className = '' }) => {
  try {
    if (block) {
      return (
        <div className={`my-4 text-center ${className}`}>
          <BlockMath math={math} />
        </div>
      );
    } else {
      return (
        <span className={className}>
          <InlineMath math={math} />
        </span>
      );
    }
  } catch (error) {
    console.error('Math rendering error:', error);
    return <span className="text-red-500 bg-red-50 px-2 py-1 rounded">Math Error: {math}</span>;
  }
};

export default MathRenderer;