import React, { useEffect, useRef } from 'react';
import { Step } from '../utils/codeParser';
import './Visualizer.css';

interface VisualizerProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  algorithmName: string;
}

const Visualizer: React.FC<VisualizerProps> = ({
  steps,
  currentStep,
  onStepChange,
  algorithmName,
}) => {
  // Ref for the container to handle keyboard navigation
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {};
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentStep > 0) {
        onStepChange(currentStep - 1);
      } else if (e.key === 'ArrowRight' && currentStep < steps.length - 1) {
        onStepChange(currentStep + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, steps.length, onStepChange]);

  // Handle touch gestures for mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };
    const handleSwipe = () => {
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && currentStep > 0) {
          onStepChange(currentStep - 1);
        } else if (swipeDistance < 0 && currentStep < steps.length - 1) {
          onStepChange(currentStep + 1);
        }
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentStep, steps.length, onStepChange]);

  if (!steps || steps.length === 0) {
    return <div className="visualizer" role="alert">No visualization data available</div>;
  }

  const currentStepData = steps[currentStep];
  const array = currentStepData?.array || [];
  const comparisons = currentStepData?.comparing || [];
  const swaps = currentStepData?.swapping || [];
  const algo = algorithmName.toLowerCase();

  let pivotIndex: number | null = null;
  let mergeRange: [number, number] | null = null;
  if (algo.includes('quick')) {
    if (comparisons.length > 0) {
      pivotIndex = comparisons[comparisons.length - 1];
    }
  }
  if (algo.includes('merge')) {
    if (comparisons.length > 1) {
      mergeRange = [Math.min(...comparisons), Math.max(...comparisons)];
    }
  }

  const renderBar = () => {
    const maxValue = Math.max(...array);
    return (
      <div className="array-container" role="region" aria-label={`${algorithmName} visualization`}>
        {array.map((value: number, index: number) => {
          const isComparing = comparisons.includes(index);
          const isSwapping = swaps.includes(index);
          const isPivot = pivotIndex === index;
          const isInMerge = mergeRange && index >= mergeRange[0] && index <= mergeRange[1];
          let ariaLabel = `Element ${index + 1} with value ${value}`;
          if (isComparing) ariaLabel += ', being compared';
          if (isSwapping) ariaLabel += ', being swapped';
          if (isPivot) ariaLabel += ', pivot element';
          if (isInMerge) ariaLabel += ', part of merge region';
          return (
            <div
              key={index}
              className={`array-element ${isComparing ? 'comparing' : ''} ${isSwapping ? 'swapping' : ''} ${isPivot ? 'pivot' : ''} ${isInMerge ? 'merge-region' : ''}`}
              style={{
                height: `${(value / maxValue) * 100}%`,
                margin: '0 2px',
                border: isPivot ? '3px solid #ff9800' : isInMerge ? '3px dashed #00bcd4' : undefined,
                background:
                  isSwapping
                    ? '#e53935'
                    : isPivot
                    ? '#ff9800'
                    : isInMerge
                    ? '#b2ebf2'
                    : isComparing
                    ? '#1976d2'
                    : '#90caf9',
                transition: 'all 0.2s',
              }}
              role="img"
              aria-label={ariaLabel}
            >
              <span className="element-value-inside">{value}</span>
              {isPivot && <span className="pivot-label">Pivot</span>}
              {isInMerge && <span className="merge-label">Merging</span>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="visualizer" ref={containerRef} tabIndex={0} role="region" aria-label={`${algorithmName} visualization`}>
      <h2>{algorithmName}</h2>
      {renderBar()}
      <div className="accessibility-info" aria-live="polite">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  );
};

export default Visualizer; 