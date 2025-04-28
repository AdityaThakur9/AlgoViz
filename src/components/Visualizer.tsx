import React, { useEffect } from 'react';
import { Step } from '../utils/codeParser';
import './Visualizer.css';
import MergeSortTree from './MergeSortTree';

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
  console.log("Visualizer rendering with:", { steps, currentStep, algorithmName });
  
  useEffect(() => {
    console.log("Visualizer mounted");
    return () => console.log("Visualizer unmounted");
  }, []);

  if (!steps || steps.length === 0) {
    console.log("No steps available");
    return <div className="visualizer">No visualization data available</div>;
  }

  const currentStepData = steps[currentStep];
  console.log("Current step data:", currentStepData);
  
  const array = currentStepData?.array || [];
  const comparisons = currentStepData?.comparing || [];
  const swaps = currentStepData?.swapping || [];

  // Detect algorithm type
  const algo = algorithmName.toLowerCase();

  // Algorithm-specific cues
  let pivotIndex: number | null = null;
  let partitionRange: [number, number] | null = null;
  let mergeRange: [number, number] | null = null;

  // For Quick Sort, assume pivot is the last compared index
  if (algo.includes('quick')) {
    if (comparisons.length > 0) {
      pivotIndex = comparisons[comparisons.length - 1];
      // Optionally, partitionRange could be inferred if available in step data
    }
  }
  // For Merge Sort, highlight merging region if possible
  if (algo.includes('merge')) {
    // If comparing more than one index, treat as merge region
    if (comparisons.length > 1) {
      mergeRange = [Math.min(...comparisons), Math.max(...comparisons)];
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
  };

  // Visualization renderer (bar only)
  const renderBar = () => (
    <div className="array-container">
      {array.map((value: number, index: number) => {
        const isComparing = comparisons.includes(index);
        const isSwapping = swaps.includes(index);
        const isPivot = pivotIndex === index;
        const isInMerge = mergeRange && index >= mergeRange[0] && index <= mergeRange[1];
        return (
          <div
            key={index}
            className={`array-element ${isComparing ? 'comparing' : ''} ${
              isSwapping ? 'swapping' : ''
            } ${isPivot ? 'pivot' : ''} ${isInMerge ? 'merge-region' : ''}`}
            style={{
              height: `${(value / Math.max(...array)) * 100}%`,
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
          >
            <span className="element-value">{value}</span>
            {isPivot && <span className="pivot-label">Pivot</span>}
            {isInMerge && <span className="merge-label">Merging</span>}
          </div>
        );
      })}
    </div>
  );

  // For Merge Sort, show tree diagram
  if (algo.includes('merge')) {
    // Use the initial array from the first step
    const initialArray = steps[0]?.array || [];
    return (
      <div className="visualizer">
        <h2>{algorithmName} (Tree View)</h2>
        <MergeSortTree initialArray={initialArray} steps={steps} currentStep={currentStep} />
        <div className="controls">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="control-button"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="control-button"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="visualizer">
      <h2>{algorithmName}</h2>
      {renderBar()}
      <div className="controls">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="control-button"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="control-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Visualizer; 